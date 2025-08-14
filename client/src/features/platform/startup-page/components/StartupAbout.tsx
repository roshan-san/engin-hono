import { Card, CardContent } from "../../../../components/ui/card";
import { Info, Target, Sparkles } from "lucide-react";
import type { Doc } from "@/../convex/_generated/dataModel";

interface StartupAboutProps {
  startup: Doc<"startups">;
  isOwner: boolean;
}

export function StartupAbout({ startup, isOwner }: StartupAboutProps) {
  return (
    <div className="space-y-8">
      {/* About Section */}
      <div className="space-y-4">
        <h2 className="text-xl lg:text-2xl font-semibold text-foreground flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          About {startup.name}
        </h2>
        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm">
          <CardContent className="p-6 lg:p-8">
            <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
              {startup.description}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Problem & Solution Section */}
      <div className="space-y-4">
        <h2 className="text-xl lg:text-2xl font-semibold text-foreground">Problem & Solution</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                Problem
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                {startup.problem}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                Solution
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                {startup.solution}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="space-y-4">
        <h2 className="text-xl lg:text-2xl font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Key Features
        </h2>
        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm">
          <CardContent className="p-6 lg:p-8">
            {startup.tags && startup.tags.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {startup.tags?.map((tag: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-muted-foreground font-medium">{tag}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-base">
                  No key features listed yet. {isOwner && "Add some features to showcase your startup's capabilities."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 