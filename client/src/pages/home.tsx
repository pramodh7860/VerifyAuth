import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/how-it-works";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>DID System - Decentralized Identity Management</title>
        <meta name="description" content="A decentralized identity verification system using MetaMask, Ethereum, and IPFS" />
      </Helmet>
      <HeroSection />
      <HowItWorks />
    </>
  );
}
