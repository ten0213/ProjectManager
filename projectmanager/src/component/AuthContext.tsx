import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('signId') !== null;
  });

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
   sessionStorage.removeItem('signId'); // signId 제거
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // localStorage의 signId 존재 여부로 로그인 상태 확인
    const signId = sessionStorage.getItem('signId');
    setIsLoggedIn(!!signId);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
