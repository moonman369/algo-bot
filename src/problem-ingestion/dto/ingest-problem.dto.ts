import { IngestionContentType } from '../types';

export class IngestProblemDto {
  userId!: string;
  content!: unknown;
  contentType?: IngestionContentType;
  metadata?: Record<string, unknown>;
}
