import { NormalizedProblem } from './normalized-problem.interface';

export type IngestionContentType = 'text' | 'ocr' | 'image' | 'pdf';

export type ProblemInputType =
  | 'problem-number'
  | 'problem-url'
  | 'raw-statement'
  | 'mixed'
  | 'session-command'
  | 'external-content';

export type MentorCommand =
  | 'hint'
  | 'pattern'
  | 'brute-force'
  | 'optimal'
  | 'similar'
  | 'complexity'
  | 'solution'
  | 'explain';

export interface NormalizeProblemInput {
  url?: string;
  statement?: string;
  problemNumber?: string;
  metadata?: Record<string, unknown>;
}

export interface IngestionResult {
  normalizedProblem: NormalizedProblem;
  inputType: ProblemInputType;
  command?: MentorCommand;
  extractedUrls: string[];
}

export interface ProblemContentAdapter<T = unknown> {
  readonly contentType: Exclude<IngestionContentType, 'text'>;
  extract(payload: T): Promise<NormalizeProblemInput>;
}
