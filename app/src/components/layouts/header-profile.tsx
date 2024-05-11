'use client';

import { Box, Button, Center, GridItem, HStack, Image, Link as UILink, Popover, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, SimpleGrid, Text, ui } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext } from 'react';
import { StateContext } from '../state/AuthContext';
import Link from 'next/link';

export const HeaderProfile: FC = () => {
  const { onSignout, setIsAuthenticating, isAuthenticating, userData } = useContext(StateContext);
  const handleSignout = () => {
    onSignout();
    setIsAuthenticating(true);
  };
  return !isAuthenticating && <HStack>
    <Text fontSize="xl">試験まであと1000日</Text>
    <Box w="12">
      <Popover>
        <PopoverTrigger>
          <ui.button>
            <Image src='/menu-icon.png' w="full" />
          </ui.button>
        </PopoverTrigger>

        <PopoverContent>
          <PopoverHeader>メニュー</PopoverHeader>
          <PopoverBody>
            <Box>
              <Text>{userData?.userName}さん</Text>
              <Text>〇〇日連続ログイン</Text>
            </Box>
            <SimpleGrid w="full" columns={{
              base: 2,
              md: 1
            }} >
              <GridItem p="md" rounded="4" textAlign="center">
                <UILink display="flex" flexDir="column" gap="md" href='/' _hover={{textDecor: 'none'}} as={Link} alignContent="space-between" h="full">
                  <Box w="12" m="auto">
                    <Image src='/quest-icon.png' w="full" />
                  </Box>
                  <Text>クエスト</Text>
                </UILink>
              </GridItem>

              <GridItem p="md" rounded="4" textAlign="center">
                <UILink display="flex" flexDir="column" gap="md" href='/ranking' _hover={{textDecor: 'none'}} as={Link} alignContent="space-between" h="full">
                  <Box w="12" m="auto">
                    <Image src='/ranking-icon.png' w="full" />
                  </Box>
                  <Text>ランキング</Text>
                </UILink>
              </GridItem>

              <GridItem p="md" rounded="4" textAlign="center">
                <UILink display="flex" flexDir="column" gap="md" href='/setting' _hover={{textDecor: 'none'}} as={Link} alignContent="space-between" h="full">
                  <Box w="12" m="auto">
                    <Image src='/setting-icon.png' w="full" />
                  </Box>
                  <Text>設定</Text>
                </UILink>
              </GridItem>

              <GridItem p="md" rounded="4" as={Center}>
                <Button colorScheme="danger" variant="link" onClick={handleSignout}>サインアウト</Button>
              </GridItem>
            </SimpleGrid>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  </HStack>;
};