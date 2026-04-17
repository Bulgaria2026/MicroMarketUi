import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Grainient from "../components/Grainient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../lib/auth";
import { authService } from "../services/auth";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: SignUp,
});

function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: authService.register,
    meta: { suppressGlobalError: true },
    onSuccess: data => {
      login(data.accessToken);
      navigate({ to: "/" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (email && password) {
      mutation.mutate({ email: String(email), password: String(password) });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign Up</h1>
            <p className="text-muted-foreground">Create an account to get started.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" placeholder="Enter your email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Enter your password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="Confirm your password"
                required
              />
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
            {mutation.isError && (
              <p className="text-sm text-destructive">
                {(mutation.error as any)?.response?.data?.message || "Registration failed. Please try again."}
              </p>
            )}
            <Button type="submit" className="w-full mt-6" disabled={mutation.isPending}>
              {mutation.isPending ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/signin" className="font-medium text-primary hover:underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden w-1/2 lg:block">
        <Grainient
          color1="#ffffff"
          color2="#4b4b4b"
          color3="#000000"
          timeSpeed={0.01}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={180}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>
    </div>
  );
}
