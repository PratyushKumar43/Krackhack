'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isHome = pathname === '/';

  return (
    <nav className={`bg-white/30 backdrop-blur-md fixed w-full z-10 ${!isHome && 'border-b border-gray-200/20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-[#FF9F87] hover:text-[#FF7A5C] transition-colors">
            MemoVault
          </Link>
          <div className="flex gap-4">
            {!isAuthPage && (
              <>
                <Link 
                  href="/auth/login"
                  className="px-4 py-2 text-[#FF9F87] hover:text-[#FF7A5C] transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-[#FF9F87] text-white rounded-lg hover:bg-[#FF7A5C] transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
