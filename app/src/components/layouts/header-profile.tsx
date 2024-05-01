'use client';

import { Box, Button, GridItem, HStack, Image, Popover, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, SimpleGrid, Text, ui } from '@yamada-ui/react';
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
            <Image src='/menu.png' w="full" />
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
            }} gap="md">
              <GridItem p="md" rounded="4" textAlign="center">
                                クエスト
              </GridItem>

              <GridItem p="md" rounded="4" textAlign="center">
                                ランキング
              </GridItem>

              <GridItem p="md" rounded="4" textAlign="center">
                                設定
              </GridItem>

              <GridItem p="md" rounded="4" textAlign="center">
                <Button colorScheme="danger" variant="outline" onClick={handleSignout}>サインアウト</Button>
              </GridItem>
            </SimpleGrid>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  </HStack>;
};