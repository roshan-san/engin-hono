import { Link } from "@tanstack/react-router";
import { useUser } from "@/features/authentication/useUser";
import ProfileDropdown from "./ProfileDropdown";
import { Search, Users, MessageCircle, Home } from "lucide-react";
import NotificationsDrawer from "../make-connections/NotificationDrawer";
import { ModeToggle } from "@/components/ModeToggle";

export function TopBar() {
  const { profile } = useUser();
  
  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-background border-b">
      {/* Logo/Title */}
      <div className="text-xl sm:text-2xl font-bold text-primary tracking-wider uppercase select-none">
        ENGIN
      </div>
      
      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-6">
        <Link 
          to="/home" 
          activeProps={{
            className: "text-base font-medium text-primary transition-colors flex items-center gap-1 px-3 py-2 rounded-md bg-primary/10"
          }}
          inactiveProps={{
            className: "text-base font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-3 py-2 rounded-md hover:bg-muted/50"
          }}
        >
          <Home className="h-5 w-5" /> Home
        </Link>
        <Link 
          to="/startups" 
          activeProps={{
            className: "text-base font-medium text-primary transition-colors flex items-center gap-1 px-3 py-2 rounded-md bg-primary/10"
          }}
          inactiveProps={{
            className: "text-base font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-3 py-2 rounded-md hover:bg-muted/50"
          }}
        >
          <Search className="h-5 w-5" /> Explore
        </Link>
        <Link 
          to="/message" 
          activeProps={{
            className: "text-base font-medium text-primary transition-colors flex items-center gap-1 px-3 py-2 rounded-md bg-primary/10"
          }}
          inactiveProps={{
            className: "text-base font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-3 py-2 rounded-md hover:bg-muted/50"
          }}
        >
          <MessageCircle className="h-5 w-5" /> Messages
        </Link>
        <Link 
          to="/network" 
          activeProps={{
            className: "text-base font-medium text-primary transition-colors flex items-center gap-1 px-3 py-2 rounded-md bg-primary/10"
          }}
          inactiveProps={{
            className: "text-base font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-3 py-2 rounded-md hover:bg-muted/50"
          }}
        >
          <Users className="h-5 w-5" /> Network
        </Link>
      </nav>
      
      {/* Right Side: Profile & Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        <NotificationsDrawer />
        <ModeToggle/>
        {profile.username && <ProfileDropdown profile={profile} />}
      </div>
    </header>
  );
} 