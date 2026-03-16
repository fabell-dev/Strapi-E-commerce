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
import { useActionState, useEffect, useState } from "react";
import { type SignupFormState } from "@/lib/validations/validationsAuth";
import { registerUserAction } from "@/lib/actions/auth-actions";

const INITIAL_STATE: SignupFormState = {
  success: false,
  message: undefined,
  data: {
    username: "",
    email: "",
    password: "",
    cpassword: "",
  },
  Errors: null,
};

export function RegisterForm() {
  const [formState, formAction] = useActionState(
    registerUserAction,
    INITIAL_STATE,
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  useEffect(() => {
    if (formState.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsername("");

      setEmail("");

      setPassword("");

      setCpassword("");
    }
  }, [formState.success]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Register to your account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="jhondoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {formState.Errors?.username && (
                <p className="text-sm text-red-500">
                  {formState.Errors.username[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {formState.Errors?.email && (
                <p className="text-sm text-red-500">
                  {formState.Errors.email[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {formState.Errors?.password && (
                <p className="text-sm text-red-500">
                  {formState.Errors.password[0]}
                </p>
              )}
              <div className="flex items-center">
                <Label htmlFor="cpassword">Confirm Password</Label>
              </div>
              <Input
                id="cpassword"
                name="cpassword"
                type="password"
                placeholder="••••••••"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
                required
              />
              {formState.Errors?.cpassword && (
                <p className="text-sm text-red-500">
                  {formState.Errors.cpassword[0]}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" className="mt-5 w-full">
            Register
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <CardAction className="w-full flex items-center justify-center">
          <p className="flex items-center text-sm text-gray-500">
            Already have an account?
            <Link className="ml-2 underline text-black" href="/login">
              Sign In
            </Link>
          </p>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
