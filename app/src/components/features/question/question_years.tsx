'use client';
import { StateContext } from '@/components/state/AuthContext';
import type { getQuestionsYears } from '@/lib/question';
import { Box, Button, Center, Checkbox, CheckboxGroup, Container, HStack, Heading, Loading, NumberInput, Radio, RadioGroup, Ripple, Text, useRipple } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';

type QuestionYearsProps = {
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

export const QuestionYears: FC<QuestionYearsProps> = ({ questions_years }) => {

  const { isAuthenticating } = useContext(StateContext);

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [type, setType] = useState<string>('sequential');
  const [questionLength, setQuestionLength] = useState<number>(0);


  const handleAllClick = () => {
    if (selectedValues.length === questions_years.length) {
      setSelectedValues([]);
    } else {
      setSelectedValues(questions_years.map(e => e.questionYearId.toString()));
    }
  };

  useEffect(() => {
    console.log(selectedValues);
  }, [selectedValues]);
  useEffect(() => {
    console.log(type);
  }, [type]);
  useEffect(() => {
    console.log(questionLength);
  }, [questionLength]);
  return (
    <>
      {isAuthenticating ? <Center w="100vw" h="100dvh">
        <Loading size="5xl" />
      </Center> : <Container>
        <Heading m="auto">問題選択</Heading>
        <CheckboxGroup value={selectedValues} flexDir="row" flexWrap="wrap" onChange={setSelectedValues}>
          {questions_years.map((question_year, index) => (
            <CustomCheckbox key={`${index}-${question_year.questionYearId}`} createdYearJp={question_year.createdYearJp} questionYearId={question_year.questionYearId.toString()} season={question_year.season} />
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
            <NumberInput min={0} defaultValue={5} value={questionLength} onChange={value => setQuestionLength(parseInt(value))} />
            <Text>問</Text>
          </HStack>
        </HStack>
        <Center>
          <Button colorScheme='success' isDisabled={!selectedValues.length}>出題開始</Button>
        </Center>
      </Container>
      }
    </>
  );
};

const CustomCheckbox: FC<{ createdYearJp: string; season: string; questionYearId: string; }> = ({ createdYearJp, questionYearId, season }) => {
  const {
    onPointerDown,
    ...rippleProps
  } = useRipple();
  return <Checkbox position="relative" overflow="hidden" w="36" m="sm" p="sm" border="1px solid black" borderRadius="md" value={`${questionYearId}`} onPointerDown={onPointerDown}>
    <Box >
      {`${createdYearJp} ${season}`}
      <Ripple {...rippleProps} />
    </Box>
  </Checkbox>;
};