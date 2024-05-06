'use client';
import { QuestionContext } from '@/components/state/QuestionContext';
import type { getQuestionsYears } from '@/lib/question';
import type { FC } from 'react';
import { useContext } from 'react';
import { QuestionSelect } from './question-select';
import { Question } from './question';

export const QuestionLayout: FC<{ questions_years: Awaited<ReturnType<typeof getQuestionsYears>> }> = ({ questions_years }) => {
  const { currentState, } = useContext(QuestionContext);
  console.log(currentState);

  return <>
    {currentState === 'select' ?
      <QuestionSelect questions_years={questions_years} />
      : currentState === 'question' ? <Question /> : <>終了</>
    }
  </>;
};