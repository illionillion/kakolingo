'use client';

import { Box, Button, Center, GridItem, HStack, Image, Link as UILink, Popover, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, SimpleGrid, Text, ui, useAsync } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext } from 'react';
import { StateContext } from '../state/AuthContext';
import Link from 'next/link';
import type { getUser } from '@/lib/users';

const calculateDaysFromNow = (dateString: string): number => {
  // 受け取った日付文字列をDateオブジェクトに変換
  const inputDate = new Date(dateString);
  
  // 現在の日付を取得
  const currentDate = new Date();
  
  // 両日付のタイムスタンプを取得
  const inputTime = inputDate.getTime();
  const currentTime = currentDate.getTime();
  
  // タイムスタンプの差をミリ秒単位で計算
  const timeDifference = currentTime - inputTime;
  
  // ミリ秒を日に変換（1日 = 24時間 * 60分 * 60秒 * 1000ミリ秒）
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  
  // 日数の差を整数の正の値にして返す
  return Math.abs(Math.floor(daysDifference));
};

export const HeaderProfile: FC = () => {
  const { onSignout, setIsAuthenticating, isAuthenticating, userData } = useContext(StateContext);
  const { value } = useAsync(async () => {
    const response = await fetch(`/api/users/${userData?.userName}`, {
      cache: 'no-cache'
    });
    const { data } = await response.json() as { data: Awaited<ReturnType<typeof getUser>> };

    return { displayName: data?.displayName, testDay: data?.testDay };

  });
  const handleSignout = () => {
    onSignout();
    setIsAuthenticating(true);
  };
  return !isAuthenticating && <HStack>
    {
      value?.testDay ?
        <Text fontSize="xl">試験まであと{calculateDaysFromNow(value.testDay)}日</Text> :
        <Text w="xs" bgColor="#10B990" p="xs" >受験予定日を設定するとカウントダウンが表示されます</Text>
    }
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
              <Text>{value?.displayName} さん</Text>
            </Box>
            <SimpleGrid w="full" columns={{
              base: 2,
              md: 1
            }} >
              <GridItem p="md" rounded="4" textAlign="center">
                <UILink display="flex" flexDir="column" gap="md" href='/quest' _hover={{ textDecor: 'none' }} as={Link} alignContent="space-between" h="full">
                  <Box w="12" m="auto">
                    <Image src='/quest-icon.png' w="full" />
                  </Box>
                  <Text>クエスト</Text>
                </UILink>
              </GridItem>

              <GridItem p="md" rounded="4" textAlign="center">
                <UILink display="flex" flexDir="column" gap="md" href='/ranking' _hover={{ textDecor: 'none' }} as={Link} alignContent="space-between" h="full">
                  <Box w="12" m="auto">
                    <Image src='/ranking-icon.png' w="full" />
                  </Box>
                  <Text>ランキング</Text>
                </UILink>
              </GridItem>

              <GridItem p="md" rounded="4" textAlign="center">
                <UILink display="flex" flexDir="column" gap="md" href='/setting' _hover={{ textDecor: 'none' }} as={Link} alignContent="space-between" h="full">
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