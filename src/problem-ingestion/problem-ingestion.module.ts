import { Module } from '@nestjs/common';
import { SessionModule } from '../session/session.module';
import { ContentAdapterRegistryService } from './content-adapter-registry.service';
import { IngestionService } from './ingestion.service';
import { ProblemNormalizerService } from './problem-normalizer.service';
import { SourceDetectorService } from './source-detector.service';
import { UrlExtractorService } from './url-extractor.service';

@Module({
  imports: [SessionModule],
  providers: [
    IngestionService,
    ContentAdapterRegistryService,
    SourceDetectorService,
    UrlExtractorService,
    ProblemNormalizerService,
  ],
  exports: [
    IngestionService,
    ContentAdapterRegistryService,
    SourceDetectorService,
    UrlExtractorService,
    ProblemNormalizerService,
  ],
})
export class ProblemIngestionModule {}
