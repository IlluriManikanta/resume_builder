import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { ValueProps } from "@/components/landing/value-props";
import { ResumeAnalysis } from "@/components/landing/resume-analysis";
import { UploadScore } from "@/components/landing/upload-score";
import { SocialProof } from "@/components/landing/social-proof";
import { Templates } from "@/components/landing/templates";
import { FeatureBar } from "@/components/landing/feature-bar";
import { Pricing } from "@/components/landing/pricing";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ValueProps />
      <ResumeAnalysis />
      <UploadScore />
      <SocialProof />
      <Templates />
      <FeatureBar />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
