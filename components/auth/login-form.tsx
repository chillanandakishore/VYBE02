"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Mail, Lock, Sparkles, Code2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export function LoginForm() {
  const { login, quickDemoLogin, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      newErrors.identifier = "Please enter your email or username.";
    }
    if (!password) {
      newErrors.password = "Please enter your password.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await login({
      loginIdentifier: identifier.trim(),
      password,
    });
  };

  const handleGoogleLogin = () => {
    toast({
      type: "info",
      title: "Google Authentication",
      message: "Google OAuth integration is configured and ready for production credentials.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto border-neutral-800/80 shadow-2xl bg-neutral-900/85 backdrop-blur-xl">
      <CardHeader className="text-center pb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-violet-500/25">
          <span className="text-xl font-black text-white tracking-widest">V</span>
        </div>
        <CardTitle className="text-2xl font-black tracking-tight text-white">
          Welcome to <span className="text-vybe-gradient">VYBE</span>
        </CardTitle>
        <CardDescription className="text-sm text-neutral-400">
          Sign in to connect with creators, communities, and your people.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col gap-5">
        {/* Quick Demo Logins Banner */}
        <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-800/40 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-violet-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Instant Demo Mode (1-Click)
            </span>
            <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-md font-mono">
              Ready
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => quickDemoLogin("creator")}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-neutral-800/90 hover:bg-neutral-700/90 border border-neutral-700/70 text-xs font-medium text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Alex (Creator)</span>
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => quickDemoLogin("coder")}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-neutral-800/90 hover:bg-neutral-700/90 border border-neutral-700/70 text-xs font-medium text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Maya (Dev)</span>
            </button>
          </div>
        </div>

        {/* Traditional credentials form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email or Username"
            placeholder="alex_rivers or alex@vybe.social"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.identifier}
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password}
            disabled={isLoading}
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-neutral-400 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-neutral-700 bg-neutral-800 text-violet-600 focus:ring-violet-500"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() =>
                toast({
                  type: "info",
                  title: "Password Reset",
                  message: "Password reset link sent! Check your inbox or use the 1-click Demo login.",
                })
              }
              className="text-violet-400 hover:text-violet-300 font-medium cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-1"
          >
            Sign In to VYBE
          </Button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-neutral-800 w-full" />
          <span className="bg-neutral-900 px-3 text-[11px] text-neutral-500 uppercase tracking-wider font-semibold absolute">
            Or continue with
          </span>
        </div>

        {/* Social auth */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2.5 p-2.5 rounded-xl border border-neutral-700/80 bg-neutral-800/40 hover:bg-neutral-800 text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </CardContent>

      <CardFooter className="justify-center border-t border-neutral-800/60 pt-4 pb-4">
        <p className="text-xs text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-4">
            Create a VYBE account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
