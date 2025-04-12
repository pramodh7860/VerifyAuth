import { Link } from "wouter";
import { motion } from "framer-motion";
import ScrollAnimation from "./scroll-animation";
import FloatingIcon from "./floating-icon";

export default function HeroSection() {
  // Animation variants for the title
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for the subtitle
  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for the buttons
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="home" className="mb-20 pt-16 relative">
      {/* Background particles or elements */}
      <div className="absolute top-20 right-10 opacity-30 blur-sm">
        <FloatingIcon 
          icon={<i className="fas fa-fingerprint"></i>} 
          size="xl" 
          color="text-primary-400" 
        />
      </div>
      <div className="absolute bottom-40 left-10 opacity-20 blur-sm">
        <FloatingIcon 
          icon={<i className="fas fa-key"></i>} 
          size="lg" 
          color="text-purple-400" 
        />
      </div>

      <div className="text-center relative z-10">
        {/* Animated title */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 text-transparent bg-clip-text drop-shadow-lg">
            Decentralized Identity Management
          </h1>
        </motion.div>

        {/* Animated subtitle */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={subtitleVariants}
        >
          <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto mb-10">
            A blockchain-based solution for secure, private, and user-controlled digital identity verification
          </p>
        </motion.div>
        
        {/* Animated buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
        >
          <Link href="/register" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            <i className="fas fa-user-plus mr-2"></i>
            Register Your Identity
          </Link>
          <Link href="/verify" className="inline-flex items-center px-8 py-4 border border-cyan-500/30 text-lg font-medium rounded-md shadow-lg text-white bg-cyan-700 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors">
            <i className="fas fa-search mr-2"></i>
            Verify an Identity
          </Link>
        </motion.div>
        
        {/* Feature cards with scroll animations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <ScrollAnimation direction="up" delay={0.1} className="h-full">
            <div className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/30 hover:border-blue-400 transition-all hover:shadow-lg hover:shadow-blue-500/20 h-full transform hover:-translate-y-1">
              <div className="mb-6">
                <FloatingIcon 
                  icon={<i className="fas fa-lock"></i>} 
                  size="lg" 
                  color="text-blue-300" 
                />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Secure Authentication</h3>
              <p className="text-gray-200">Connect with MetaMask for passwordless authentication using blockchain technology</p>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation direction="up" delay={0.2} className="h-full">
            <div className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/30 hover:border-indigo-400 transition-all hover:shadow-lg hover:shadow-indigo-500/20 h-full transform hover:-translate-y-1">
              <div className="mb-6">
                <FloatingIcon 
                  icon={<i className="fas fa-database"></i>} 
                  size="lg" 
                  color="text-indigo-300" 
                />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Decentralized Storage</h3>
              <p className="text-gray-200">Your identity data is securely stored on IPFS, not controlled by any central authority</p>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation direction="up" delay={0.3} className="h-full">
            <div className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-500/20 h-full transform hover:-translate-y-1">
              <div className="mb-6">
                <FloatingIcon 
                  icon={<i className="fas fa-user-shield"></i>} 
                  size="lg" 
                  color="text-cyan-300" 
                />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Self-Sovereign Identity</h3>
              <p className="text-gray-200">You own and control your data, choosing what information to share and with whom</p>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
