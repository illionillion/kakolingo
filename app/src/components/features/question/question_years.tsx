'use client';
import { StateContext } from '@/components/state/AuthContext';
import type { getQuestionsYears } from '@/lib/question';
import { Box, Center, Checkbox, Container, Loading, Text } from '@yamada-ui/react';
import type { FC} from 'react';
import { useContext } from 'react';

type QuestionYearsProps = {
    questions_years: Awaited<ReturnType<typeof getQuestionsYears>>
}

export const QuestionYears: FC<QuestionYearsProps> = ({ questions_years }) => {
  console.log(questions_years);

  const { isAuthenticating } = useContext(StateContext);
  return (
    <>
      {isAuthenticating ? <Center w="100vw" h="100dvh">
        <Loading size="5xl" />
      </Center> : <Container>
        <Text m="auto">問題選択</Text>
        <Box>
          {questions_years.map((question_year, index) => (
            <Checkbox key={index} w="36" m="sm" p="sm" border="1px solid black" borderRadius="md">{`${question_year.createdYearJp} ${question_year.season}`}</Checkbox>
          ))}
        </Box>
      </Container>
      }
    </>
  );
};