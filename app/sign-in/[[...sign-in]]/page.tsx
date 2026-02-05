import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p>Sign-in is disabled until Clerk is configured.</p>
          <p className="mt-2 text-sm">Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in .env.local.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">Back home</Link>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
          },
        }}
      />
    </main>
  );
}
