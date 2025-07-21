import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/directory';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  canEditDepartment: (department: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    employeeId: '1',
    role: 'admin',
    username: 'admin',
    password: 'admin123',
    lastLogin: new Date(),
  },
  {
    id: '2',
    employeeId: '2',
    role: 'department_head',
    username: 'manager',
    password: 'manager123',
    lastLogin: new Date(),
    departmentAccess: ['IT отдел', 'Бухгалтерия'],
  },
  {
    id: '3',
    employeeId: '3',
    role: 'user',
    username: 'user',
    password: 'user123',
    lastLogin: new Date(),
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      setUser({ ...foundUser, lastLogin: new Date() });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const canEditDepartment = (department: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'department_head') {
      return user.departmentAccess?.includes(department) ?? false;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      hasRole,
      canEditDepartment
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};