'use client';

import { StateContext } from '@/components/state/AuthContext';
import { AuthProvider } from '@/components/state/AuthProvider';
import { Button } from '@yamada-ui/react';
import { useContext } from 'react';

export default function Home() {
  const { onSignout, isAuthenticating } = useContext(StateContext);
  return (
    <AuthProvider>
      {isAuthenticating ? '認証中' : <Button onClick={onSignout}>Logout</Button>}
    </AuthProvider>
  );
}
