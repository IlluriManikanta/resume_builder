import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "ResVamp.ai — AI-Powered Resume Builder",
  description:
    "Transform your experience into sharp, ATS-ready resumes built for modern hiring systems. AI resume analysis, scoring, and professional templates.",
};

export const viewport: Viewport = {
  themeColor: "#252422",
};

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        {clerkPubKey ? (
          <ClerkProvider
            publishableKey={clerkPubKey}
            signInForceRedirectUrl="/dashboard"
            signUpForceRedirectUrl="/dashboard"
          >
            {children}
          </ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
