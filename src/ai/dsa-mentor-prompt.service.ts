import { Injectable } from '@nestjs/common';
import {
  MentorCommand,
  NormalizedProblem,
} from '../problem-ingestion/types';

export const DSA_MENTOR_SYSTEM_PROMPT =
  'You are a DSA mentor capable of helping users solve algorithmic problems from any platform, including LeetCode, GeeksForGeeks, Code360, CodeChef, AtCoder, CSES, SPOJ, HackerRank, HackerEarth, InterviewBit, and custom problem statements. Focus on pattern recognition, hint generation, brute force approaches, optimal approaches, similar problems, and complexity analysis regardless of the source platform.';

export interface AiPrompt {
  system: string;
  user: string;
}

@Injectable()
export class DsaMentorPromptService {
  build(problem: NormalizedProblem, command?: MentorCommand): AiPrompt {
    return {
      system: DSA_MENTOR_SYSTEM_PROMPT,
      user: JSON.stringify({
        task: command ?? 'explain',
        problem,
      }),
    };
  }
}
