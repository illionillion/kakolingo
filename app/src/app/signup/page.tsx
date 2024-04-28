import { SignupForm } from '@/components/features/signup';
import { Container, Heading } from '@yamada-ui/react';
import type { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'カコリンゴ-サインアップ',
  description: 'カコリンゴ-サインアップ',
};

const SignupPage: NextPage = () => {
  return <>
    <Container maxW='2xl' justifyContent='center' m='auto'>
      <Heading textAlign='center'>新規登録</Heading>
      <SignupForm/>
    </Container>
  </>;
};

export default SignupPage;