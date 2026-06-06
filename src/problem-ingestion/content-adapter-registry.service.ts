import { BadRequestException, Injectable } from '@nestjs/common';
import {
  IngestionContentType,
  NormalizeProblemInput,
  ProblemContentAdapter,
} from './types';

type ExternalContentType = Exclude<IngestionContentType, 'text'>;

@Injectable()
export class ContentAdapterRegistryService {
  private readonly adapters = new Map<
    ExternalContentType,
    ProblemContentAdapter
  >();

  register(adapter: ProblemContentAdapter): void {
    this.adapters.set(adapter.contentType, adapter);
  }

  async extract(
    contentType: ExternalContentType,
    payload: unknown,
  ): Promise<NormalizeProblemInput> {
    const adapter = this.adapters.get(contentType);

    if (!adapter) {
      throw new BadRequestException(
        `No ${contentType} ingestion adapter is registered`,
      );
    }

    return adapter.extract(payload);
  }
}
