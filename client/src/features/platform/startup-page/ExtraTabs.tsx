import { Card, CardContent } from "@/components/ui/card";

import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { PositionsList } from "../positions/PositionsList";
import { CollaboratorsList } from "../collabs/CollaboratorsList";
import { Briefcase, Users } from "lucide-react";
import type { Doc } from "@/../convex/_generated/dataModel.d.ts";

export function ExtraTabs({ startup, isOwner }: { startup: Doc<"startups">, isOwner: boolean }) {
    return (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground px-1">
            Team & Opportunities
          </h2>
          
          <Tabs defaultValue="collaborators" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14">
              <TabsTrigger value="collaborators" className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5" />
                <span className="hidden sm:inline">Collaborators</span>
                <span className="sm:hidden">Team</span>
              </TabsTrigger>
              <TabsTrigger value="positions" className="flex items-center gap-2 text-base">
                <Briefcase className="h-5 w-5" />
                <span className="hidden sm:inline">Open Positions</span>
                <span className="sm:hidden">Jobs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collaborators" className="pt-4">
              <Card className="bg-card rounded-2xl border shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <CollaboratorsList startupId={startup._id} isOwner={isOwner} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="positions" className="pt-4">
              <Card className="bg-card rounded-2xl border shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <PositionsList startupId={startup._id} isOwner={isOwner} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    )
}