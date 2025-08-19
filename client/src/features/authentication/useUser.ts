import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';

const fetchUser = async () => {
    const session = await authClient.getSession();
    return session;
};
  
export default function useUser() {
      const { data: user, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
          staleTime: 1000 * 60 * 15, // Cache for 15 minutes
    });

      return { user, isLoading };
}