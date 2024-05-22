import { AuthProvider } from '@/components/state/AuthProvider';
import { Card, CardBody, CardHeader, Center, Container, Heading, Image, Progress, VStack } from '@yamada-ui/react';
import type { Metadata, NextPage } from 'next';
export const metadata: Metadata = {
  title: 'カコリンゴ-デイリークエスト',
  description: 'カコリンゴ-デイリークエスト',
};
const QuestPage: NextPage = async () => {
  return <AuthProvider>
    <Container maxW="8xl" m="auto">
      <Heading>デイリークエスト</Heading>
      <Card flexDir="row">
        <VStack>
          <CardHeader fontSize="lg">1. 5問問題を解こう！！</CardHeader>
          <CardBody>
            <Progress
              hasStripe
              isStripeAnimation
              position="relative" _after={{
                content: `"${2}/${5}"`,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translateY(-50%) translateX(-50%)'
              }} value={2/5*100} h="7" colorScheme="warning"/>
          </CardBody>
        </VStack>
        <Center w="32">
          <Image src="chest.png" w="full"/>
        </Center>
      </Card>
      <Card flexDir="row">
        <VStack>
          <CardHeader fontSize="lg">2. 10問問題を解こう！！</CardHeader>
          <CardBody>
            <Progress
              hasStripe
              isStripeAnimation
              position="relative" _after={{
                content: `"${2}/${10}"`,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translateY(-50%) translateX(-50%)'
              }} value={2/10*100} h="7" colorScheme="warning"/>
          </CardBody>
        </VStack>
        <Center w="32">
          <Image src="chest.png" w="full"/>
        </Center>
      </Card>
      <Card flexDir="row">
        <VStack>
          <CardHeader fontSize="lg">3. 15問問題を解こう！！</CardHeader>
          <CardBody>
            <Progress
              hasStripe
              isStripeAnimation
              position="relative" _after={{
                content: `"${2}/${15}"`,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translateY(-50%) translateX(-50%)'
              }} value={2/15*100} h="7" colorScheme="warning"/>
          </CardBody>
        </VStack>
        <Center w="32">
          <Image src="chest.png" w="full"/>
        </Center>
      </Card>
    </Container>
  </AuthProvider>;
};

export default QuestPage;