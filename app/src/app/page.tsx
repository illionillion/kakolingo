'use client';

import { StateContext } from '@/components/state/AuthContext';
import { Button } from '@yamada-ui/react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function Home() {
  const { onSignout, userData, isAuthenticating, setIsAuthenticating } = useContext(StateContext);
  const router = useRouter();

  const checkToken = async () => {
    try {
      setIsAuthenticating(true);
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({
          userId: userData?.userId,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.token}`,
        },
      });

      const json = await response.json();

      // 正しくないならログアウト
      if (!json.authenticated) {
        await onSignout();
        return;
      }
      setIsAuthenticating(false);
    } catch (error) {
      console.error('verify', error);
    }
  };

  useEffect(() => {
    console.log(userData);
    if (userData && Object.values(userData).every((v) => !!v === true)) {
      console.log('ログイン済み');
      // 認証
      checkToken();
    } else {
      console.log('未ログイン');
      router.push('/signin');
    }
  }, [userData]);
  return (
    <>
      {isAuthenticating ? '認証中' : <Button onClick={onSignout}>Logout</Button>}
    </>
  );
}
