"use client";

import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createClient } from "~/lib/supabase/client";

type Mode = "sign-in" | "sign-up";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getNextPath() {
    return new URLSearchParams(window.location.search).get("next") ?? "/";
  }

  useEffect(() => {
    const requestedMode = new URLSearchParams(window.location.search).get(
      "mode",
    );
    if (requestedMode === "sign-up") {
      setMode("sign-up");
    }
  }, []);

  async function handleGoogleSignIn() {
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getNextPath())}`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const supabase = createClient();

    if (mode === "sign-in") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsSubmitting(false);
        return;
      }

      router.push(getNextPath());
      router.refresh();
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsSubmitting(false);
        return;
      }

      if (data.session) {
        router.push(getNextPath());
        router.refresh();
      } else {
        setMessage("Check your email to confirm your account.");
        setIsSubmitting(false);
      }
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-4 py-16">
      <Link href="/" className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-xl font-bold tracking-tight text-primary">
          ScreeningNavigator.com
        </span>
        <span className="text-sm text-muted-foreground">
          Breast cancer screening access
        </span>
      </Link>

      <Card className="w-full max-w-sm border-primary/20">
        <CardHeader className="items-center text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="size-6 text-primary" />
          </div>
          <CardTitle className="text-xl">
            {mode === "sign-in" ? "Sign in" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {mode === "sign-in"
              ? "Sign in with your email and password."
              : "Sign up with your email and password."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47a5.54 5.54 0 0 1-2.4 3.64v3h3.88c2.27-2.09 3.54-5.17 3.54-8.75Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3a7.16 7.16 0 0 1-10.66-3.77H1.44v3.09A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.41 14.33a7.2 7.2 0 0 1 0-4.66V6.58H1.44a12 12 0 0 0 0 10.84l3.97-3.09Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44A11.6 11.6 0 0 0 12 0 12 12 0 0 0 1.44 6.58l3.97 3.09A7.16 7.16 0 0 1 12 4.75Z"
              />
            </svg>
            Continue with Google
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </CardContent>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4 pt-0">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={
                  mode === "sign-in" ? "current-password" : "new-password"
                }
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {message ? (
              <p className="text-sm text-muted-foreground">{message}</p>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {mode === "sign-in" ? "Sign in" : "Sign up"}
            </Button>
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => {
                setMode(mode === "sign-in" ? "sign-up" : "sign-in");
                setError(null);
                setMessage(null);
              }}
            >
              {mode === "sign-in"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
