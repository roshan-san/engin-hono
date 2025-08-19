import { createAuthClient } from "better-auth/react";
import { useEffect, useState } from "react";
import { env } from "../../../env";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  {
    baseURL: env.SERVER_URL,
  }
);

export const useSession = () => {
  const { data, isPending, error, refetch } = authClient.useSession();
  const [isInitialPending, setIsInitialPending] = useState(true);

  useEffect(() => {
    if (error || data || !isPending) {
      setIsInitialPending(false);
    }
  }, [data, error, isPending]);

  return {
    data,
    isInitialPending,
    isPending,
    error,
    refetch,
    isAuthenticated: !!data?.user,
  };
};

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
