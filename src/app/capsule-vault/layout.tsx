'use client';

import Sidebar from '@/components/layout/Sidebar';

export default function CapsuleVaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-memovault-peach/30 to-memovault-peach/20">
      <Sidebar />
      <main className="transition-all duration-300">
        <div className="pl-24 lg:pl-72 pr-6 py-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
