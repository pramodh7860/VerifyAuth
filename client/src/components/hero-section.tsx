import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section id="home" className="mb-12">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-purple-500 text-transparent bg-clip-text">
          Decentralized Identity Management
        </h1>
        <p className="text-xl text-surface-300 max-w-3xl mx-auto mb-8">
          A blockchain-based solution for secure, private, and user-controlled digital identity verification
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            <i className="fas fa-user-plus mr-2"></i>
            Register Your Identity
          </Link>
          <Link href="/verify" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-surface-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            <i className="fas fa-search mr-2"></i>
            Verify an Identity
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-surface-800 p-6 rounded-lg border border-surface-700 hover:bg-surface-700 transition-colors">
            <div className="text-primary-500 text-3xl mb-4">
              <i className="fas fa-lock"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">Secure Authentication</h3>
            <p className="text-surface-300">Connect with MetaMask for passwordless authentication using blockchain technology</p>
          </div>
          
          <div className="bg-surface-800 p-6 rounded-lg border border-surface-700 hover:bg-surface-700 transition-colors">
            <div className="text-primary-500 text-3xl mb-4">
              <i className="fas fa-database"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">Decentralized Storage</h3>
            <p className="text-surface-300">Your identity data is securely stored on IPFS, not controlled by any central authority</p>
          </div>
          
          <div className="bg-surface-800 p-6 rounded-lg border border-surface-700 hover:bg-surface-700 transition-colors">
            <div className="text-primary-500 text-3xl mb-4">
              <i className="fas fa-user-shield"></i>
            </div>
            <h3 className="text-lg font-medium mb-2">Self-Sovereign Identity</h3>
            <p className="text-surface-300">You own and control your data, choosing what information to share and with whom</p>
          </div>
        </div>
      </div>
    </section>
  );
}
