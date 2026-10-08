"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { InterestSelector } from "./interest-selector";
import { InterestCategory, UserRole } from "@/types";
import { User, Mail, Lock, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Crown, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export function SignupForm() {
  const { signup, isLoading } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [role, setRole] = useState<UserRole>("owner");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<InterestCategory[]>([
    "Technology",
    "Photography",
  ]);

  const [errors, setErrors] = useState<{
    username?: string;
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    interests?: string;
  }>({});

  const validateStep1 = () => {
    const newErrors: typeof errors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    } else if (username.length < 3 || username.length > 20) {
      newErrors.username = "Username must be between 3 and 20 characters.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Only letters, numbers, and underscores are allowed.";
    }

    if (!displayName.trim()) {
      newErrors.displayName = "Full name / display name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleFinishSignup = async () => {
    if (selectedInterests.length < 2) {
      toast({
        type: "warning",
        title: "Interests Needed",
        message: "Please select at least 2 interests to personalize your feed.",
      });
      return;
    }

    await signup({
      username: username.trim(),
      displayName: displayName.trim(),
      email: email.trim(),
      password,
      role,
      interests: selectedInterests,
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-neutral-800/80 shadow-2xl bg-neutral-900/90 backdrop-blur-xl">
      <CardHeader className="text-center pb-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= 1 ? "bg-violet-600 text-white" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            1
          </div>
          <div
            className={`w-12 h-1 rounded transition-colors ${
              step === 2 ? "bg-violet-600" : "bg-neutral-800"
            }`}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step === 2 ? "bg-violet-600 text-white" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            2
          </div>
        </div>

        <CardTitle className="text-2xl font-black tracking-tight text-white">
          {step === 1 ? (
            <>
              Join the <span className="text-vybe-gradient">VYBE</span> Generation
            </>
          ) : (
            <>
              Curate Your <span className="text-vybe-gradient">VYBE</span>
            </>
          )}
        </CardTitle>
        <CardDescription className="text-xs text-neutral-400">
          {step === 1
            ? "Create your unique profile to share content, join communities, and discover people."
            : "Select the niches you want on your feed. You can change these anytime."}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2 flex flex-col gap-4">
        {step === 1 ? (
          <form onSubmit={handleNext} className="flex flex-col gap-3.5">
            {/* Account Role Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                <span>Select Account Role</span>
                <span className="text-[10px] text-neutral-500">Separates Owner & Users</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("owner")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    role === "owner"
                      ? "bg-amber-500/15 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.25)] text-white"
                      : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <Crown className={`w-5 h-5 mb-1 ${role === "owner" ? "text-amber-400" : "text-neutral-400"}`} />
                  <span className="text-xs font-bold">Platform Owner</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">Admin & verified</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("creator")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    role === "creator"
                      ? "bg-violet-500/15 border-violet-500/80 shadow-[0_0_15px_rgba(139,92,246,0.25)] text-white"
                      : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <Zap className={`w-5 h-5 mb-1 ${role === "creator" ? "text-violet-400" : "text-neutral-400"}`} />
                  <span className="text-xs font-bold">Creator</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">Studio & tools</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    role === "user"
                      ? "bg-cyan-500/15 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] text-white"
                      : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <User className={`w-5 h-5 mb-1 ${role === "user" ? "text-cyan-400" : "text-neutral-400"}`} />
                  <span className="text-xs font-bold">Member</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">Community</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Username"
                placeholder="e.g. dev_sarah"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                error={errors.username}
                helperText="Unique @handle on VYBE"
                disabled={isLoading}
              />
              <Input
                label="Display Name"
                placeholder="e.g. Sarah Connor ✨"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                leftIcon={<Sparkles className="w-4 h-4" />}
                error={errors.displayName}
                disabled={isLoading}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="sarah@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password}
              disabled={isLoading}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-2"
            >
              Continue to Interests
            </Button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <InterestSelector
              selectedInterests={selectedInterests}
              onChange={setSelectedInterests}
              minSelection={2}
            />

            {/* Profile card preview */}
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-500 flex items-center justify-center font-bold text-white text-sm">
                  {displayName ? displayName.charAt(0).toUpperCase() : "V"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-xs font-bold text-white leading-tight">
                      {displayName || "Your Name"}
                    </h5>
                    {role === "owner" && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        👑 Owner
                      </span>
                    )}
                    {role === "creator" && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/40">
                        ⚡ Creator
                      </span>
                    )}
                    {role === "user" && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        👤 Member
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    @{username || "username"} • {selectedInterests.length} Interests
                  </p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                disabled={isLoading}
              >
                Back
              </Button>

              <Button
                type="button"
                variant="gradient"
                size="md"
                isLoading={isLoading}
                onClick={handleFinishSignup}
                rightIcon={<Sparkles className="w-4 h-4" />}
                className="flex-1"
              >
                Complete Registration
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-center border-t border-neutral-800/60 py-3.5">
        <p className="text-xs text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
