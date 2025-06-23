import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";

export function useUserProfile() {
  const { isSignedIn, user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (isSignedIn && user && !currentUser) {
      // Create user profile if it doesn't exist
      createUser({
        name: user.firstName || user.emailAddresses[0]?.emailAddress || "User",
        email: user.emailAddresses[0]?.emailAddress || "",
        clerkId: user.id,
      });
    }
  }, [isSignedIn, user, currentUser, createUser]);

  return {
    user: currentUser,
    isLoading: isSignedIn && currentUser === undefined,
    isSignedIn,
  };
} 