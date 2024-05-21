import { StateContext } from '@/components/state/AuthContext';
import { QuestionContext } from '@/components/state/QuestionContext';
import { Button, Center, Container, Fade, HStack, Link, SkeletonText, Text, VStack, useBoolean } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext, useState, useRef } from 'react';
import {Circle, X} from 'lucide-react'

export const Question: FC = () => {
  const { userData } = useContext(StateContext);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { questions, questionsYears, questionsResults, setQuestionsResults, setCurrentState } = useContext(QuestionContext);
  const currentQuestion = questions[currentIndex];
  const currentQuestionYear = questionsYears.find(v => v.questionYearId === currentQuestion.questionYearId);
  const options = currentQuestion.options;
  const [isShowAnswer, { on: showAnswer, off: hideAnswer }] = useBoolean();
  const [isCorrect, { on: correct, off: invalid }] = useBoolean();
  const [isGenerating, { on: start, off: end }] = useBoolean();
  const [hint, setHint] = useState<string>('');
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
  const getHint = async () => {
    start();
    const request = await fetch('/api/hint', {
      method: 'POST',
      body: JSON.stringify({
        userId: userData?.userId,
        questionId: currentQuestion.questionId
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData?.token}`,
      }
    });
    if (!request.ok) {
      console.log('失敗');
      end();
      return;
    }
    const response = await request.json();
    setHint(response.hint);
    end();
  };
  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
    setHint('');
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
      <VStack>
        <Button ml="auto" w="fit-content" onClick={getHint}>ヒントを生成</Button>
        {isGenerating ? <SkeletonText /> :
          <Fade isOpen={!!hint} duration={0.5}>
            <Text>{hint}</Text>
          </Fade>
        }
      </VStack>
    </HStack>
    <VStack>
      <Text fontSize="xl">正解</Text>
      {!isShowAnswer ?
        <>
          <Button w="fit-content" onClick={handleShowAnswer}>正解を表示する</Button>
        </>
        :
        
        <Fade isOpen={isShowAnswer} duration={3.0}>
          <VStack>
            <HStack>
              <Text fontSize="md">{currentQuestion.correctOptionKey}</Text>
              <Text fontSize="md" color={isCorrect ? 'success' : 'danger'}>{isCorrect ? <Circle />: <X />}</Text>
            </HStack>
            <Text fontSize="md">あなたの解答：{questionsResults[currentIndex].selectedKey ? questionsResults[currentIndex].selectedKey : '-'}</Text>
            <Text fontSize="md">
              <Link isExternal href={currentQuestion.questionUrl}>解説を見る</Link>
            </Text>
          </VStack>
        </Fade>
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