"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const DashboardUserButton = () => {
  const router = useRouter();

  const { data, isPending } = authClient.useSession();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  if (isPending || !data?.user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-primary/30 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50">
        <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
          {data.user.image ? (
            <Avatar className="size-9 shrink-0 ring-2 ring-primary/30">
              <AvatarImage src={data.user.image} />
            </Avatar>
          ) : (
            <GeneratedAvatar
              seed={data.user.name || "User"}
              variant="initials"
              className="size-9 shrink-0 ring-2 ring-primary/30"
            />
          )}
          <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-medium truncate w-full text-white">
              {data.user.name}
            </p>
            <p className="text-xs truncate w-full text-gray-400">
              {data.user.email}
            </p>
          </div>
        </div>
        <ChevronDownIcon className="size-4 shrink-0 text-gray-400 group-hover:text-primary transition-colors" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="right"
        className="w-72 glass-strong border border-primary/30 shadow-xl shadow-primary/20 bg-[#0a0f1a]/95"
      >
        <DropdownMenuLabel className="font-normal py-3">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-base truncate text-white">
              {data.user.name}
            </span>
            <span className="text-sm font-normal text-gray-400 truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/30" />
        <DropdownMenuItem className="cursor-pointer flex items-center justify-between py-2.5 px-3 text-white hover:bg-white/10 hover:text-primary focus:bg-white/10 focus:text-primary transition-all duration-200">
          <span>Billing</span>
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer flex items-center justify-between py-2.5 px-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 focus:bg-red-500/20 focus:text-red-300 transition-all duration-200"
        >
          <span>Logout</span>
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
