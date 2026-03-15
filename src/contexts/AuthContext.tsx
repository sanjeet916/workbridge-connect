import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'worker' | 'employer';
export type WorkType = 'hands-on' | 'computer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  workType?: WorkType;
  profileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole, workType?: WorkType) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('workbridge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string) => {
    // Mock login - check stored users
    const users = JSON.parse(localStorage.getItem('workbridge_users') || '[]');
    const found = users.find((u: User & { password: string }) => u.email === email);
    if (!found) throw new Error('User not found');
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem('workbridge_user', JSON.stringify(userData));
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, role: UserRole, workType?: WorkType) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role,
      workType,
      profileComplete: false,
    };
    // Store in mock DB
    const users = JSON.parse(localStorage.getItem('workbridge_users') || '[]');
    users.push({ ...newUser, password });
    localStorage.setItem('workbridge_users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('workbridge_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('workbridge_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
