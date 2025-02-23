'use client';

import Sidebar from '@/components/layout/Sidebar';

export default function CapsuleVaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-memovault-peach">
      <Sidebar />
      <div className="pl-20 lg:pl-64">
        {children}
      </div>
    </div>
  );
}
