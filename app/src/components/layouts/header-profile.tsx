'use client';

import { Box, Button, Center, GridItem, HStack, Image, Link as UILink, Popover, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, SimpleGrid, Text, ui, useAsync } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext } from 'react';
import { StateContext } from '../state/AuthContext';
import Link from 'next/link';
import type { getUser } from '@/lib/users';

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
        <Text fontSize="xl">試験まであと${value?.testDay ?? '-'}日</Text> :
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
              <Text>〇〇日連続ログイン</Text>
            </Box>
            <SimpleGrid w="full" columns={{
              base: 2,
              md: 1
            }} >
              <GridItem p="md" rounded="4" textAlign="center">
                <UILink display="flex" flexDir="column" gap="md" href='/' _hover={{ textDecor: 'none' }} as={Link} alignContent="space-between" h="full">
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