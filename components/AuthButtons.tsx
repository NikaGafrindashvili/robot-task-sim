"use client";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";

export function AuthButtons() {
  const { isSignedIn, user } = useUser();
  const { user: userProfile, isLoading } = useUserProfile();

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button variant="outline">Sign In</Button>
      </SignInButton>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">
          {user?.firstName || user?.emailAddresses[0]?.emailAddress}
        </div>
      </div>
      <SignOutButton>
        <Button variant="outline" size="sm">Sign Out</Button>
      </SignOutButton>
    </div>
  );
} 