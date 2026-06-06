import { Injectable } from '@nestjs/common';
import { SourceDetectorService } from './source-detector.service';
import { NormalizeProblemInput, NormalizedProblem } from './types';

@Injectable()
export class ProblemNormalizerService {
  constructor(private readonly sourceDetector: SourceDetectorService) {}

  normalize(input: NormalizeProblemInput): NormalizedProblem {
    const metadata = {
      ...input.metadata,
      ...(input.problemNumber ? { problemNumber: input.problemNumber } : {}),
    };

    return this.removeUndefined({
      source: input.url ? this.sourceDetector.detect(input.url) : 'unknown',
      url: input.url,
      title: input.url ? this.titleFromUrl(input.url) : undefined,
      statement: input.statement?.trim() || undefined,
      metadata: Object.keys(metadata).length ? metadata : undefined,
    });
  }

  private titleFromUrl(url: string): string | undefined {
    try {
      const segments = new URL(url).pathname.split('/').filter(Boolean);
      const candidate = [...segments]
        .reverse()
        .find((segment) => !/^\d+$/.test(segment));

      if (!candidate) {
        return undefined;
      }

      return decodeURIComponent(candidate)
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
    } catch {
      return undefined;
    }
  }

  private removeUndefined(problem: NormalizedProblem): NormalizedProblem {
    return Object.fromEntries(
      Object.entries(problem).filter(([, value]) => value !== undefined),
    ) as unknown as NormalizedProblem;
  }
}
