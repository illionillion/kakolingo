'use client';
import { StateContext } from '@/components/state/AuthContext';
import { QuestionContext } from '@/components/state/QuestionContext';
import type { getQuestions, getQuestionsYears } from '@/lib/question';
import { Box, Button, Center, Checkbox, CheckboxGroup, Container, HStack, Heading, Loading, NumberInput, Radio, RadioGroup, Ripple, Text, useRipple } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext, useState } from 'react';

type QuestionSelectProps = {
    questions_years: Awaited<ReturnType<typeof getQuestionsYears>>
}

const radioData = [
  {
    label: '順番に出す',
    value: 'sequential'
  },
  {
    label: 'ランダムに出す',
    value: 'random'
  }
];

export const QuestionSelect: FC<QuestionSelectProps> = ({ questions_years }) => {

  const { isAuthenticating } = useContext(StateContext);
  const { setCurrentState, setQuestions, setQuestionsYears } = useContext(QuestionContext);

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [type, setType] = useState<string>('sequential');
  const [questionLength, setQuestionLength] = useState<number>(0);
  const totalQuestions = questions_years.reduce((accumulator, currentValue) => accumulator + currentValue.questionsCount, 0);

  const handleChange = (value: string[]) => {
    setSelectedValues(value);
    if (value.length > 0) {
      let newCount = 0;
      questions_years.forEach(v => {
        if (value.includes(v.questionYearId.toString())) {
          newCount += v.questionsCount;
        }
      });
      setQuestionLength(newCount);
      return;
    }
    setQuestionLength(0);
  };
  
  const handleAllClick = () => {
    if (selectedValues.length === questions_years.filter(e => e.questionsCount !== 0).length) {
      setSelectedValues([]);
      setQuestionLength(0);
    } else {
      setSelectedValues(questions_years.filter(e => e.questionsCount !== 0).map(e => e.questionYearId.toString()));
      setQuestionLength(totalQuestions);
    }
  };

  const handleStart = async () => {
    console.log(selectedValues, type, questionLength);
    // ここで問題の取得？
    const response = await fetch('/api/questions', {
      body: JSON.stringify({
        years: selectedValues,
        type: type,
        limit: questionLength
      }),
      method: 'POST'
    });
    const json = await response.json();
    const { questions } = json as { questions: Awaited<ReturnType<typeof getQuestions>> };
    setQuestions(questions);
    setQuestionsYears(questions_years.filter(i => selectedValues.includes(i.questionYearId.toString())));
    setCurrentState('question');
  };

  return (
    <>
      {isAuthenticating ? <Center w="100vw" h="100dvh">
        <Loading size="5xl" />
      </Center> : <Container maxW="8xl" m="auto">
        <Heading m="auto">問題選択</Heading>
        <CheckboxGroup value={selectedValues} flexDir="row" flexWrap="wrap" onChange={handleChange}>
          {questions_years.map((question_year, index) => (
            <CustomCheckbox key={`${index}-${question_year.questionYearId}`} questionCount={question_year.questionsCount} createdYearJp={question_year.createdYearJp} questionYearId={question_year.questionYearId.toString()} season={question_year.season} />
          ))}
        </CheckboxGroup>
        <Box px="sm">
          <Button colorScheme='primary' onClick={handleAllClick}>全てチェック</Button>
        </Box>
        <HStack px="sm" justifyContent="space-between" flexWrap="wrap">
          <RadioGroup defaultValue={radioData[0].value} value={type} flexDir="row" gap="xl" onChange={setType} >
            {radioData.map((e, i) => (
              <Radio key={i} value={e.value}>{e.label}</Radio>
            ))}
          </RadioGroup>
          <HStack>
            <Text>出題数</Text>
            <NumberInput min={0} max={totalQuestions} defaultValue={5} value={questionLength} onChange={value => setQuestionLength(value === '' ? 0 : parseInt(value))} />
            <Text>問</Text>
          </HStack>
        </HStack>
        <Center>
          <Button colorScheme='success' isDisabled={selectedValues.length === 0 || questionLength === 0} onClick={handleStart}>出題開始</Button>
        </Center>
      </Container>
      }
    </>
  );
};

const CustomCheckbox: FC<{ createdYearJp: string; season: string; questionYearId: string; questionCount: number; }> = ({ createdYearJp, questionYearId, season, questionCount }) => {
  const {
    onPointerDown,
    ...rippleProps
  } = useRipple();
  return <Checkbox position="relative" overflow="hidden" w="36" m="sm" p="sm" border="1px solid black" borderRadius="md" value={`${questionYearId}`} isDisabled={!questionCount} onPointerDown={onPointerDown}>
    <Box>
      {`${createdYearJp} ${season}`}
      <Ripple {...rippleProps} isDisabled={!questionCount} />
    </Box>
  </Checkbox>;
};