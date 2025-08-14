import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import SearchProfiles from '@/features/platform/search-profiles/SearchProfiles'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TrendingUp, Lightbulb, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/_protected/network')({
  component: RouteComponent,
})

function RouteComponent() {
  const [tab, setTab] = useState('creators')
  
  return (
    <div className="min-h-screen flex flex-col p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl w-full mx-auto flex-1">
        {/* Tabs Section */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12 sm:h-14 lg:h-16 bg-background border border-border/50 shadow-sm">
            <TabsTrigger 
              value="creators" 
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              <span className="hidden sm:inline">Creators</span>
            </TabsTrigger>
            <TabsTrigger 
              value="investors" 
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              <span className="hidden sm:inline">Investors</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mentors" 
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              <span className="hidden sm:inline">Mentors</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 sm:mt-6 lg:mt-8">
            <TabsContent value="creators" className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 sm:p-6 border border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                  <h3 className="text-sm sm:text-lg font-semibold text-purple-900 dark:text-purple-100">Find Creators & Collaborators</h3>
                </div>
                <p className="text-purple-700 dark:text-purple-300 text-xs sm:text-sm">
                  Connect with talented creators, developers, designers, and potential co-founders for your startup.
                </p>
              </div>
              <SearchProfiles userType="Creator/Collaborator" />
            </TabsContent>
            
            <TabsContent value="investors" className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4 sm:p-6 border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  <h3 className="text-sm sm:text-lg font-semibold text-green-900 dark:text-green-100">Find Investors</h3>
                </div>
                <p className="text-green-700 dark:text-green-300 text-xs sm:text-sm">
                  Discover angel investors, VCs, and funding opportunities to accelerate your startup growth.
                </p>
              </div>
              <SearchProfiles userType="Investor" />
            </TabsContent>
            
            <TabsContent value="mentors" className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 sm:p-6 border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Lightbulb className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                  <h3 className="text-sm sm:text-lg font-semibold text-blue-900 dark:text-blue-100">Find Mentors</h3>
                </div>
                <p className="text-blue-700 dark:text-blue-300 text-xs sm:text-sm">
                  Connect with experienced entrepreneurs and industry experts who can guide your startup journey.
                </p>
              </div>
              <SearchProfiles userType="Mentor" />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
