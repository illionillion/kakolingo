import { SigninForm } from '@/components/features/signin';
import { Container, Heading } from '@yamada-ui/react';
import type { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'カコリンゴ-サインイン',
  description: 'カコリンゴ-サインイン',
};

const SigninPage: NextPage = () => {
  return <>
    <Container maxW='2xl' justifyContent='center' m='auto'>
      <Heading textAlign='center'>サインイン</Heading>
      <SigninForm />
    </Container></>;
};

export default SigninPage;