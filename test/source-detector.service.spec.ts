import { SourceDetectorService } from '../src/problem-ingestion/source-detector.service';
import { ProblemSource } from '../src/problem-ingestion/types';

describe('SourceDetectorService', () => {
  const service = new SourceDetectorService();

  it.each<[string, ProblemSource]>([
    ['https://leetcode.com/problems/two-sum', 'leetcode'],
    ['https://www.geeksforgeeks.org/problems/rotten-oranges2536/1', 'gfg'],
    ['https://www.naukri.com/code360/problems/aggressive-cows_1082559', 'code360'],
    ['https://www.codechef.com/problems/FLOW001', 'codechef'],
    ['https://atcoder.jp/contests/abc001/tasks/abc001_1', 'atcoder'],
    ['https://cses.fi/problemset/task/1068', 'cses'],
    ['https://www.spoj.com/problems/TEST', 'spoj'],
    ['https://www.hackerrank.com/challenges/simple-array-sum/problem', 'hackerrank'],
    ['https://www.hackerearth.com/problem/algorithm/example', 'hackerearth'],
    ['https://www.interviewbit.com/problems/2-sum', 'interviewbit'],
    ['https://example.com/problems/two-sum', 'unknown'],
  ])('detects %s as %s', (url, expected) => {
    expect(service.detect(url)).toBe(expected);
  });
});
