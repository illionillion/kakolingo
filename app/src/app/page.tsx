import { QuestionSelect } from '@/components/features/question/question-select';
import { AuthProvider } from '@/components/state/AuthProvider';
import { getQuestionsYears } from '@/lib/question';

export default async function Home() {
  const questions_years = await getQuestionsYears();

  return (
    <AuthProvider>
      <QuestionSelect questions_years={questions_years} />
    </AuthProvider>
  );
}
