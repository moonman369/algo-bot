import { ProblemSource } from './problem-source.type';

export interface NormalizedProblem {
  source: ProblemSource;
  url?: string;
  title?: string;
  statement?: string;
  difficulty?: string;
  metadata?: Record<string, unknown>;
}
