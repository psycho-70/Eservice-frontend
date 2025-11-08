import React from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaSkype,
  FaChrome,
} from 'react-icons/fa';
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
} from 'react-icons/si';

const Footer = () => {
  return (
    <footer
      className="relative bottom-0 text-white py-8 mt-12 bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-bg.svg')" }}
    >
      {/* Blue overlay */}
      <div className="absolute inset-0 bg-blue-600/60 z-10"></div>

      {/* Main content - ABOVE everything */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Right Side - Company Info */}
          <div className="text-center flex items-center md:items-start flex-col md:text-right">
            <p className="text-sm font-medium">تطوير وتشغيل</p>
           <img src="wss-logo.svg" className="w-40 text-white h-10" alt="Company Logo" /></div> 
        

          {/* Center - Contact Information */}
          <div className="text-center">
            <p className="text-sm mb-2">للإستفسار والدعم الفني</p>
            <p className="text-xl font-bold mb-4">00966112641362</p>
            <div className="flex justify-center space-x-4 mt-4">
              <SiVisa className="text-2xl" />
              <SiMastercard className="text-2xl" />
              <SiAmericanexpress className="text-2xl" />
            </div>
          </div>

          {/* Left Side - Social Media Icons */}
          <div className="text-center md:text-left">
            <p className="text-sm text-center mb-4">
              تابعنا على وسائل التواصل الاجتماعي
            </p>
            <div className="flex justify-center md:justify-center space-x-4 mb-4">
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <FaFacebook className="text-blue-600 text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <FaTwitter className="text-blue-600 text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <FaInstagram className="text-blue-600 text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <FaYoutube className="text-blue-600 text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white mr-3 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <FaSkype className="text-blue-600 text-lg" />
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-center mt-4">
              <FaChrome className="text-yellow-400 mr-2" />
              <p className="text-sm text-blue-100">
                يفضل استخدام متصفح جوجل كروم
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
