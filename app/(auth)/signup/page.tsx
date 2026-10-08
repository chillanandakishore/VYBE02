import React from "react";
import { SignupForm } from "@/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | VYBE",
  description: "Join VYBE. Select your interests, connect with creators, and share your world.",
};

export default function SignupPage() {
  return <SignupForm />;
}
