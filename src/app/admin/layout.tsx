'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoReorderThreeOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
// import { FaCompress } from "react-icons/fa";
import { FaExpandArrowsAlt } from "react-icons/fa";
import Cookies from 'js-cookie';
function SidebarLink(props: { href: string; label: string }): React.ReactElement {
  const pathname = usePathname();
  const isActive = pathname === props.href;
  return (
    <Link
      href={props.href}
      className={
        'block px-3 py-2 rounded transition-colors duration-200 ' + 
        (isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100')
      }
    >
      {props.label}
    </Link>
  );
}

function useAuthGuard(): void {
  const router = useRouter();
  React.useEffect(() => {
   const token = Cookies.get('authToken');
    if (!token) router.replace('/signin');
  }, [router]);
}

export default function AdminLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  useAuthGuard();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Close sidebar when clicking on overlay
  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  function handleLogout(): void {
    Cookies.remove('authToken');
    router.replace('/signin');
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Check if current route is active
  const isDashboardActive = pathname === '/admin';
  const isFormDataActive = pathname === '/admin/form-data';

  return (
    <div className="min-h-screen text-black bg-white flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      {!isSidebarCollapsed && (
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-56 border-r border-gray-200 space-y-3 bg-white
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            shadow-[4px_0_15px_-3px_rgba(0,0,0,0.1),8px_0_25px_-4px_rgba(0,0,0,0.1)]
          `}
        >
          <div className="flex items-center justify-between mb-[12px] p-[14px] border-b border-gray-200">
            <div className="text-lg text-gray-700 font-semibold">Our Portal</div>
            {/* Close button for mobile */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <Link
            href="/admin"
            className={`flex gap-2 p-2 rounded transition-colors duration-200 ${
              isDashboardActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
            title="Dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/admin/form-data"
            className={`flex gap-2 p-2 rounded transition-colors duration-200 ${
              isFormDataActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
            title="Form Data"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Form-Data
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-200"
          >
            <IoLogOutOutline className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </aside>
      )}

      {/* Collapsed Sidebar (minimal version) */}
      {isSidebarCollapsed && (
        <aside className="hidden lg:block w-16 border-r border-gray-200 space-y-3 bg-white shadow-[4px_0_15px_-3px_rgba(0,0,0,0.1),8px_0_25px_-4px_rgba(0,0,0,0.1)]">
          <div className="flex justify-center mt-[8px] pt-2 pb-3 border-b border-gray-200">
            <div className="text-lg font-semibold text-gray-500">P</div>
          </div>
          
          <div className="space-y-2">
            <Link
              href="/admin"
              className={`flex justify-center p-2 rounded transition-colors duration-200 ${
                isDashboardActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
              title="Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <Link
              href="/admin/form-data"
              className={`flex justify-center p-2 rounded transition-colors duration-200 ${
                isFormDataActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
              title="Form Data"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </Link>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex justify-center w-full p-2 rounded hover:bg-gray-100 transition-colors duration-200"
            title="Logout"
          >
            <IoLogOutOutline className="w-5 h-5" />
          </button>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="border-b border-gray-200 bg-white p-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <IoReorderThreeOutline className="w-6 h-6" />
            </button>
            
            {/* Desktop toggle button */}
            <button 
              onClick={toggleSidebar}
              className="hidden lg:flex p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <IoReorderThreeOutline className="w-6 h-6" />
            </button>
            
            {/* <h1 className="text-xl font-semibold">Admin Panel</h1> */}
          </div>
          
          {/* Logout button in toolbar */}
          {/* <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-200"
            title="Logout"
          >
            <IoLogOutOutline className="w-5 h-5" />
            <span className="hidden sm:block">Logout</span>
          </button> */}
          <FaExpandArrowsAlt className="w-8 h-8 px-2 cursor-pointer"  />
        </div>
        
        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}