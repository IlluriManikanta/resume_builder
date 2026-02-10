import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  // Handle the redirect flow by rendering the prebuilt component
  // This completes the OAuth authentication and creates the user if needed
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthenticateWithRedirectCallback />
      {/* Required for sign-up flows - Clerk's bot protection */}
      <div id="clerk-captcha" />
    </div>
  );
}
