export interface IQuestion {
  id?: number;
  content?: string;
  imageUrl?: string | null;
  suggestion?: string | null;
  answerExplanation?: string | null;
  correctAnswer?: string;
  type?: string;
}

export const defaultValue: Readonly<IQuestion> = {};
