import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Doc } from "@/../convex/_generated/dataModel";
import { Github, Linkedin, ExternalLink, User, MapPin, Briefcase, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ProfileAboutProps {
  profile: Doc<"profiles">;
}

interface SocialLink {
  icon: LucideIcon;
  label: string;
  url: string | null;
}

function SocialLinkButton({ icon: Icon, label, url }: SocialLink) {
  if (!url) return null;

  return (
    <Button variant="outline" className="w-full justify-start group h-10" asChild>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center"
      >
        <Icon className="w-4 h-4 mr-2" />
        <span className="flex-1 text-left">{label}</span>
        <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    </Button>
  );
}

export function ProfileAbout({ profile }: ProfileAboutProps) {
  const socialLinks: SocialLink[] = [
    { icon: Github, label: "GitHub", url: profile.github_url ?? null },
    { icon: Linkedin, label: "LinkedIn", url: profile.linkedin_url ?? null },
  ];

  const hasSocialLinks = socialLinks.some(link => link.url);
  const hasContactInfo = profile.email || profile.location || profile.work_type || profile.user_type;

  return (
    <div className="space-y-4">
      {/* About Section - Only show if there's meaningful content */}
      {hasContactInfo && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 rounded-xl overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">About</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-3">
            {/* Profile Info in a cleaner grid layout */}
            <div className="grid gap-3">
              {profile.email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Email</p>
                    <p className="text-sm text-foreground truncate">{profile.email}</p>
                  </div>
                </div>
              )}
              
              {profile.location && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Location</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{profile.location}</p>
                  </div>
                </div>
              )}
              
              {profile.work_type && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Work Type</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">{profile.work_type}</p>
                  </div>
                </div>
              )}
              
              {profile.user_type && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <User className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">User Type</p>
                    <p className="text-sm text-green-700 dark:text-green-300">{profile.user_type}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Links - Only show if they exist */}
      {hasSocialLinks && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 rounded-xl overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ExternalLink className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">Social Links</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="grid gap-2">
              {socialLinks.map((link) => (
                <SocialLinkButton key={link.label} {...link} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
