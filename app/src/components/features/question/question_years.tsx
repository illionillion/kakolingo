'use client';
import { StateContext } from '@/components/state/AuthContext';
import type { getQuestionsYears } from '@/lib/question';
import { Box, Button, Center, Checkbox, CheckboxGroup, Container, Heading, Loading, Ripple, useRipple } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';

type QuestionYearsProps = {
    questions_years: Awaited<ReturnType<typeof getQuestionsYears>>
}

export const QuestionYears: FC<QuestionYearsProps> = ({ questions_years }) => {

  const { isAuthenticating } = useContext(StateContext);

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

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
  return (
    <>
      {isAuthenticating ? <Center w="100vw" h="100dvh">
        <Loading size="5xl" />
      </Center> : <Container>
        <Heading m="auto">問題選択</Heading>
        <CheckboxGroup value={selectedValues} display="inline-block" onChange={setSelectedValues}>
          {questions_years.map((question_year, index) => (
            <CustomCheckbox key={`${index}-${question_year.questionYearId}`} createdYearJp={question_year.createdYearJp} questionYearId={question_year.questionYearId.toString()} season={question_year.season} />
          ))}
        </CheckboxGroup>
        <Box px="sm">
          <Button colorScheme='primary' onClick={handleAllClick}>全てチェック</Button>
        </Box>
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