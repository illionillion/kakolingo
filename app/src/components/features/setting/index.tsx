'use client';
import { StateContext } from '@/components/state/AuthContext';
import type { getUser } from '@/lib/users';
import { DatePicker } from '@yamada-ui/calendar';
import { Button, Center, Container, FormControl, Heading, HelperMessage, Input, VStack, useAsync, useNotice } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext } from 'react';
import type { SubmitHandler} from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

interface SubmitData {
  displayName: string;
  testDay: Date | undefined;
}

export const SettingForm: FC = () => {
  const { userData } = useContext(StateContext);
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: {
      errors
    }
  } = useForm<SubmitData>();
  const notice = useNotice();
  const { loading } = useAsync(async () => {
    const response = await fetch(`/api/users/${userData?.userName}`, {
      cache: 'no-cache'
    });
    const { data } = await response.json() as { data: Awaited<ReturnType<typeof getUser>> };
    setValue('displayName', data!.displayName);
    if (data?.testDay) setValue('testDay', new Date(data.testDay));
  });

  const onSubmit: SubmitHandler<SubmitData> = async (data) => {
    const response = await fetch(`/api/users/${userData?.userName}`, {
      method: 'PUT',
      body: JSON.stringify({
        userId: userData?.userId,
        displayName: data.displayName,
        testDay: data.testDay
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData?.token}`,
      },
    });
    if (!response.ok) {
      notice({
        title: 'エラー',
        description: '更新に失敗しました',
        placement: 'bottom-right',
        status: 'error',
        variant: 'top-accent',
        isClosable: true,
      });
      return;
    }
    notice({
      title: '成功',
      description: '更新に成功しました',
      placement: 'bottom-right',
      status: 'success',
      variant: 'top-accent',
      isClosable: true,
    });
  };

  return <Container maxW="8xl" m="auto">
    {!loading && <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap="xl">
        <Heading>設定変更</Heading>
        <FormControl isRequired label="ニックネーム"
          isInvalid={!!errors.displayName}
          errorMessage={errors.displayName?.message}
        >
          <Input type='text' placeholder='ニックネームを入力'
            {...register('displayName', {
              required: {
                value: true,
                message: '必須項目です。',
              },
            })}
          />
        </FormControl>
        <FormControl label="受験予定日">
          <HelperMessage>あなたの受験予定日を設定することで、試験日までのカウントダウンをページの右上に表示されます</HelperMessage>
          <Controller name='testDay' control={control}
            render={({
              field
            }) => <DatePicker placeholder="YYYY/MM/DD" {...field} />} />
        </FormControl>
        <Center>
          <Button colorScheme='primary' type='submit'>設定</Button>
        </Center>
      </VStack>
    </form>}
  </Container>;
};