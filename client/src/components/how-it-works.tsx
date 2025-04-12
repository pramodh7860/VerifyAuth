export default function HowItWorks() {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
      
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-surface-700 z-0 hidden md:block"></div>
          
          {/* Steps */}
          <div className="space-y-12 relative z-10">
            {/* Step 1 */}
            <div className="md:flex items-center">
              <div className="md:w-1/2 md:pr-12 mb-4 md:mb-0 md:text-right">
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-surface-300">Link your MetaMask wallet to establish your digital identity with your Ethereum address.</p>
              </div>
              <div className="md:w-1/2 flex justify-start">
                <div className="bg-surface-700 rounded-full p-4 flex items-center justify-center w-16 h-16 border-4 border-surface-800">
                  <i className="fas fa-wallet text-primary-500 text-xl"></i>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="md:flex items-center">
              <div className="md:w-1/2 md:text-right md:order-2 md:pl-12 mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">Register Your Information</h3>
                <p className="text-surface-300">Fill out and submit your personal details in the registration form.</p>
              </div>
              <div className="md:w-1/2 flex md:justify-end md:order-1">
                <div className="bg-surface-700 rounded-full p-4 flex items-center justify-center w-16 h-16 border-4 border-surface-800">
                  <i className="fas fa-id-card text-primary-500 text-xl"></i>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="md:flex items-center">
              <div className="md:w-1/2 md:pr-12 mb-4 md:mb-0 md:text-right">
                <h3 className="text-xl font-semibold mb-2">Blockchain Authentication</h3>
                <p className="text-surface-300">Your data is encrypted and stored securely on IPFS with a unique Content Identifier (CID).</p>
              </div>
              <div className="md:w-1/2 flex justify-start">
                <div className="bg-surface-700 rounded-full p-4 flex items-center justify-center w-16 h-16 border-4 border-surface-800">
                  <i className="fas fa-database text-primary-500 text-xl"></i>
                </div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="md:flex items-center">
              <div className="md:w-1/2 md:text-right md:order-2 md:pl-12 mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">CID Linked to Your Address</h3>
                <p className="text-surface-300">The CID is stored in a smart contract linked to your Ethereum wallet address.</p>
              </div>
              <div className="md:w-1/2 flex md:justify-end md:order-1">
                <div className="bg-surface-700 rounded-full p-4 flex items-center justify-center w-16 h-16 border-4 border-surface-800">
                  <i className="fas fa-link text-primary-500 text-xl"></i>
                </div>
              </div>
            </div>
            
            {/* Step 5 */}
            <div className="md:flex items-center">
              <div className="md:w-1/2 md:pr-12 md:text-right">
                <h3 className="text-xl font-semibold mb-2">Verification Process</h3>
                <p className="text-surface-300">Anyone can verify your identity by entering your Ethereum address to retrieve your data.</p>
              </div>
              <div className="md:w-1/2 flex justify-start">
                <div className="bg-surface-700 rounded-full p-4 flex items-center justify-center w-16 h-16 border-4 border-surface-800">
                  <i className="fas fa-search text-primary-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
