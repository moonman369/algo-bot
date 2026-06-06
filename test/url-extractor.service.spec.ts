import { UrlExtractorService } from '../src/problem-ingestion/url-extractor.service';

describe('UrlExtractorService', () => {
  const service = new UrlExtractorService();

  it('extracts URLs from WhatsApp-style messages', () => {
    expect(
      service.extract(
        'Try https://leetcode.com/problems/two-sum, then https://example.com/x.',
      ),
    ).toEqual([
      'https://leetcode.com/problems/two-sum',
      'https://example.com/x',
    ]);
  });
});
