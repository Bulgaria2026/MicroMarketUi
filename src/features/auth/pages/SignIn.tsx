import { getApiErrorMessage } from "@/lib/api";
import { afterSubmit, useAppForm } from "@/components/form/form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";

import Grainient from "@/components/Grainient";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAuth } from "@/features/auth/context/use-auth";
import { emailField, passwordField } from "@/features/auth/schemas";
import { authService } from "@/features/auth/services/auth";

export function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: authService.login,
    meta: { suppressGlobalError: true },
    onSuccess: data => {
      login(data.accessToken);
      navigate({ to: "/" });
    },
  });

  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="relative hidden w-1/2 lg:block">
        <Grainient
          color1="#ffffff"
          color2="#4b4b4b"
          color3="#000000"
          timeSpeed={0.05}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={10}
          warpSpeed={1}
          warpAmplitude={30}
          blendAngle={0}
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

      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign In</h1>
            <p className="text-muted-foreground">Enter your email and password to sign in.</p>
          </div>

          <form
            noValidate
            className="space-y-4"
            onSubmit={e => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField name="email" validators={afterSubmit(emailField)}>
                {({ TextField }) => <TextField label="Email address" type="email" placeholder="Enter your email" />}
              </form.AppField>

              <form.AppField name="password" validators={afterSubmit(passwordField)}>
                {({ TextField }) => <TextField label="Password" type="password" placeholder="Enter your password" />}
              </form.AppField>
            </FieldGroup>

            {mutation.isError && (
              <p className="text-sm text-destructive">
                {isAxiosError(mutation.error) && mutation.error.response?.status === 401
                  ? "Invalid email or password."
                  : getApiErrorMessage(mutation.error, "Something went wrong. Please try again.")}
              </p>
            )}

            <form.Subscribe selector={state => state.isSubmitting}>
              {isSubmitting => (
                <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="font-medium text-primary hover:underline underline-offset-4">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
