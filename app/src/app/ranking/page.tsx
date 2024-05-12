import { AuthProvider } from '@/components/state/AuthProvider';
import { getRanking } from '@/lib/ranking';
import { Container, Heading, NativeTable, TableContainer, Tbody, Td, Th, Thead, Tr } from '@yamada-ui/react';
import type { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'カコリンゴ-ランキング',
  description: 'カコリンゴ-ランキング',
};

const Page: NextPage = async () => {

  const ranking = await getRanking();

  return <AuthProvider>
    <Container maxW="8xl" m="auto">
      <Heading>週間ランキング</Heading>
      <TableContainer>
        <NativeTable>
          <Thead>
            <Tr>
              <Th>順位</Th>
              <Th>ユーザー名</Th>
              <Th>解答数</Th>
            </Tr>
          </Thead>

          <Tbody>
            {
              ranking.map((v, i) => (
                <Tr key={i}>
                  <Td>{v.rank}</Td>
                  <Td>{v.displayName}</Td>
                  <Td>{v.totalCount}</Td>
                </Tr>
              ))
            }
          </Tbody>
        </NativeTable>
      </TableContainer>
    </Container>
  </AuthProvider>;
};

export default Page;