"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";
import {
  SigninFormSchema,
  type SigninFormState,
} from "@/lib/validations/validationsAuth";
import { loginUserAction } from "@/lib/actions/auth";

const INITIAL_STATE: SigninFormState = {
  success: false,
  message: undefined,
  data: {
    identifier: "",
    password: "",
  },
  Errors: null,
};

export function LoginForm() {
  const [formState, formAction] = useActionState(
    loginUserAction,
    INITIAL_STATE,
  );

  return (
    <Card className="w-full max-w-sm ">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="identifier">Email or Username</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="m@example.com or username"
                required
              />
              {formState.Errors?.identifier && (
                <p className="text-sm text-red-500">
                  {formState.Errors.identifier[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
              {formState.Errors?.password && (
                <p className="text-sm text-red-500">
                  {formState.Errors.password[0]}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full mt-5">
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
        <CardAction className="w-full flex items-center justify-center">
          <p className="flex items-center text-sm text-gray-500">
            Don't have an account?
            <Link className="ml-2 underline text-black" href="/register">
              Sign Up
            </Link>
          </p>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
