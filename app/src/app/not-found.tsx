import { Button, Container, Heading, Text, VStack } from '@yamada-ui/react';
import type { NextPage } from 'next';
import Link from 'next/link';

const NotFound :NextPage = () => {
  return <Container>
    <VStack alignItems="center" flexGrow={1}>
      <Text fontSize="5xl" fontWeight="bold">
        404
      </Text>
      <Heading as="h1" size="xl" textAlign="center">
        ページが見つかりませんでした。
      </Heading>
      <Text textAlign="center" color="gray">
        URLアドレスが間違っている可能性があります。
      </Text>
      <Button
        as={Link}
        w="fit-content"
        href="/"
        variant="ghost"
        colorScheme="link"
      >
        トップページへ戻る
      </Button>
    </VStack>
  </Container>;
};

export default NotFound;