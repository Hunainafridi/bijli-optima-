import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { secureStorage } from '../services/secureStorage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUri: string;
  role: string;
  gridZone: string;
  discoProvider: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_pak_829104',
  name: 'Hamza Khan',
  email: 'hamza.k@bijlioptima.pk',
  avatarUri: 'avatar', // local bundled asset
  role: 'Operations Manager',
  gridZone: 'Lahore Urban Feeder 14',
  discoProvider: 'LESCO 3-Phase Smart Bus',
  isVerified: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const token = await secureStorage.getAuthToken();
      const savedProfile = await secureStorage.getUserProfile<UserProfile>();
      if (token && savedProfile) {
        setUser(savedProfile);
        setIsAuthenticated(true);
      } else {
        // By default provide seamless access to the verified energy operations profile
        setUser(DEFAULT_USER);
        setIsAuthenticated(true);
      }
    } catch {
      setUser(DEFAULT_USER);
      setIsAuthenticated(true);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth handshake
      await new Promise((r) => setTimeout(r, 900));
      const simulatedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.bijlioptima_sec_token_9281';
      await secureStorage.saveAuthToken(simulatedToken);
      await secureStorage.saveUserProfile(DEFAULT_USER);
      setUser(DEFAULT_USER);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await secureStorage.clearAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    await secureStorage.saveUserProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        loginWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
