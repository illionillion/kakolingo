import { StateContext } from '@/components/state/AuthContext';
import { QuestionContext } from '@/components/state/QuestionContext';
import { Button, Center, Container, HStack, Link, Text, VStack, useBoolean } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext, useState } from 'react';

export const Question: FC = () => {
  const { userData } = useContext(StateContext);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { questions, questionsYears, questionsResults, setQuestionsResults, setCurrentState } = useContext(QuestionContext);
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
    setCurrentIndex(prev => prev + 1);
    hideAnswer();
  };

  const handleEnd = async () => {
    // ランキングのデータ更新
    const request = await fetch('/api/ranking', {
      method: 'POST',
      body: JSON.stringify({
        userId: userData?.userId,
        count: questions.length
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData?.token}`,
      }
    });
    if (request.ok) {
      console.log('ランキング更新成功');
    } else {
      console.log('ランキング更新失敗');
      
    }
    setCurrentState('finish');
  };

  return <Container maxW="8xl" m="auto">
    <VStack>
      <Text fontSize="xl">第{currentIndex + 1}問</Text>
      <Text fontSize="md">{currentQuestion.questionContent}</Text>
      <Text textAlign="right">{`${currentQuestionYear?.createdYearJp}${currentQuestionYear?.season ? `${currentQuestionYear?.season}期` : ''} ${currentQuestion.questionNumber}問`}</Text>
      <Center justifyContent="space-around" gap="md" flexWrap="wrap">
        {options.map((option, index) => (
          <HStack key={index} flexGrow={1}>
            <Button onClick={() => !isShowAnswer && handleAnswer(option.optionKey)}>{option.optionKey}</Button>
            <Text>{option.optionContent}</Text>
          </HStack>
        ))}
      </Center>
    </VStack>
    <HStack>
      <VStack>
        <Text fontSize="xl">分類</Text>
        <Text fontSize="md">{currentQuestion.questionGenre}</Text>
      </VStack>
      <Center>
        <Button>ヒントを生成</Button>
      </Center>
    </HStack>
    <VStack>
      <Text fontSize="xl">正解</Text>
      {!isShowAnswer ?
        <>
          <Button w="fit-content" onClick={handleShowAnswer}>正解を表示する</Button>
        </>
        :
        <>
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
          <Button onClick={handleEnd}>終了</Button>
      }
    </Center>}
  </Container>;
};