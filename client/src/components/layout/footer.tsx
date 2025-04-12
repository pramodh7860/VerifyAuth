import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-surface-800 border-t border-surface-700 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <i className="fas fa-fingerprint text-primary-500 text-2xl mr-2"></i>
            <span className="font-bold text-lg">DID System</span>
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com" className="text-surface-400 hover:text-white" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://twitter.com" className="text-surface-400 hover:text-white" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://discord.com" className="text-surface-400 hover:text-white" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-discord"></i>
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-surface-700 pt-8 md:flex md:items-center md:justify-between">
          <div className="text-base text-surface-400">&copy; {new Date().getFullYear()} DID System. All rights reserved.</div>
          <div className="mt-4 md:mt-0 flex flex-wrap space-x-6">
            <Link href="#" className="text-base text-surface-400 hover:text-surface-300">
              Privacy Policy
            </Link>
            <Link href="#" className="text-base text-surface-400 hover:text-surface-300">
              Terms of Service
            </Link>
            <Link href="#" className="text-base text-surface-400 hover:text-surface-300">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
