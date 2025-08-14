import React, { createContext } from "react";
import type { Doc } from "@/../convex/_generated/dataModel";

type UserContextType = {
  profile: Doc<"profiles">;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export { UserContext };

export const UserProvider = ({ 
  children, 
  profile 
}: { 
  children: React.ReactNode;
  profile: Doc<"profiles">;
}) => {
  return (
    <UserContext.Provider value={{ profile }}>{children}</UserContext.Provider>
  );
};
