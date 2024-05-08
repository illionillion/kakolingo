import { QuestionContext } from '@/components/state/QuestionContext';
import { Button, Center, Container, HStack, Link, Text, VStack, useBoolean } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext, useState } from 'react';

export const Question: FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { questions, questionsYears, questionsResults, setQuestionsResults } = useContext(QuestionContext);
  const currentQuestion = questions[currentIndex];
  const currentQuestionYear = questionsYears.find(v => v.questionYearId === currentQuestion.questionYearId);
  const options = currentQuestion.options;
  const [isShowAnswer, { on: showAnswer, off: hideAnswer }] = useBoolean();
  const [isCorrect, { on: correct, off: invalid }] = useBoolean();
  const handleShowAnswer = () => {
    showAnswer();
    invalid();
    setQuestionsResults([...questionsResults, { isCorrected: false, selectedKey: '' }]);
  };
  const handleAnswer = (selectOptionsKey: string) => {
    if (selectOptionsKey === currentQuestion.correctOptionKey) {
      correct();
      setQuestionsResults([...questionsResults, { isCorrected: true, selectedKey: selectOptionsKey }]);
    } else {
      invalid();
      setQuestionsResults([...questionsResults, { isCorrected: false, selectedKey: selectOptionsKey }]);
    }
    showAnswer();
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1)
    hideAnswer()
  }

  return <Container maxW="8xl" m="auto">
    <VStack>
      <Text fontSize="xl">第{currentIndex + 1}問</Text>
      <Text fontSize="md">{currentQuestion.questionContent}</Text>
      <Text textAlign="right">{`${currentQuestionYear?.createdYearJp}${currentQuestionYear?.season ? `${currentQuestionYear?.season}期` : ''} ${currentQuestion.questionNumber}問`}</Text>
      <Center justifyContent="space-around" gap="md" flexWrap="wrap">
        {options.map((option, index) => (
          <HStack key={index}>
            <Button isDisabled={isShowAnswer} onClick={() => handleAnswer(option.optionKey)}>{option.optionKey}</Button>
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
      {!isShowAnswer ?
        <>
          <Text fontSize="xl">正解</Text>
          <Button w="fit-content" onClick={handleShowAnswer}>正解を表示する</Button>
        </>
        :
        <>
          <Text fontSize="xl">答え</Text>
          <HStack>
            <Text fontSize="md">{currentQuestion.correctOptionKey}</Text>
            <Text fontSize="md" color={isCorrect ? 'success' : 'danger'}>{isCorrect ? '正解' : '不正解'}</Text>
          </HStack>
          <Text fontSize="md">あなたの解答：{questionsResults[currentIndex].selectedKey ? questionsResults[currentIndex].selectedKey : '-'}</Text>
          <Text fontSize="md">
            <Link isExternal href={currentQuestion.questionUrl}>解説を見る</Link>
          </Text>
        </>
      }
    </VStack>
    {isShowAnswer && <Center>
      {
        currentIndex + 1 < questions.length ?
          <Button onClick={handleNext}>次の問題を解く</Button> :
          <Button>終了</Button>
      }
    </Center>}
  </Container>;
};