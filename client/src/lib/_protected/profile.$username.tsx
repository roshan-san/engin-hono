import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { useUser } from "@/features/authentication/useUser";
import { ProfileHeader } from "@/features/platform/view-profile/components/ProfileHeader";
import { ProfileAbout } from "@/features/platform/view-profile/components/ProfileAbout";
import { ProfileSkills } from "@/features/platform/view-profile/components/ProfileSkills";
import ProfileStartups from "@/features/platform/view-profile/components/ProfileStartups";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { User, Briefcase, Building2 } from "lucide-react";
export const Route = createFileRoute("/_protected/profile/$username")({
  component: ProfilePage,
});

function ProfilePage() {
  const { username } = Route.useParams();
  const { profile: currentUser } = useUser();
  
  const profile = useQuery(api.profile.queries.getProfileByUsername, {
    username: username
  });
  
  if (profile === undefined) {
    return <FullScreenLoader />;
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
            <User className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Profile Not Found</h2>
          <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profile._id;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Decorative gradient background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/10 to-transparent blur-0" />

      <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-8 space-y-4 sm:space-y-8 relative z-10">
        {/* Profile Header */}
        <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

        {/* Content Layout - Mobile First */}
        <div className="space-y-4 sm:space-y-6">
          {/* Mobile: Stack everything vertically */}
          <div className="block lg:hidden space-y-4">
            <ProfileAbout profile={profile} />
            
            <Tabs defaultValue="startups" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 rounded-lg bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/40 border">
                <TabsTrigger 
                  value="startups" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Companies</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="skills" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Skills</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="startups" className="pt-4">
                <Card className="border bg-card/60 backdrop-blur rounded-xl shadow-sm">
                  <CardContent className="p-4">
                    <ProfileStartups profile={profile} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="pt-4">
                <Card className="border bg-card/60 backdrop-blur rounded-xl shadow-sm">
                  <CardContent className="p-4">
                    <ProfileSkills profile={profile} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop: Side-by-side layout */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProfileAbout profile={profile} />
              </div>

              <div className="lg:col-span-2">
                <Tabs defaultValue="startups" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-12 sticky top-16 z-20 rounded-lg bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/40 border">
                    <TabsTrigger 
                      value="startups" 
                      className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    >
                      <Building2 className="h-4 w-4" />
                      <span>Startups</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="skills" 
                      className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    >
                      <Briefcase className="h-4 w-4" />
                      <span>Skills & Interests</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="startups" className="pt-4">
                    <Card className="border bg-card/60 backdrop-blur rounded-xl shadow-sm">
                      <CardContent className="p-6">
                        <ProfileStartups profile={profile} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="skills" className="pt-4">
                    <Card className="border bg-card/60 backdrop-blur rounded-xl shadow-sm">
                      <CardContent className="p-6">
                        <ProfileSkills profile={profile} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
