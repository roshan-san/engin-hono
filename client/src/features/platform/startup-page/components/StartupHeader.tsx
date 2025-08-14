import { ArrowLeft, Edit, MoreVertical, Trash2 } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { Doc } from "@/../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useState } from "react";

interface StartupHeaderProps {
  startup: Doc<"startups">;
  isOwner: boolean;
}

export function StartupHeader({ startup, isOwner }: StartupHeaderProps) {
  const navigate = useNavigate();
  const deleteStartup = useMutation(api.startups.mutations.deleteStartup);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStartup({ startupId: startup._id });
      setShowDeleteDialog(false);
      // Navigate back to startups list after successful deletion
      navigate({ to: "/my-startups" });
    } catch (error) {
      console.error("Failed to delete startup:", error);
      // You might want to add toast notification here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBackClick = () => {
    // Go back in browser history, fallback to startups if no history
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/startups" });
    }
  };

  return (
    <>
      <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/80 hover:bg-muted transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                <span className="text-white font-bold text-lg sm:text-xl">
                  {startup.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                  {startup.name}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-1 line-clamp-2 sm:line-clamp-1">
                  {startup.description}
                </p>
              </div>
            </div>
            
            {isOwner && (
              <div className="flex-shrink-0 flex items-center gap-2">
                <Link to="/startup-edit/$startupid" params={{ startupid: startup._id }}>
                  <Button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:scale-105 shadow-sm">
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border-border/50 hover:bg-muted/50"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Startup
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Startup</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{startup.name}"? This action cannot be undone. 
              All associated positions and applications will also be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Startup"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 