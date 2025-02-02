import { createContext, useContext, useEffect, useState } from 'react';
import { UserPrivateSchema, useCurrentUser, useLogin, useSignup } from '../api/auth';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../api/api';

type AuthContextType = {
  user: UserPrivateSchema | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: UserPrivateSchema | null) => void;
  getToken: () => string | null;
  setToken: (token: string) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: 'student' | 'instructor') => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPrivateSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const isAuthPage = router.state.location.pathname === '/login' || 
                    router.state.location.pathname === '/signup';

  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser({
    enabled: !!localStorage.getItem('access_token') && !isAuthPage,
  });

  useEffect(() => {
    if (!isLoadingUser) {
      setUser(currentUser || null);
      setIsLoading(false);
    }
  }, [currentUser, isLoadingUser]);

  const getToken = () => {
    return localStorage.getItem('access_token');
  };

  const setToken = (token: string) => {
    localStorage.setItem('access_token', token);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    queryClient.clear();
    navigate({ to: '/login' });
  };

  const login = async (email: string, password: string) => {
    const authResponse = await loginMutation.mutateAsync({ email, password });
    setToken(authResponse.access);
    // Ensure token is set before fetching user data
    const userData = await queryClient.fetchQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const response = await api.get<UserPrivateSchema>('/auth/me');
        return response.data;
      }
    });
    setUser(userData);
    navigate({ to: '/' });
  };

  const signup = async (email: string, password: string, role: 'student' | 'instructor') => {
    const authResponse = await signupMutation.mutateAsync({ email, password, role });
    setToken(authResponse.access);
    // Ensure token is set before fetching user data
    const userData = await queryClient.fetchQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const response = await api.get<UserPrivateSchema>('/auth/me');
        return response.data;
      }
    });
    setUser(userData);
    navigate({ to: '/' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isAuthPage ? false : isLoading,
        isAuthenticated: !!currentUser,
        setUser,
        getToken,
        setToken,
        logout,
        login,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

