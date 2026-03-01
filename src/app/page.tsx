import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "PitchAgent Pro | AI-Powered Hyper-Personalized Cold Outreach",
  description: "Deploy 4 specialized AI agents to research your targets and craft high-conversion, hyper-personalized pitches in under 3 minutes.",
  openGraph: {
    title: "PitchAgent Pro - Close $10k Clients with AI-Crafted Pitches",
    description: "4 specialized AI agents analyze your target client and write a pitch that actually converts. Try it free.",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return <HomeClient />;
}
