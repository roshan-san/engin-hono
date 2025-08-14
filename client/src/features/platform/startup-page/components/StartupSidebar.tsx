import { Card, CardContent } from "../../../../components/ui/card";
import { Globe, Mail, TrendingUp, Calendar, Users, DollarSign, ThumbsUp } from "lucide-react";
import type { Doc } from "@/../convex/_generated/dataModel";

interface StartupSidebarProps {
  startup: Doc<"startups">;
}

export function StartupSidebar({ startup }: StartupSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics Section */}
      <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Key Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Stage
              </span>
              <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                {startup.stage || "MVP"}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Founded
              </span>
              <span className="text-sm font-medium">
                {startup.createdAt ? new Date(startup.createdAt).getFullYear() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Size
              </span>
              <span className="text-sm font-medium">{startup.team_size}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Funding
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                ${startup.funding?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                Upvotes
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {startup.upvotes?.length || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Section */}
      <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Contact
          </h3>
          <div className="space-y-4">
            {startup.website && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <a 
                  href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline truncate"
                >
                  {startup.website}
                </a>
              </div>
            )}
            {startup.email && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <a 
                  href={`mailto:${startup.email}`}
                  className="text-sm text-primary hover:underline truncate"
                >
                  {startup.email}
                </a>
              </div>
            )}

            {!startup.website && !startup.email && (
              <div className="text-center py-6">
                <Mail className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No contact information available.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 