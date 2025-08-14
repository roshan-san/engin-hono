import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Calendar, Eye, Edit } from "lucide-react";
import type { Id, Doc } from "@/../convex/_generated/dataModel";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ApplyToPosition } from "../../positions/ApplyToPosition";
import { ApplicationsList } from "../../collabs/ApplicationsList";
import { EditPositionForm } from "../../positions/EditPositionForm";
import { useUser } from "../../../authentication/useUser";

interface StartupPositionsProps {
  startupId: Id<"startups">;
  onAddPosition: () => void;
  isOwner: boolean;
}

export function StartupPositions({ startupId, onAddPosition, isOwner }: StartupPositionsProps) {
  const positions = useQuery(api.startups.queries.listPositions, { startupId: startupId });
  const { profile } = useUser();
  const [selectedPosition, setSelectedPosition] = useState<Doc<"positions"> | null>(null);
  const [isViewApplicationsOpen, setIsViewApplicationsOpen] = useState(false);
  const [isEditPositionOpen, setIsEditPositionOpen] = useState(false);

  const handleViewApplications = (position: Doc<"positions">) => {
    setSelectedPosition(position);
    setIsViewApplicationsOpen(true);
  };

  const handleEditPosition = (position: Doc<"positions">) => {
    setSelectedPosition(position);
    setIsEditPositionOpen(true);
  };

  const handleApplicationSuccess = () => {
    // Refresh the positions list or handle success
  };

  const handleEditSuccess = () => {
    setIsEditPositionOpen(false);
    setSelectedPosition(null);
  };

  if (!positions || positions.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No positions yet</h3>
        <p className="text-muted-foreground mb-4">
          Start building your team by creating open positions
        </p>
        {isOwner && (
          <Button onClick={onAddPosition} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Position
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Open Positions</h3>
        {isOwner && (
          <Button onClick={onAddPosition} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Position
          </Button>
        )}
      </div>
      
      <div className="grid gap-4">
        {positions.map((position) => (
          <Card key={position._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{position.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {position.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(position.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {position.description}
              </p>
              
              {position.requirements && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                  <p className="text-sm text-muted-foreground">
                    {position.requirements}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                {isOwner ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewApplications(position)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Applications
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditPosition(position)}>
                      <Edit className="h-4 w-4" />
                      Edit Position
                    </Button>
                  </>
                ) : (
                  profile && (
                    <ApplyToPosition
                      positionId={position._id}
                      applicantId={profile._id}
                      onSuccess={handleApplicationSuccess}
                    />
                  )
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Applications Dialog */}
      {selectedPosition && (
        <Dialog open={isViewApplicationsOpen} onOpenChange={setIsViewApplicationsOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Applications for {selectedPosition.title}</DialogTitle>
              <DialogDescription>
                Review and manage applications for this position.
              </DialogDescription>
            </DialogHeader>
            <ApplicationsList positionId={selectedPosition._id} />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Position Dialog */}
      {selectedPosition && (
        <Dialog open={isEditPositionOpen} onOpenChange={setIsEditPositionOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Position: {selectedPosition.title}</DialogTitle>
              <DialogDescription>
                Modify the details of this position.
              </DialogDescription>
            </DialogHeader>
            <EditPositionForm position={selectedPosition} onSuccess={handleEditSuccess} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 