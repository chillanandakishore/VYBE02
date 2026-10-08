import React from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | VYBE",
  description: "Sign in to your VYBE account to discover and share content based on your interests.",
};

export default function LoginPage() {
  return <LoginForm />;
}
