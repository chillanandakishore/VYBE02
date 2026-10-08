import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { AIVisualization3D } from "@/components/3d/ai-visualization-3d";
import { VybePreview } from "@/components/landing/vybe-preview";
import { CreatorSpotlight } from "@/components/landing/creator-spotlight";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-violet-600 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <AIVisualization3D />
        <VybePreview />
        <CreatorSpotlight />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
