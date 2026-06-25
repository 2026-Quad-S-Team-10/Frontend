import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client.js';
import { getMe } from '../api/user.js';
import { getMyInfo, logout as logoutApi } from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    apiClient.clearTokens();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('isNewUser');
    setUser(null);
  }, []);

  // 앱 시작 시 저장된 토큰으로 유저 정보 복원
  useEffect(() => {
    const restoreUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const savedUserId = localStorage.getItem('userId');

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        apiClient.setTokens(accessToken, localStorage.getItem('refreshToken'));

        // userId가 저장되어 있으면 학습 도메인용 유저 정보 조회
        if (savedUserId) {
          const data = await getMe(savedUserId);
          setUser(data);
          return;
        }

        // userId가 없으면 auth/me로 먼저 조회해서 userId 저장
        const me = await getMyInfo();
        const authUser = me?.data ?? me;
        const userId = authUser?.userId;

        if (userId) {
          localStorage.setItem('userId', userId);

          try {
            const data = await getMe(userId);
            setUser(data);
          } catch {
            setUser(authUser);
          }
        } else {
          setUser(authUser);
        }
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, [clearAuth]);

  // 구글 로그인 콜백에서 호출
  const loginWithTokens = useCallback(
    async ({ accessToken, refreshToken, userId, isNewUser }) => {
      apiClient.setTokens(accessToken, refreshToken);

      localStorage.setItem('accessToken', accessToken);

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      localStorage.setItem('isNewUser', String(isNewUser));

      if (userId) {
        localStorage.setItem('userId', userId);
      }

      // 신규 사용자는 아직 createAccount 전이라 user 조회를 무리해서 하지 않음
      if (isNewUser) {
        setUser(null);
        return { isNewUser };
      }

      try {
        const me = await getMyInfo();
        const authUser = me?.data ?? me;
        const resolvedUserId = userId || authUser?.userId;

        if (resolvedUserId) {
          localStorage.setItem('userId', resolvedUserId);

          try {
            const data = await getMe(resolvedUserId);
            setUser(data);
          } catch {
            setUser(authUser);
          }
        } else {
          setUser(authUser);
        }
      } catch {
        setUser(null);
      }

      return { isNewUser };
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // 서버 오류여도 로컬 정리
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const refreshUser = useCallback(async () => {
    try {
      let userId = localStorage.getItem('userId');

      if (!userId) {
        const me = await getMyInfo();
        const authUser = me?.data ?? me;
        userId = authUser?.userId;

        if (userId) {
          localStorage.setItem('userId', userId);
        } else {
          setUser(authUser);
          return;
        }
      }

      const data = await getMe(userId);
      setUser(data);
    } catch {
      // refresh 실패 시 앱 전체 로그아웃까지는 하지 않음
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        loginWithTokens,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}