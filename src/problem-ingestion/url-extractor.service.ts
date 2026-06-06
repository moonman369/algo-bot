import { Injectable } from '@nestjs/common';

const URL_PATTERN = /https?:\/\/[^\s<>"']+/gi;
const TRAILING_PUNCTUATION = /[),.;!?]+$/;

@Injectable()
export class UrlExtractorService {
  extract(message: string): string[] {
    return (message.match(URL_PATTERN) ?? []).map((url) =>
      url.replace(TRAILING_PUNCTUATION, ''),
    );
  }

  remove(message: string): string {
    return message
      .replace(URL_PATTERN, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
