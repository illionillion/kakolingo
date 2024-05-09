'use client';
import { QuestionContext } from '@/components/state/QuestionContext';
import { Button, Center, Container, Link, NativeTable, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@yamada-ui/react';
import type { FC} from 'react';
import { useContext } from 'react';

export const QuestionResult: FC = () => {
  const { questionsResults, questions, questionsYears, setCurrentState, setQuestions, setQuestionsYears, setQuestionsResults } = useContext(QuestionContext);
  const correctCount = questionsResults.filter(i => i.isCorrected).length;
  const wrongQuestions = questions.map(q => {
    const years = questionsYears.find(qy => qy.questionYearId === q.questionYearId);
    const year = years?.createdYearJp;
    const season = years?.season;
    return { ...q, name: `${year} ${season ? `${season} ` : ''}  第${q.questionNumber}問` };
  });
  const handleRestart = () => {
    setQuestionsResults([]);
    setCurrentState('question');
  };
  const handleFinish = () => {
    setQuestions([]);
    setQuestionsYears([]);
    setQuestionsResults([]);
    setCurrentState('select');
  };
  return <Container maxW="8xl" m="auto">
    <VStack>
      <VStack>
        <Text fontSize="xl">選択問題を一巡しました</Text>
        <Center gap="lg" flexWrap="wrap">
          <Text fontSize="2xl">正解数：{correctCount}問 / 出題数：{questionsResults.length}問</Text>
          <Text fontSize="2xl">正解率：{(correctCount / questionsResults.length) * 100}%</Text>
        </Center>
      </VStack>
      <VStack>
        <Text>間違えた問題</Text>
        <TableContainer>
          <NativeTable>
            <Thead>
              <Tr>
                <Th>問題番号</Th>
                <Th>出題年度</Th>
                <Th>解答</Th>
                <Th>正誤</Th>
              </Tr>
            </Thead>

            <Tbody>
              {
                wrongQuestions.map((question, i) => (
                  <Tr key={i}>
                    <Td>{i + 1}</Td>
                    <Td><Link isExternal href={question.questionUrl}>{question.name}</Link></Td>
                    <Td>{questionsResults[i].selectedKey}</Td>
                    <Td>{questionsResults[i].isCorrected ? '正' : '誤'}</Td>
                  </Tr>
                ))
              }
            </Tbody>
          </NativeTable>
        </TableContainer>;
      </VStack>
      <Center gap="md">
        <Button onClick={handleRestart}>もう一度解く</Button>
        <Button onClick={handleFinish}>終了する</Button>
      </Center>
    </VStack>
  </Container>;
};