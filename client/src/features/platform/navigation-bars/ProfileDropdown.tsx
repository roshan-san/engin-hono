import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Building2, DollarSign, Vote, MessageSquare } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import type { Doc } from "@/../convex/_generated/dataModel";

export default function ProfileDropdown({ profile }: { profile: Doc<"profiles"> }) {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();

  if (!profile?.username) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full p-0">
          <Avatar className="h-9 w-9 border border-primary/30">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback>{profile.name?.charAt(0) ?? "?"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col items-start gap-0.5">
          <span className="font-semibold text-base leading-tight">{profile.name}</span>
          <span className="text-xs text-muted-foreground">{profile.user_type}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/profile/$username", params: { username: profile.username ?? "" } })}>
          <User className="mr-2 h-4 w-4" /> View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/my-startups" })}>
          <Building2 className="mr-2 h-4 w-4" /> My Startups
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/crowdfunding" })}>
          <DollarSign className="mr-2 h-4 w-4" /> Crowdfunding
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/vote-arena" })}>
          <Vote className="mr-2 h-4 w-4" /> Vote Arena
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/feedback" })}>
          <MessageSquare className="mr-2 h-4 w-4" /> Give Feedback
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigate({ to: "/" });
            signOut();
          }}
          className="text-red-500 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 