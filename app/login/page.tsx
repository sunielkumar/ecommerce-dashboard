import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Authenticate against the Fake Store API to unlock client-side cart management.",
};

export default function LoginPage() {
  return (
    <div className="py-8">
      <LoginForm />
    </div>
  );
}
