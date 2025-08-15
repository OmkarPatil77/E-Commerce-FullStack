import React from "react";
import { Github, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-400 text-sm">
              This is Omkar's project showcasing products and tech. Explore and enjoy the best deals!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="/" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/" className="hover:text-white transition-colors">About</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Me</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://github.com/OmkarPatil77"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                <Github size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/omkar-patil-ab5a89338"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://www.instagram.com/omkarpatil__23_"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                <Instagram size={24} />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Made with ❤️ by Omkar | All Rights Reserved
            </p>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Omkar. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
