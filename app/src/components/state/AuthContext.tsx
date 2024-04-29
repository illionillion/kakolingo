'use client';
import type { ReactNode} from 'react';
import { createContext, useState } from 'react';

export interface UserData {
    userId: number | undefined;
    userName: string | undefined;
    token: string | undefined;
}

export interface StateContextType {
    userData: UserData | undefined;
    isAuthenticating: boolean;
    setIsAuthenticating: (bool: boolean) => void;
    onLogin: (user: UserData) => void;
    onLogout: () => Promise<void>;
}

const KEY = 'kakolingo_user_data';

const defaultUserData: UserData = {
  userId: undefined,
  userName: undefined,
  token: undefined,
};

const defaultContext: StateContextType = {
  userData: defaultUserData,
  isAuthenticating: false,
  setIsAuthenticating: () => { },
  onLogin: () => { },
  onLogout: async () => { },
};

export const StateContext = createContext<StateContextType>(defaultContext);

export const useStateContext = () => {
  const [value, setValue] = useState<UserData>(getLocalStorage());
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);
  const onLogin: StateContextType['onLogin'] = (user) => {
    setValue(user);
    setLocalStorage(user);
  };
  const onLogout: StateContextType['onLogout'] = async () => {
    // ユーザーの情報を削除
    setValue({
      userId: undefined,
      token: undefined,
      userName: undefined,
    });
    localStorage.removeItem(KEY);
    // トークンの無効化
    await fetch('/api/auth/signout', {
      method: 'POST',
      body: JSON.stringify({
        userId: value?.userId,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${value?.token}`,
      },
    });
  };
  const contextValue: StateContextType = {
    userData: value,
    isAuthenticating: isAuthenticating,
    setIsAuthenticating: setIsAuthenticating,
    onLogin,
    onLogout,
  };
  return contextValue;
};

const getLocalStorage = (): UserData => {
  try {
    const userDataString = localStorage.getItem(KEY);
    if (!userDataString) {
      return {
        userId: undefined,
        token: undefined,
        userName: undefined,
      };
    }
    return JSON.parse(userDataString);
  } catch (error) {
    console.error('Error parsing user data from local storage:', error);
    return {
      userId: undefined,
      token: undefined,
      userName: undefined,
    };
  }
};

const setLocalStorage = (user: UserData) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch (error) {
    console.error(error);
  }
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const ctx = useStateContext();

  return <StateContext.Provider value={ctx}>{children}</StateContext.Provider>;
};
