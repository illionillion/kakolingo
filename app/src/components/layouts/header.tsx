import { HStack, Image, Text } from '@yamada-ui/react';
import Link from 'next/link';
import type { FC } from 'react';
import { HeaderProfile } from './header-profile';

export const Header: FC = () => {
  return <HStack as="header" bgColor="#d9d9d9" p="md" justifyContent="space-between">
    <HStack>
      <Link href="/">
        <Image src='/favicon.ico' w="32px" h="32px" />
      </Link>
      <Text fontSize="lg">カコリンゴ・基本情報</Text>
    </HStack>
    <HeaderProfile />
  </HStack>;
};