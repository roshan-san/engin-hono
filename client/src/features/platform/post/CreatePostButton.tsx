import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function CreatePostButton() {
  return (
    <Link to="/create-post">
      <Button
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 rounded-full w-14 h-14 md:w-16 md:h-16 shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90 text-white border-0 hover:scale-105 active:scale-95"
        variant="default"
        size="icon"
        aria-label="Create post"
      >
        <Plus className="w-6 h-6 md:w-7 md:h-7" />
      </Button>
    </Link>
  );
} 