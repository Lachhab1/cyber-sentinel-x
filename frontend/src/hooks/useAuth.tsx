import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, User } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing backend token and load user profile
  const loadBackendUser = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const userProfile = await api.auth.getProfile();
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Failed to load backend user:', error);
      // Clear invalid token
      localStorage.removeItem('auth_token');
    }
  };

  useEffect(() => {
    // Load backend user on mount
    loadBackendUser().finally(() => setLoading(false));
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const response = await api.auth.register({ email, password, displayName });
      setUser(response.user);
      toast.success('Successfully registered and signed in');
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      toast.error(errorMessage);
      return { error: { message: errorMessage } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      setUser(response.user);
      toast.success('Successfully signed in');
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Sign in failed';
      toast.error(errorMessage);
      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    try {
      await api.auth.logout();
      setUser(null);
      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Clear user state even if API call fails
      setUser(null);
      localStorage.removeItem('auth_token');
    }
  };

  const refreshUser = async () => {
    try {
      const userProfile = await api.auth.getProfile();
      setUser(userProfile);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refresh fails, user might be logged out
      setUser(null);
      localStorage.removeItem('auth_token');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}