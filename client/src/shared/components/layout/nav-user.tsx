import * as React from "react";
import { Link } from "react-router-dom";
import { EllipsisVertical, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

type NavUserItem = {
  label: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavUserProps = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onLogout: () => void;
  items?: NavUserItem[];
};

export function NavUser({ user, onLogout, items = [] }: NavUserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
<button
  type="button"
  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-colors hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60 data-[state=open]:bg-white/[0.06]"
  aria-label="Open account menu"
>
  <Avatar className="h-full w-full rounded-full">
    <AvatarImage src={user.avatar} alt={user.name} />
    <AvatarFallback className="rounded-full bg-zinc-800 text-xs font-medium text-zinc-300">
      {user.name.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  </Avatar>
</button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 min-w-56 rounded-xl border-white/10 bg-[#111113] text-white"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-xl">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-xl bg-white/10 text-white">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-[#A1A1AA]">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuGroup>
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <DropdownMenuItem key={item.url} asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                <Link to={item.url} className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem 
          onSelect={onLogout} 
          className="focus:bg-white/10 text-red-400 focus:text-red-300 cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}