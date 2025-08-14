import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id, Doc } from "@/../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Plus, Users, Eye } from "lucide-react";
import { ApplicationsList } from "../collabs/ApplicationsList";
import { ApplyToPosition } from "./ApplyToPosition";
import { useUser } from "../../authentication/useUser";
import { PositionForm } from "./PositionForm";

interface PositionsListProps {
  startupId: Id<"startups">;
  isOwner: boolean;
}

export const PositionsList: React.FC<PositionsListProps> = ({ startupId, isOwner }) => {
  const positions = useQuery(api.startups.queries.listPositions, { startupId });
  const { profile } = useUser();
  const [selectedPosition, setSelectedPosition] = useState<Doc<"positions"> | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewApplicationsOpen, setIsViewApplicationsOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800/50";
      case "closed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800/50";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800/50";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">Open Positions</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Find your next opportunity</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isOwner && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 h-9 sm:h-10">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Create Position</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Position</DialogTitle>
                  <DialogDescription>
                    Add a new position to attract talent to your startup.
                  </DialogDescription>
                </DialogHeader>
                <PositionForm 
                  startupId={startupId} 
                  onSuccess={() => setIsCreateDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          )}
          
          <Badge variant="secondary" className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium w-fit">
            {positions?.length || 0} position{(positions?.length || 0) !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Positions List */}
      <div className="space-y-3">
        {!positions || positions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
              <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/50" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-foreground pt-4">No positions available</h4>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm sm:max-w-md mx-auto px-4 pt-2">
              {isOwner 
                ? "Create your first position to start building your team." 
                : "Check back later for new opportunities."
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {positions.map((position: Doc<"positions">) => (
              <Card key={position._id} className="group border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Position Info */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {position.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs px-2 py-0.5 border ${getStatusColor(position.status)}`}
                          >
                            {position.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {position.description}
                      </p>
                      
                      {/* Position Details */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {position.requirements && (
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                            <span className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">
                              {position.requirements}
                            </span>
                    </div>
                  )}
                </div>
              </div>
              
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      {isOwner ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPosition(position);
                              setIsViewApplicationsOpen(true);
                            }}
                            className="gap-2 h-9 sm:h-10"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">View Apps</span>
                          </Button>
                        </>
                      ) : (
                        profile && (
                  <ApplyToPosition
                            positionId={position._id}
                    applicantId={profile._id}
                    onSuccess={() => {}}
                  />
                        )
                )}
              </div>
            </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Dialogs */}
      {selectedPosition && (
        <>
          {/* View Applications Dialog */}
          <Dialog open={isViewApplicationsOpen} onOpenChange={setIsViewApplicationsOpen}>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Applications for {selectedPosition.title}</DialogTitle>
                <DialogDescription>
                  Review applications for this position.
                </DialogDescription>
              </DialogHeader>
              <ApplicationsList positionId={selectedPosition._id} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}; 