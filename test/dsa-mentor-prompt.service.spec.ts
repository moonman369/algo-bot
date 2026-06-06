import {
  DSA_MENTOR_SYSTEM_PROMPT,
  DsaMentorPromptService,
} from '../src/ai/dsa-mentor-prompt.service';

describe('DsaMentorPromptService', () => {
  it('uses a platform-neutral system prompt and normalized input', () => {
    const prompt = new DsaMentorPromptService().build(
      {
        source: 'unknown',
        statement: 'Find the shortest path.',
      },
      'hint',
    );

    expect(DSA_MENTOR_SYSTEM_PROMPT).toContain(
      'DSA mentor capable of helping users solve algorithmic problems from any platform',
    );
    expect(prompt.system).not.toContain('You are a LeetCode mentor');
    expect(JSON.parse(prompt.user)).toEqual({
      task: 'hint',
      problem: {
        source: 'unknown',
        statement: 'Find the shortest path.',
      },
    });
  });
});
