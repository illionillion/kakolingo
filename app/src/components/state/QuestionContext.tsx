'use client';
import type { getQuestions, getQuestionsYears } from '@/lib/question';
import type { ReactNode} from 'react';
import { createContext, useState } from 'react';

export interface QuestionContextType {
    questionsYears: Awaited<ReturnType<typeof getQuestionsYears>>
    questions: Awaited<ReturnType<typeof getQuestions>>
    setQuestionsYears: (questionsYear: QuestionContextType['questionsYears']) => void;
    setQuestions: (questions: QuestionContextType['questions']) => void;
    currentState: 'select' | 'question' | 'finish';
    setCurrentState: (newState: QuestionContextType['currentState']) => void;
    questionsResults: { isCorrected: boolean; selectedKey: string; }[];
    setQuestionsResults: (newResult: QuestionContextType['questionsResults']) => void
}

const defaultContext: QuestionContextType = {
  questionsYears: [],
  setQuestionsYears: () => { },
  questions: [],
  setQuestions: () => { },
  currentState: 'select',
  setCurrentState: () => { },
  questionsResults: [],
  setQuestionsResults: () => { }
};

export const QuestionContext = createContext<QuestionContextType>(defaultContext);

export const useQuestionContext = () => {
  const [questionsYears, setQuestionsYears] = useState<QuestionContextType['questionsYears']>([]);
  const [questions, setQuestions] = useState<QuestionContextType['questions']>([]);
  const [currentState, setCurrentState] = useState<QuestionContextType['currentState']>('select');
  const [questionsResults, setQuestionsResults] = useState<QuestionContextType['questionsResults']>([]);

  const contextValue: QuestionContextType = {
    questionsYears: questionsYears,
    setQuestionsYears: setQuestionsYears,
    questions: questions,
    setQuestions: setQuestions,
    currentState: currentState,
    setCurrentState: setCurrentState,
    questionsResults: questionsResults,
    setQuestionsResults: setQuestionsResults,
  };

  return contextValue;
};

export const QuestionProvider = ({ children }: { children: ReactNode }) => {
  const ctx = useQuestionContext();
  return <QuestionContext.Provider value={ctx}>{children}</QuestionContext.Provider>;
};