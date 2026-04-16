import { createFileRoute, Link } from "@tanstack/react-router";
import Grainient from "../components/Grainient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export const Route = createFileRoute("/signin")({
  component: SignIn,
});

function SignIn() {
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

          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="Enter your email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" required />
            </div>
            <Button type="submit" className="w-full mt-6">
              Sign In
            </Button>
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
