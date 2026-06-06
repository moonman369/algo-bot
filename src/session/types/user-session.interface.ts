import { NormalizedProblem } from '../../problem-ingestion/types';

export interface UserSession {
  currentProblemUrl?: string;
  normalizedProblem?: NormalizedProblem;
  hintLevel: number;
  lastPattern?: string;
  lastInteraction: Date;
}
