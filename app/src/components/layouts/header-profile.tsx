'use client';

import { Box, Button, Center, GridItem, HStack, Image, Link, Popover, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, SimpleGrid, Text, VStack, ui } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext } from 'react';
import { StateContext } from '../state/AuthContext';

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
                <Link _hover={{textDecor: 'none'}} as={VStack} alignContent="space-between" h="full">
                  <Box w="12" m="auto">
                    <Image src='/quest-icon.png' w="full" />
                  </Box>
                  <Text>クエスト</Text>
                </Link>
              </GridItem>

              <GridItem p="md" rounded="4" textAlign="center">
                <Link _hover={{textDecor: 'none'}} as={VStack} alignContent="space-between" h="full">
                  <Box w="12" m="auto">
                    <Image src='/ranking-icon.png' w="full" />
                  </Box>
                  <Text>ランキング</Text>
                </Link>
              </GridItem>

              <GridItem p="md" rounded="4" textAlign="center">
                <Link _hover={{textDecor: 'none'}} as={VStack} alignContent="space-between" h="full">
                  <Box w="12" m="auto">
                    <Image src='/setting-icon.png' w="full" />
                  </Box>
                  <Text>設定</Text>
                </Link>
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