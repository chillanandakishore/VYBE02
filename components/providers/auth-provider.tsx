"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { LoginPayload, RegisterPayload } from "@/types/auth";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<boolean>;
  signup: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  quickDemoLogin: (role: "creator" | "coder") => Promise<boolean>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check current session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error("Session check failed", err);
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
  }, []);

  const login = async (payload: LoginPayload): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast({
          type: "error",
          title: "Authentication Failed",
          message: data.message || "Invalid credentials.",
        });
        setIsLoading(false);
        return false;
      }

      setUser(data.user);
      toast({
        type: "success",
        title: "Welcome back!",
        message: `Signed in as @${data.user.username}`,
      });
      setIsLoading(false);
      router.push("/feed");
      return true;
    } catch {
      toast({
        type: "error",
        title: "Network Error",
        message: "Unable to connect to server. Please try again.",
      });
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (payload: RegisterPayload): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast({
          type: "error",
          title: "Registration Failed",
          message: data.message || "Failed to create account.",
        });
        setIsLoading(false);
        return false;
      }

      setUser(data.user);
      toast({
        type: "success",
        title: "Account Created!",
        message: `Welcome to VYBE, @${data.user.username}!`,
      });
      setIsLoading(false);
      router.push("/feed");
      return true;
    } catch {
      toast({
        type: "error",
        title: "Network Error",
        message: "Unable to complete registration. Please try again.",
      });
      setIsLoading(false);
      return false;
    }
  };

  const quickDemoLogin = async (role: "creator" | "coder"): Promise<boolean> => {
    const credentials =
      role === "creator"
        ? { loginIdentifier: "creator@vybe.social", password: "vybe123" }
        : { loginIdentifier: "coder@vybe.social", password: "vybe123" };

    return login(credentials);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      toast({
        type: "info",
        title: "Logged out successfully",
        message: "You have been signed out of VYBE Social.",
      });
      router.push("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        quickDemoLogin,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
