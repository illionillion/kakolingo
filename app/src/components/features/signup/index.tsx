'use client';
import { StateContext } from '@/components/state/AuthContext';
import { Button, FormControl, IconButton, Input, InputGroup, InputRightElement, Link as UiLink, VStack, useBoolean, useNotice } from '@yamada-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, type FC } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
type SignupData = {
  userName: string;
  displayName: string;
  userEmail: string;
  password: string;
  confirmPassword: string;
};
export const SignupForm: FC = () => {
  const [passwordShow, { toggle: passwordShowToggle }] = useBoolean();

  const { onSignin, userData } = useContext(StateContext);

  const notice = useNotice();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>();

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    console.log('submit:', data);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (response.ok) {
        onSignin({
          userId: json?.userId,
          userName: json?.userName,
          token: json?.accessToken
        });
        router.push('/');
      } else {
        notice({
          title: 'エラー',
          description: json.message,
          placement: 'top-right',
          status: 'error',
          variant: 'top-accent',
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('登録エラー', error);
      notice({
        title: 'エラー',
        description: (error as any).message,
        placement: 'top-right',
        status: 'error',
        variant: 'top-accent',
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (userData && Object.values(userData).every((v) => !!v === true)) {
      router.push('/');
    }
  }, [userData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap="lg">
        <FormControl
          isRequired
          label="ユーザー名"
          gap="md"
          isInvalid={!!errors.userName}
          errorMessage={errors.userName?.message}
        >
          <Input
            type='text'
            placeholder='ユーザー名を入力'
            autoComplete='on'
            {...register('userName', {
              required: {
                value: true,
                message: '必須項目です。',
              },
            })}
          />
        </FormControl>
        <FormControl
          isRequired
          label="ニックネーム"
          gap="md"
          isInvalid={!!errors.displayName}
          errorMessage={errors.displayName?.message}
        >
          <Input
            type='text'
            placeholder='ニックネームを入力'
            autoComplete='on'
            {...register('displayName', {
              required: {
                value: true,
                message: '必須項目です。',
              },
            })}
          />
        </FormControl>
        <FormControl
          isRequired
          label="メールアドレス"
          gap="md"
          isInvalid={!!errors.userEmail}
          errorMessage={errors.userEmail?.message}
        >
          <Input
            type='email'
            placeholder='メールアドレスを入力'
            autoComplete='on'
            {...register('userEmail', {
              required: {
                value: true,
                message: '必須項目です。',
              },
              onBlur: () => {
                if (getValues('userEmail')) {
                  trigger('userEmail');
                }
              },
              pattern: {
                value: /^[\w\-._]+@[\w\-._]+\.[A-Za-z]+/,
                message: '入力形式がメールアドレスではありません。',
              },
            })}
          />
        </FormControl>
        <FormControl
          isRequired
          label="パスワード"
          gap="md"
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
        >
          <InputGroup>
            <Input
              type={passwordShow ? 'text' : 'password'}
              placeholder='パスワードを入力'
              {...register('password', {
                required: {
                  value: true,
                  message: '必須項目です。',
                },
                minLength: {
                  value: 8,
                  message: 'パスワードは8文字以上にしてください。',
                },
              })}
              autoComplete='on'
            />
            <InputRightElement isClick>
              <IconButton
                size='sm'
                icon={passwordShow ? <EyeOff /> : <Eye />}
                onClick={passwordShowToggle}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button type='submit' m="auto" w="fit-content" isLoading={isSubmitting} colorScheme="primary" >
          登録
        </Button>
        <UiLink as={Link} href="/signin" m="auto">サインインはこちら</UiLink>
      </VStack>
    </form>
  );
};