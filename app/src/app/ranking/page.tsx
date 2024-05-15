import { AuthProvider } from '@/components/state/AuthProvider';
import { getRanking } from '@/lib/ranking';
import { Center, Container, Heading, Image, NativeTable, TableContainer, Tbody, Td, Th, Thead, Tr } from '@yamada-ui/react';
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
                  <Td>
                    <Center w="12" h="12">
                      {((rank) => {
                        switch (rank) {
                          case 1: {
                            return <Image src="/first-rank.png" w="full" />;
                          }
                          case 2: {
                            return <Image src="/second-rank.png" w="full" />;
                          }
                          case 3: {
                            return <Image src="/third-rank.png" w="full" />;
                          }
                          default: {
                            return rank;
                          }
                        }
                      })(v.rank)}
                    </Center>
                  </Td>
                  <Td><Center w="fit-content" h="full">{v.displayName}</Center></Td>
                  <Td><Center w="fit-content" h="full">{v.totalCount}</Center></Td>
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