import { BadRequestException } from '@nestjs/common';
import { ContentAdapterRegistryService } from '../src/problem-ingestion/content-adapter-registry.service';
import { IngestionService } from '../src/problem-ingestion/ingestion.service';
import { ProblemNormalizerService } from '../src/problem-ingestion/problem-normalizer.service';
import { SourceDetectorService } from '../src/problem-ingestion/source-detector.service';
import { UrlExtractorService } from '../src/problem-ingestion/url-extractor.service';
import { SessionStorageService } from '../src/session/session-storage.service';

describe('IngestionService', () => {
  let sessions: SessionStorageService;
  let service: IngestionService;
  let contentAdapters: ContentAdapterRegistryService;

  beforeEach(() => {
    sessions = new SessionStorageService();
    contentAdapters = new ContentAdapterRegistryService();
    service = new IngestionService(
      new UrlExtractorService(),
      new ProblemNormalizerService(new SourceDetectorService()),
      sessions,
      contentAdapters,
    );
  });

  it('normalizes a bare problem number without assuming a platform', async () => {
    const result = await service.ingest({
      userId: 'u1',
      content: '@AlgoBot 560',
    });

    expect(result.inputType).toBe('problem-number');
    expect(result.normalizedProblem).toEqual({
      source: 'unknown',
      metadata: { problemNumber: '560' },
    });
  });

  it('normalizes a supported problem URL', async () => {
    const result = await service.ingest({
      userId: 'u1',
      content:
        'https://www.naukri.com/code360/problems/aggressive-cows_1082559.',
    });

    expect(result.inputType).toBe('problem-url');
    expect(result.normalizedProblem.source).toBe('code360');
    expect(result.normalizedProblem.title).toBe('Aggressive Cows 1082559');
  });

  it('normalizes raw statements', async () => {
    const statement =
      'Given an array nums and an integer k, return the total number of subarrays whose sum equals k.';
    const result = await service.ingest({ userId: 'u1', content: statement });

    expect(result.inputType).toBe('raw-statement');
    expect(result.normalizedProblem).toEqual({
      source: 'unknown',
      statement,
    });
  });

  it('stores mixed URL input and reuses it for future commands', async () => {
    const url = 'https://leetcode.com/problems/subarray-sum-equals-k';
    const first = await service.ingest({
      userId: 'u1',
      content: `${url}\nhint`,
    });
    const second = await service.ingest({
      userId: 'u1',
      content: '@AlgoBot hint',
    });

    expect(first.inputType).toBe('mixed');
    expect(first.command).toBe('hint');
    expect(second.inputType).toBe('session-command');
    expect(second.normalizedProblem).toEqual(first.normalizedProblem);
    expect(sessions.get('u1')).toMatchObject({
      currentProblemUrl: url,
      normalizedProblem: first.normalizedProblem,
      hintLevel: 2,
    });
    expect(sessions.get('u1')?.lastInteraction).toBeInstanceOf(Date);
  });

  it('keeps sessions isolated by user', async () => {
    await service.ingest({
      userId: 'u1',
      content: 'https://cses.fi/problemset/task/1068',
    });

    await expect(
      service.ingest({ userId: 'u2', content: 'hint' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects future content types until an adapter is registered', async () => {
    await expect(
      service.ingest({
        userId: 'u1',
        content: 'screenshot-id',
        contentType: 'image',
      }),
    ).rejects.toThrow('No image ingestion adapter is registered');
  });

  it('normalizes future content through registered adapters', async () => {
    contentAdapters.register({
      contentType: 'ocr',
      extract: async () => ({
        statement: 'Find the maximum subarray sum.',
        metadata: { extractionConfidence: 0.98 },
      }),
    });

    const result = await service.ingest({
      userId: 'u1',
      content: { uploadId: 'upload-1' },
      contentType: 'ocr',
    });

    expect(result.inputType).toBe('external-content');
    expect(result.normalizedProblem).toEqual({
      source: 'unknown',
      statement: 'Find the maximum subarray sum.',
      metadata: { extractionConfidence: 0.98 },
    });
  });
});
