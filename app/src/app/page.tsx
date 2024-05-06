import { Question } from '@/components/features/question';
import { AuthProvider } from '@/components/state/AuthProvider';
import { QuestionProvider } from '@/components/state/QuestionContext';
import { getQuestionsYears } from '@/lib/question';

export default async function Home() {
  const questions_years = await getQuestionsYears();

  return (
    <AuthProvider>
      <QuestionProvider>
        <Question questions_years={questions_years} />
      </QuestionProvider>
    </AuthProvider>
  );
}
