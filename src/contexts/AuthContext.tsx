import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "teacher" | "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, User> = {
  "teacher@rupp.edu.kh": { id: "1", name: "Sok Channary", email: "teacher@rupp.edu.kh", role: "teacher" },
  "admin@rupp.edu.kh": { id: "2", name: "Chea Vicheka", email: "admin@rupp.edu.kh", role: "admin" },
  "student@rupp.edu.kh": { id: "3", name: "Pich Sovann", email: "student@rupp.edu.kh", role: "student" },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("rupp_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, _password: string) => {
    const found = mockUsers[email];
    if (!found) throw new Error("Invalid credentials");
    setUser(found);
    localStorage.setItem("rupp_user", JSON.stringify(found));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rupp_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
