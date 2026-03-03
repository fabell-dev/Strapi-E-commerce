// app/providers.tsx
"use client";
import { createContext, ReactNode } from "react";

interface User {
  id: number;
  username: string;
  email: string;
}

export const UserContext = createContext<User | null>(null);

export function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
