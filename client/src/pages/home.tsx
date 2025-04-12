import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/how-it-works";
import Background3D from "@/components/3d-background";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>DID System - Decentralized Identity Management</title>
        <meta name="description" content="A decentralized identity verification system using MetaMask, Ethereum, and IPFS" />
      </Helmet>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 -z-10">
          <Background3D />
        </div>
        <div className="relative z-10">
          <HeroSection />
          <HowItWorks />
        </div>
      </div>
    </>
  );
}
