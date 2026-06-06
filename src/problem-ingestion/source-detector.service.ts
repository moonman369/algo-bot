import { Injectable } from '@nestjs/common';
import { ProblemSource } from './types';

const SOURCE_HOST_MATCHERS: ReadonlyArray<{
  source: ProblemSource;
  matches: (hostname: string, url: string) => boolean;
}> = [
  { source: 'leetcode', matches: (host) => host.includes('leetcode') },
  { source: 'gfg', matches: (host) => host.includes('geeksforgeeks') },
  {
    source: 'code360',
    matches: (host, url) =>
      host.includes('code360') ||
      (host.includes('naukri.com') && url.includes('/code360/')),
  },
  { source: 'codechef', matches: (host) => host.includes('codechef') },
  { source: 'atcoder', matches: (host) => host.includes('atcoder') },
  { source: 'cses', matches: (host) => host.includes('cses') },
  { source: 'spoj', matches: (host) => host.includes('spoj') },
  { source: 'hackerrank', matches: (host) => host.includes('hackerrank') },
  {
    source: 'hackerearth',
    matches: (host) => host.includes('hackerearth'),
  },
  {
    source: 'interviewbit',
    matches: (host) => host.includes('interviewbit'),
  },
];

@Injectable()
export class SourceDetectorService {
  detect(url: string): ProblemSource {
    const normalizedUrl = url.toLowerCase();
    const hostname = this.getHostname(normalizedUrl);

    return (
      SOURCE_HOST_MATCHERS.find((matcher) =>
        matcher.matches(hostname, normalizedUrl),
      )?.source ?? 'unknown'
    );
  }

  private getHostname(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }
}
