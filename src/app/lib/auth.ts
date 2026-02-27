// 认证相关工具函数

import type { Employee } from './mockData';

export interface AuthUser {
  id: number;
  name: string;
  role: string;
  employeeNo: string;
}

const AUTH_KEY = 'current_user';

export const login = (user: Employee): void => {
  const authUser: AuthUser = {
    id: user.id,
    name: user.name,
    role: user.role,
    employeeNo: user.employeeNo,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = (): AuthUser | null => {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const hasRole = (role: string | string[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  return user.role === role;
};
