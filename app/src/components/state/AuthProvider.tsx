'use client';
import { useRouter } from 'next/navigation';
import type { FC, ReactNode } from 'react';
import { useContext, useEffect } from 'react';
import { StateContext } from './AuthContext';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { onSignout, userData, setIsAuthenticating } = useContext(StateContext);
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
    } catch (error) {
      console.error('verify', error);
    } finally {
      setIsAuthenticating(false);
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

  return <>{children}</>;
};