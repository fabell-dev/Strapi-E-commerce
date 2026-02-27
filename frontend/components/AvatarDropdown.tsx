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

export function AvatarDropdown() {
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
          <DropdownMenuItem>Whishlist</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Logout</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup></DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
