import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { currentAdmin } from "@/lib/supabase/auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLogin() {
  if (await currentAdmin()) redirect("/admin");
  return (
    <Container className="max-w-md">
      <h1 className="t-display">Panel</h1>
      <p className="mt-3 text-slate">Solo para el equipo de ACM Motorsport.</p>
      <LoginForm />
    </Container>
  );
}
