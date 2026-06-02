export enum ChapterId {
  CH4 = "Chapter 4",
  CH5 = "Chapter 5",
  CH6 = "Chapter 6"
}

export enum QuestionType {
  MCQ = "Multiple Choice",
  SHORT = "Short Answer",
  CALC = "Calculation"
}

export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard"
}

export interface Question {
  id: string;
  chapter: ChapterId;
  type: QuestionType;
  difficulty: Difficulty;
  topic: string; // e.g., "Dijkstra", "BGP", "CRC", etc.
  questionText: string; // Must be in English as specified
  options?: string[]; // English options for MCQ
  correctAnswer: string; // The correct answer representation, e.g. "A", "B", "C", "D" or specific text for short-answer
  explanation: {
    concept: string; // 中文 繁體
    reviewRef: string; // 中文 繁體 (對應複習)
    optionsAnalysis?: { [key: string]: string }; // 選項解析 (A, B, C, D)
    perfectTemplate?: string; // 100 分答題模板 (中文 繁體) for calculation and short answer
  };
}

export interface Formula {
  id: string;
  name: string;
  latex: string;
  desc: string;
  example: string;
}

export interface ChapterConcept {
  id: string;
  title: string;
  isHighFreq: boolean;
  isMustKnow: boolean;
  isWarning: boolean;
  contentMarkdown: string;
}

export interface ChapterData {
  id: ChapterId;
  title: string;
  concepts: ChapterConcept[];
}
