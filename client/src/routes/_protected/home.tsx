import { createFileRoute } from '@tanstack/react-router';
import { CreatePostButton } from '@/features/platform/post/CreatePostButton';
import { EmergingSpotlight } from '@/features/platform/post/EmergingSpotlight';
import { Feed } from '@/features/platform/post/Feed';
import { useState } from 'react';

export const Route = createFileRoute('/_protected/home')({
  component: HomePage,
});

export default function HomePage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === '' ? null : tag);
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="max-w-6xl w-full mx-auto flex-1">
        <div className="block lg:hidden mb-6">
          <EmergingSpotlight />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-[3] w-full space-y-6">
            <Feed selectedTag={selectedTag} onTagClick={handleTagClick} />
          </div>
          <div className="hidden lg:block flex-1 max-w-sm">
            <div className="sticky top-24 space-y-6 w-full">
              <EmergingSpotlight />
            </div>
          </div>
        </div>
      </div>
      <CreatePostButton />
    </div>
  );
}
