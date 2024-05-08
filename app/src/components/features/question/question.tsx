import { QuestionContext } from '@/components/state/QuestionContext';
import { Button, Center, Container, HStack, Text, VStack } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext, useState } from 'react';

export const Question: FC = () => {
  const [currentIndex] = useState<number>(0);
  const { questions, questionsYears } = useContext(QuestionContext);
  const currentQuestion = questions[currentIndex];
  const currentQuestionYear = questionsYears.find(v => v.questionYearId === currentQuestion.questionYearId);
  const options = currentQuestion.options;

  const handleAnswer = (selectOptionsKey: string) => {
    if (selectOptionsKey === currentQuestion.correctOptionKey) {
      console.log('正解');
    } else {
      console.log('間違い');
    }
  };

  return <Container maxW="8xl" m="auto">
    <VStack>
      <Text fontSize="xl">第{currentIndex + 1}問</Text>
      <Text fontSize="md">{currentQuestion.questionContent}</Text>
      <Text textAlign="right">{`${currentQuestionYear?.createdYearJp}${currentQuestionYear?.season ? `${currentQuestionYear?.season}期` : ''} ${currentQuestion.questionNumber}問`}</Text>
      <Center justifyContent="space-around" gap="md" flexWrap="wrap">
        {options.map((option, index) => (
          <HStack key={index}>
            <Button onClick={() => handleAnswer(option.optionKey)}>{option.optionKey}</Button>
            <Text>{option.optionContent}</Text>
          </HStack>
        ))}
      </Center>
    </VStack>
    <VStack>
      <Text fontSize="xl">分類</Text>
      <Text fontSize="md">{currentQuestion.questionGenre}</Text>
    </VStack>
    <VStack>
      <Text fontSize="xl">正解</Text>
      <Button w="fit-content">正解を表示する</Button>
    </VStack>
  </Container>;
};