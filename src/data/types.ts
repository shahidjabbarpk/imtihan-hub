/** Compact MCQ tuple: [question, A, B, C, D, index of the correct option, explanation?] */
export type Q = [string, string, string, string, string, 0 | 1 | 2 | 3, string?];

/** Where a topic is useful: Matric (9th/10th), Inter (11th/12th), or entry/job tests only. */
export type Level = 'matric' | 'inter' | 'test';

export interface Topic {
  id: string;
  title: string;
  level: Level[];
  qs: Q[];
}

export interface Subject {
  key: string;
  title: string;
  ur: string;
  icon: string;
  colors: [string, string];
  topics: Topic[];
}

/** An MCQ ready for the quiz engine (options may be shuffled; `a` follows them). */
export interface Mcq {
  id: string;      // "<subject>.<topic>.<n>" - stable, used for bookmarks & mistakes
  sub: string;
  topic: string;
  q: string;
  o: string[];
  a: number;
  e?: string;
}

export interface LinkItem {
  label: string;
  url: string;
}
