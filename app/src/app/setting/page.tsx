import { AuthProvider } from '@/components/state/AuthProvider';
import type { Metadata, NextPage } from 'next';
import { SettingForm } from '@/components/features/setting';

export const metadata: Metadata = {
  title: 'カコリンゴ-設定',
  description: 'カコリンゴ-設定',
};

const Setting: NextPage = () => {
  return <AuthProvider>
    <SettingForm />
  </AuthProvider>;
};

export default Setting;

