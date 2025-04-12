import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollAnimation from "./scroll-animation";
import FloatingIcon from "./floating-icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faWallet, 
  faIdCard, 
  faDatabase, 
  faLink, 
  faSearch, 
  faShieldAlt,
  faFingerprint,
  faLock,
  faExchangeAlt
} from "@fortawesome/free-solid-svg-icons";

export default function HowItWorks() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create parallax effect using scroll progress
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Create a staggered animation for steps
  const stepsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 mb-16 relative" ref={containerRef}>
      {/* Decorative elements with parallax effect */}
      <motion.div 
        className="absolute -top-10 -right-10 opacity-10 pointer-events-none"
        style={{ y: y1 }}
      >
        <div className="w-64 h-64 rounded-full bg-primary-500/30 blur-3xl"></div>
      </motion.div>
      
      <motion.div 
        className="absolute -bottom-20 -left-10 opacity-10 pointer-events-none"
        style={{ y: y2 }}
      >
        <div className="w-72 h-72 rounded-full bg-purple-500/30 blur-3xl"></div>
      </motion.div>
      
      <ScrollAnimation direction="down" className="mb-16 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 text-transparent bg-clip-text">
          How It Works
        </h2>
        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
          Our decentralized identity system combines blockchain security with user control
        </p>
      </ScrollAnimation>
      
      <div className="max-w-5xl mx-auto">
        <div className="relative">
          {/* Animated Connection Line */}
          <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-surface-700/50 z-0 hidden md:block rounded-full overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-primary-500 to-purple-500"
              style={{ 
                scaleY: scrollYProgress,
                transformOrigin: "top" 
              }}
            />
          </div>
          
          {/* Steps */}
          <motion.div 
            className="space-y-24 sm:space-y-36 relative z-10"
            variants={stepsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Step 1 */}
            <motion.div className="md:flex items-center" variants={stepVariants}>
              <div className="md:w-1/2 md:pr-12 mb-4 md:mb-0 md:text-right">
                <h3 className="text-2xl font-semibold mb-3 text-blue-300">Connect Your Wallet</h3>
                <p className="text-gray-200 text-lg">Link your MetaMask wallet to establish your digital identity with your Ethereum address.</p>
              </div>
              <div className="md:w-1/2 flex justify-start">
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-full p-6 flex items-center justify-center w-24 h-24 border-2 border-blue-500/30 shadow-lg shadow-blue-500/20">
                  <FloatingIcon 
                    icon={<FontAwesomeIcon icon={faWallet} size="2x" />} 
                    size="lg" 
                    color="text-blue-300" 
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div className="md:flex items-center" variants={stepVariants}>
              <div className="md:w-1/2 md:text-right md:order-2 md:pl-12 mb-4 md:mb-0">
                <h3 className="text-2xl font-semibold mb-3 text-indigo-300">Register Your Information</h3>
                <p className="text-gray-200 text-lg">Fill out and submit your personal details in the registration form. Your data remains private and secure.</p>
              </div>
              <div className="md:w-1/2 flex md:justify-end md:order-1">
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-full p-6 flex items-center justify-center w-24 h-24 border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/20">
                  <FloatingIcon 
                    icon={<FontAwesomeIcon icon={faIdCard} size="2x" />} 
                    size="lg" 
                    color="text-indigo-300" 
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div className="md:flex items-center" variants={stepVariants}>
              <div className="md:w-1/2 md:pr-12 mb-4 md:mb-0 md:text-right">
                <h3 className="text-2xl font-semibold mb-3 text-cyan-300">Blockchain Authentication</h3>
                <p className="text-gray-200 text-lg">Your data is encrypted and stored securely on IPFS with a unique Content Identifier (CID).</p>
              </div>
              <div className="md:w-1/2 flex justify-start">
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-full p-6 flex items-center justify-center w-24 h-24 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                  <FloatingIcon 
                    icon={<FontAwesomeIcon icon={faDatabase} size="2x" />} 
                    size="lg" 
                    color="text-cyan-300" 
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Step 4 */}
            <motion.div className="md:flex items-center" variants={stepVariants}>
              <div className="md:w-1/2 md:text-right md:order-2 md:pl-12 mb-4 md:mb-0">
                <h3 className="text-2xl font-semibold mb-3 text-blue-300">CID Linked to Your Address</h3>
                <p className="text-gray-200 text-lg">The CID is stored in a smart contract linked to your Ethereum wallet address, creating a verifiable connection.</p>
              </div>
              <div className="md:w-1/2 flex md:justify-end md:order-1">
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-full p-6 flex items-center justify-center w-24 h-24 border-2 border-blue-500/30 shadow-lg shadow-blue-500/20">
                  <FloatingIcon 
                    icon={<FontAwesomeIcon icon={faLink} size="2x" />} 
                    size="lg" 
                    color="text-blue-300" 
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Step 5 */}
            <motion.div className="md:flex items-center" variants={stepVariants}>
              <div className="md:w-1/2 md:pr-12 md:text-right">
                <h3 className="text-2xl font-semibold mb-3 text-indigo-300">Verification Process</h3>
                <p className="text-gray-200 text-lg">Anyone can verify your identity by entering your Ethereum address to retrieve your data from the blockchain.</p>
              </div>
              <div className="md:w-1/2 flex justify-start">
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-full p-6 flex items-center justify-center w-24 h-24 border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/20">
                  <FloatingIcon 
                    icon={<FontAwesomeIcon icon={faSearch} size="2x" />} 
                    size="lg" 
                    color="text-indigo-300" 
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Final call to action */}
      <ScrollAnimation direction="up" className="mt-24 text-center">
        <div className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20 max-w-3xl mx-auto shadow-lg shadow-blue-500/10">
          <h3 className="text-2xl font-bold mb-4 text-white">Ready to get started?</h3>
          <p className="text-gray-200 mb-6">
            Join our decentralized identity management platform today and take control of your digital identity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/register" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-md">
              Register Now
            </a>
            <a href="/verify" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors shadow-md">
              Verify an Identity
            </a>
          </div>
        </div>
      </ScrollAnimation>
    </section>
  );
}
