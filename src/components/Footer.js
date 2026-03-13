import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-ocean-dark text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Column 1 */}
        <div>
          <h3 className="text-xl font-bold mb-4">🌿 WellnessMarket</h3>
          <p className="text-ocean-light text-sm">
            Bridging the gap between modern technology and holistic healing.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-bold mb-4 text-ocean-sky">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="hover:text-white cursor-pointer">Our Therapists</li>
            <li className="hover:text-white cursor-pointer">Wellness Store</li>
            <li className="hover:text-white cursor-pointer">AI Health Assistant</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="font-bold mb-4 text-ocean-sky">Contact</h4>
          <p className="text-sm text-gray-300">support@wellnessmarket.com</p>
          <p className="text-sm text-gray-300">+1 (800) 123-4567</p>
          <div className="mt-4 flex space-x-4">
            <span className="cursor-pointer hover:text-ocean-sky">Twitter</span>
            <span className="cursor-pointer hover:text-ocean-sky">LinkedIn</span>
            <span className="cursor-pointer hover:text-ocean-sky">Instagram</span>
          </div>
        </div>
      </div>

      <div className="border-t border-ocean-mid mt-8 pt-8 text-center text-sm text-gray-400">
        &copy; 2025 Wellness Marketplace. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;