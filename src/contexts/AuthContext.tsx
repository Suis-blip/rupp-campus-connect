import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser, Session } from "@supabase/supabase-js";

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
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUserProfile(supaUser: SupaUser): Promise<User> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, avatar_url")
    .eq("id", supaUser.id)
    .single();

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", supaUser.id);

  const role = (roles?.[0]?.role as UserRole) ?? "student";

  return {
    id: supaUser.id,
    name: profile?.name || supaUser.email?.split("@")[0] || "",
    email: supaUser.email || "",
    role,
    avatar: profile?.avatar_url ?? undefined,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const applySession = async (session: Session | null) => {
      try {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user);
          if (!isMounted) return;
          setUser(profile);
        } else {
          if (!isMounted) return;
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to restore user session", error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });

    void supabase.auth
      .getSession()
      .then(({ data: { session } }) => applySession(session))
      .catch((error) => {
        console.error("Failed to fetch current session", error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      });

    const loadingSafetyTimeout = window.setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 5000);

    return () => {
      isMounted = false;
      window.clearTimeout(loadingSafetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
