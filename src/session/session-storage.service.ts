import { Injectable } from '@nestjs/common';
import { NormalizedProblem } from '../problem-ingestion/types';
import { UserSession } from './types/user-session.interface';

@Injectable()
export class SessionStorageService {
  private readonly sessions = new Map<string, UserSession>();

  get(userId: string): UserSession | undefined {
    return this.sessions.get(userId);
  }

  setProblem(userId: string, problem: NormalizedProblem): UserSession {
    const session: UserSession = {
      ...this.getOrCreate(userId),
      currentProblemUrl: problem.url,
      normalizedProblem: problem,
      hintLevel: 0,
      lastPattern: undefined,
      lastInteraction: new Date(),
    };

    this.sessions.set(userId, session);
    return session;
  }

  touch(userId: string): UserSession {
    const session = {
      ...this.getOrCreate(userId),
      lastInteraction: new Date(),
    };
    this.sessions.set(userId, session);
    return session;
  }

  incrementHintLevel(userId: string): UserSession {
    const current = this.getOrCreate(userId);
    const session = {
      ...current,
      hintLevel: current.hintLevel + 1,
      lastInteraction: new Date(),
    };
    this.sessions.set(userId, session);
    return session;
  }

  setLastPattern(userId: string, lastPattern: string): UserSession {
    const session = {
      ...this.getOrCreate(userId),
      lastPattern,
      lastInteraction: new Date(),
    };
    this.sessions.set(userId, session);
    return session;
  }

  private getOrCreate(userId: string): UserSession {
    return (
      this.sessions.get(userId) ?? {
        hintLevel: 0,
        lastInteraction: new Date(),
      }
    );
  }
}
