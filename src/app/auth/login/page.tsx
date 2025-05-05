import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | Admin - Next.js Dashboard Template",
  description: "This is Next.js Signin Page Admin Dashboard Template",
};

export default function Login() {
  return <LoginForm />;
}
