'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const menuItems = [
  {
    path: '/capsule-vault',
    label: 'Home',
    icon: '🏠'
  },
  {
    path: '/capsule-vault/dashboard',
    label: 'Dashboard',
    icon: '📊'
  },
  {
    path: '/capsule-vault/create',
    label: 'Create Capsule',
    icon: '✨'
  },
  {
    path: '/capsule-vault/profile',
    label: 'Profile',
    icon: '👤'
  }
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/capsule-vault' && pathname === '/capsule-vault') {
      return true;
    }
    return pathname.startsWith(path) && path !== '/capsule-vault';
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-white to-memovault-peach/20 backdrop-blur-sm transition-all duration-300 z-50 border-r border-memovault-salmon/10
        ${isCollapsed ? 'w-24' : 'w-72'}`}
    >
      {/* Logo Section */}
      <div className="h-24 flex items-center justify-between px-6 border-b border-memovault-salmon/10">
        {!isCollapsed && (
          <Link href="/capsule-vault" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-memovault-salmon to-memovault-salmon/80 flex items-center justify-center text-white text-xl shadow-lg">
              MV
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-memovault-salmon to-black bg-clip-text text-transparent">
              MemoVault
            </span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-10 h-10 rounded-xl border border-memovault-salmon/20 flex items-center justify-center text-memovault-salmon hover:bg-memovault-salmon hover:text-white transition-all
            ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative
                    ${active 
                      ? 'bg-gradient-to-r from-memovault-salmon to-memovault-salmon/80 text-white shadow-lg' 
                      : 'hover:bg-memovault-peach/30 text-black'
                    }
                    ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <div className={`text-xl ${!active && 'group-hover:scale-110'} transition-transform`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {isCollapsed && !active && (
                    <div className="absolute left-full ml-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-0 w-full p-6 border-t border-memovault-salmon/10 bg-white/50">
        <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-memovault-salmon to-memovault-salmon/80 flex items-center justify-center text-white text-xl shadow-lg">
            JD
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-medium text-black">John Doe</p>
              <p className="text-sm text-black/60">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
