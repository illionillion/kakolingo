import { Box, HStack, Image, Text } from '@yamada-ui/react';
import Link from 'next/link';
import type { FC } from 'react';

export const Header: FC = () => {
  return <HStack as="header" bgColor="#d9d9d9" p="md" justifyContent="space-between">
    <HStack>
      <Link href="/">
        <Image src='/favicon.ico' w="32px" h="32px" />
      </Link>
      <Text fontSize="lg">カコリンゴ・基本情報</Text>
    </HStack>
    <HStack>
      <Text fontSize="xl">試験まであと1000日</Text>
      <Box w="12">
        <Image src='/menu.png' w="full" />
      </Box>
    </HStack>
  </HStack>;
};