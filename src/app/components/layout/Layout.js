// components/Layout.js
"use client"
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const Layout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {pathname !== '/' &&(
              <aside className="w-64 bg-gray-800 text-white fixed h-full">
              <div className="p-6 text-2xl font-bold">HYPER STAR</div>
              <nav className="mt-10">
                <Link href="/users" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700">
                  <svg className="w-6 h-6 mr-3" /* Insert Users Icon */></svg>
                  Users
                </Link>
                <Link href="/posts" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700">
                  <svg className="w-6 h-6 mr-3" /* Insert Posts Icon */></svg>
                  Posts
                </Link>
                <Link href="/users/edit" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700">
                  <svg className="w-6 h-6 mr-3" /* Insert Add User Icon */></svg>
                  Add User
                </Link>
              </nav>
              <button
                onClick={handleLogout}
                className="absolute bottom-6 left-6 px-4 py-2 text-gray-300 hover:bg-gray-700"
              >
                Logout
              </button>
            </aside>
      )}

      {/* Main Content Area */}
      <div className="right p-10 ml-64 h-full w-full">{children}</div>
    </div>
  );
};

export default Layout;
