import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client.js';
import { getMe } from '../api/user.js';
import { logout as logoutApi } from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 저장된 토큰으로 유저 정보 복원
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      getMe(userId)
        .then((data) => setUser(data))
        .catch(() => {
          apiClient.clearTokens();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // 구글 로그인 콜백에서 호출
  const loginWithTokens = useCallback(({ accessToken, refreshToken, userId, isNewUser }) => {
    apiClient.setTokens(accessToken, refreshToken);
    localStorage.setItem('userId', userId);
    return { isNewUser };
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // 서버 오류여도 로컬 정리
    } finally {
      apiClient.clearTokens();
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const data = await getMe(userId);
      setUser(data);
    } catch {
      // 무시
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginWithTokens, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
