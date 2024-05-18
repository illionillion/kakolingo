'use client';
import { StateContext } from '@/components/state/AuthContext';
import type { getUser } from '@/lib/users';
import { DatePicker } from '@yamada-ui/calendar';
import { Button, Center, Container, FormControl, Heading, HelperMessage, Input, VStack, useAsync } from '@yamada-ui/react';
import type { FC} from 'react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';

interface SubmitData {
    displayName: string;
    testDay: Date | undefined;
}

export const SettingForm: FC = () => {
  const { userData } = useContext(StateContext);
  const {
    control,
    handleSubmit,
    watch,
    formState: {
      errors
    }
  } = useForm<SubmitData>();
  const { value } = useAsync(async () => {
    const response = await fetch(`/api/users/${userData?.userName}`, {
      cache: 'no-cache'
    });
    const { data } = await response.json() as { data: Awaited<ReturnType<typeof getUser>> };
    
    return { displayName: data?.displayName, testDay: data?.testDay };
    
  });

  return <Container maxW="8xl" m="auto">
    <form >
      <VStack gap="xl">
        <Heading>設定変更</Heading>
        <FormControl isRequired label="ニックネーム">
          <Input type='text' placeholder='ニックネームを入力' />
        </FormControl>
        <FormControl label="受験予定日">
          <HelperMessage>あなたの受験予定日を設定することで、試験日までのカウントダウンをページの右上に表示されます</HelperMessage>
          <DatePicker />
        </FormControl>
        <Center>
          <Button colorScheme='primary'>設定</Button>
        </Center>
      </VStack>
    </form>
  </Container>;
};