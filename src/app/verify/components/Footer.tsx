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
      className="relative bottom-0 h-[350px] md:h-[250px] text-white py-8 mt-12 bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-bg.svg')" }}
    >
      {/* Blue overlay */}
      <div className="absolute inset-0 bg-blue-600/60 z-10"></div>

      {/* Main content - ABOVE everything */}
      <div className="relative z-20 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Right Side - Company Info */}
          <div className="text-center flex items-center md:items-start flex-col md:text-right">
            <p className="text-base md:text-lg font-medium">تطوير وتشغيل</p>
            <img src="wss-logo.svg" className="w-32 md:w-40 h-8 md:h-10" alt="Company Logo" />
          </div>

          {/* Center - Contact Information */}
          <div className="text-center">
            <p className="text-base md:text-lg mb-2">للإستفسار والدعم الفني</p>
            <p className="text-sm md:text-base font-bold mb-4">00966112641362</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button className='px-3 py-2 md:px-4 md:py-5 rounded-full cursor-pointer bg-white text-blue-500 text-sm md:text-base'>
                info@ha.org.sa
              </button>
            </div>
          </div>

          {/* Left Side - Social Media Icons */}
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-center space-x-3 md:space-x-4 mb-4">
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <FaFacebook className="text-blue-600 text-base md:text-lg" />
              </a>
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <FaTwitter className="text-blue-600 text-base md:text-lg" />
              </a>
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <FaInstagram className="text-blue-600 text-base md:text-lg" />
              </a>
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <FaYoutube className="text-blue-600 text-base md:text-lg" />
              </a>
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 bg-white mr-2 md:mr-3 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <FaSkype className="text-blue-600 text-base md:text-lg" />
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-center mt-4">
              <p className="text-sm md:text-lg font-semibold text-blue-100 text-center">
                يفضل استخدام متصفح جوجل كروم
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute w-full p-3 md:p-5 bottom-0 z-20 -tracking-widest bg-white text-black text-sm md:text-lg text-center">
        جميع الحقوق محفوظة الغرفة التجارية في حائل <span className='px-1 md:px-2'>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};

export default Footer;