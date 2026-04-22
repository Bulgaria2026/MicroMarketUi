import { blurFirst, useAppForm } from "@/components/form/form";
import Grainient from "@/components/Grainient";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAuth } from "@/features/auth/context/use-auth";
import { emailField, passwordField } from "@/features/auth/schemas";
import { authService } from "@/features/auth/auth-service";
import { getApiErrorMessage } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

export function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: authService.register,
    meta: { suppressGlobalError: true },
    onSuccess: data => {
      login(data.accessToken);
      navigate({ to: "/" });
    },
  });

  const form = useAppForm({
    defaultValues: { email: "", password: "", confirmPassword: "" },
    onSubmit: async ({ value: { email, password } }) => {
      await mutation.mutateAsync({ email, password });
    },
  });

  return (
    <div className="flex grow w-full bg-background">
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign Up</h1>
            <p className="text-muted-foreground">Create an account to get started.</p>
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
              <form.AppField name="email" validators={blurFirst(emailField)}>
                {({ TextField }) => <TextField label="Email address" type="email" placeholder="Enter your email" />}
              </form.AppField>

              <form.AppField name="password" validators={blurFirst(passwordField)}>
                {({ TextField }) => <TextField label="Password" type="password" placeholder="Enter your password" />}
              </form.AppField>

              <form.AppField
                name="confirmPassword"
                validators={{
                  onChangeListenTo: ["password"],
                  onSubmit: ({ value, fieldApi }) =>
                    value === fieldApi.form.getFieldValue("password") ? undefined : "Passwords do not match.",
                  onChange: ({ value, fieldApi }) => {
                    if (!fieldApi.state.meta.isBlurred) return undefined;
                    return value === fieldApi.form.getFieldValue("password") ? undefined : "Passwords do not match.";
                  },
                }}
              >
                {({ TextField }) => (
                  <TextField label="Confirm password" type="password" placeholder="Confirm your password" />
                )}
              </form.AppField>
            </FieldGroup>

            {mutation.isError && (
              <p className="text-sm text-destructive">
                {getApiErrorMessage(mutation.error, "Registration failed. Please try again.")}
              </p>
            )}

            <form.Subscribe selector={state => state.isSubmitting}>
              {isSubmitting => (
                <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>
              )}
            </form.Subscribe>
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
