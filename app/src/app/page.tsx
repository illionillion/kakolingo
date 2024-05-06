import { QuestionLayout } from '@/components/features/question/question-layout';
import { AuthProvider } from '@/components/state/AuthProvider';
import { QuestionProvider } from '@/components/state/QuestionContext';
import { getQuestionsYears } from '@/lib/question';

export default async function Home() {
  const questions_years = await getQuestionsYears();

  return (
    <AuthProvider>
      <QuestionProvider>
        <QuestionLayout questions_years={questions_years} />
      </QuestionProvider>
    </AuthProvider>
  );
}
