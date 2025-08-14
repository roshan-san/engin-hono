import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Doc } from "@/../convex/_generated/dataModel";
import { Target, Code, Lightbulb } from "lucide-react";

export function ProfileSkills({ profile }: { profile: Doc<"profiles"> }) {
  const hasInterests = profile.interests && profile.interests.length > 0;
  const hasSkills = profile.skills && profile.skills.length > 0;

  return (
    <div className="space-y-4">
      {/* Technical Skills */}
      {hasSkills && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 rounded-xl overflow-hidden">
          <CardHeader className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">Technical Skills</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="secondary" 
                        className="text-xs sm:text-sm px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/20 text-primary border border-primary/20 hover:bg-primary/30 transition-colors"
                      >
                        {skill}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Technical expertise</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Areas of Interest */}
      {hasInterests && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 rounded-xl overflow-hidden">
          <CardHeader className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">Areas of Interest</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-wrap gap-2">
              {profile.interests?.map((interest, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className="text-xs sm:text-sm px-3 py-1.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        {interest}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Area of expertise</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!hasSkills && !hasInterests && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 rounded-xl overflow-hidden">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
              <Lightbulb className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/50" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-foreground pt-4">No skills or interests listed</h4>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm sm:max-w-md mx-auto px-4 pt-2">
              Add your technical skills and areas of interest to showcase your expertise.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
