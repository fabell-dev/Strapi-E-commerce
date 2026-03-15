"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRound } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "@/app/providers";
import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";

export function AvatarDropdown() {
  const user = useContext(UserContext);

  const handleLogout = async () => {
    await logoutAction();
  };

  if (!user) {
    return (
      <Link href="/register">
        <Button className="ml-2">Registrarse</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="scale-125 cursor-pointer " asChild>
        <Button variant="ghost" size="icon" className="rounded-full ">
          <Avatar className="flex items-center justify-center bg-gray-100  ">
            <UserRound className="w-6 h-6 text-black " />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 z-90">
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-sm p-2 font-semibold">
            {user.username}
          </DropdownMenuItem>
          <Link href="/whishlist">
            <DropdownMenuItem>Whishlist</DropdownMenuItem>
          </Link>
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup></DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
