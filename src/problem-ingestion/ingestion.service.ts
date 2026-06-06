import { BadRequestException, Injectable } from '@nestjs/common';
import { SessionStorageService } from '../session/session-storage.service';
import { ContentAdapterRegistryService } from './content-adapter-registry.service';
import { IngestProblemDto } from './dto/ingest-problem.dto';
import { ProblemNormalizerService } from './problem-normalizer.service';
import {
  IngestionResult,
  MentorCommand,
  NormalizeProblemInput,
  ProblemInputType,
} from './types';
import { UrlExtractorService } from './url-extractor.service';

const COMMANDS: ReadonlyArray<{
  command: MentorCommand;
  pattern: RegExp;
}> = [
  { command: 'hint', pattern: /^hint\b/i },
  { command: 'pattern', pattern: /^pattern\b/i },
  { command: 'brute-force', pattern: /^brute[\s-]*force\b/i },
  { command: 'optimal', pattern: /^optimal\b/i },
  { command: 'similar', pattern: /^similar\b/i },
  { command: 'complexity', pattern: /^complexity\b/i },
  { command: 'solution', pattern: /^solution\b/i },
  { command: 'explain', pattern: /^explain\b/i },
];

@Injectable()
export class IngestionService {
  constructor(
    private readonly urlExtractor: UrlExtractorService,
    private readonly normalizer: ProblemNormalizerService,
    private readonly sessions: SessionStorageService,
    private readonly contentAdapters: ContentAdapterRegistryService,
  ) {}

  async ingest(dto: IngestProblemDto): Promise<IngestionResult> {
    const contentType = dto.contentType ?? 'text';

    if (contentType !== 'text') {
      const input = await this.contentAdapters.extract(contentType, dto.content);
      const normalizedProblem = this.normalizer.normalize({
        ...input,
        metadata: { ...input.metadata, ...dto.metadata },
      });

      this.sessions.setProblem(dto.userId, normalizedProblem);
      return {
        normalizedProblem,
        inputType: 'external-content',
        extractedUrls: normalizedProblem.url ? [normalizedProblem.url] : [],
      };
    }

    if (typeof dto.content !== 'string') {
      throw new BadRequestException('Text ingestion requires string content');
    }

    const message = this.removeBotMention(dto.content).trim();
    const extractedUrls = this.urlExtractor.extract(message);
    const textWithoutUrls = this.urlExtractor.remove(message);
    const command = this.detectCommand(textWithoutUrls);

    if (!extractedUrls.length && command) {
      return this.useSessionProblem(dto.userId, command);
    }

    const { input, inputType } = this.classify(
      extractedUrls,
      textWithoutUrls,
      command,
      dto.metadata,
    );
    const normalizedProblem = this.normalizer.normalize(input);

    this.sessions.setProblem(dto.userId, normalizedProblem);
    this.updateCommandState(dto.userId, command);

    return {
      normalizedProblem,
      inputType,
      command,
      extractedUrls,
    };
  }

  private classify(
    urls: string[],
    remainingText: string,
    command: MentorCommand | undefined,
    metadata: Record<string, unknown> | undefined,
  ): { input: NormalizeProblemInput; inputType: ProblemInputType } {
    if (urls.length) {
      return {
        input: {
          url: urls[0],
          statement: remainingText && !command ? remainingText : undefined,
          metadata: {
            ...metadata,
            ...(urls.length > 1 ? { additionalUrls: urls.slice(1) } : {}),
          },
        },
        inputType: command || remainingText ? 'mixed' : 'problem-url',
      };
    }

    if (/^\d+$/.test(remainingText)) {
      return {
        input: { problemNumber: remainingText, metadata },
        inputType: 'problem-number',
      };
    }

    if (remainingText) {
      return {
        input: { statement: remainingText, metadata },
        inputType: 'raw-statement',
      };
    }

    throw new BadRequestException('No problem or command was provided');
  }

  private useSessionProblem(
    userId: string,
    command: MentorCommand,
  ): IngestionResult {
    const normalizedProblem = this.sessions.get(userId)?.normalizedProblem;

    if (!normalizedProblem) {
      throw new BadRequestException(
        'Send a problem URL, number, or statement before requesting help',
      );
    }

    this.updateCommandState(userId, command);
    return {
      normalizedProblem,
      inputType: 'session-command',
      command,
      extractedUrls: [],
    };
  }

  private detectCommand(message: string): MentorCommand | undefined {
    return COMMANDS.find(({ pattern }) => pattern.test(message))?.command;
  }

  private updateCommandState(
    userId: string,
    command: MentorCommand | undefined,
  ): void {
    if (command === 'hint') {
      this.sessions.incrementHintLevel(userId);
      return;
    }

    this.sessions.touch(userId);
  }

  private removeBotMention(message: string): string {
    return message.replace(/^@?algobot\b[:,]?\s*/i, '');
  }
}
