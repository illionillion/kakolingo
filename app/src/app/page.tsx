import { QuestionYears } from '@/components/features/question/question_years';
import { AuthProvider } from '@/components/state/AuthProvider';
import { getQuestionsYears } from '@/lib/question';

export default async function Home() {
  const questions_years = await getQuestionsYears();

  return (
    <AuthProvider>
      <QuestionYears questions_years={questions_years} />
    </AuthProvider>
  );
}
