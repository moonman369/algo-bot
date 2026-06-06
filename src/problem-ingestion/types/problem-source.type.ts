export const PROBLEM_SOURCES = [
  'leetcode',
  'gfg',
  'code360',
  'codechef',
  'atcoder',
  'cses',
  'spoj',
  'hackerrank',
  'hackerearth',
  'interviewbit',
  'unknown',
] as const;

export type ProblemSource = (typeof PROBLEM_SOURCES)[number];
