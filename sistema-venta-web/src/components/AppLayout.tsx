"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { useStore } from '@/store/useStore';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated && pathname !== '/login') {
        router.push('/login');
      } else if (isAuthenticated && pathname === '/login') {
        router.push('/');
      }
    }
  }, [isAuthenticated, pathname, router, mounted]);

  const isLoginPage = pathname === '/login';
  const showContent = mounted && (isLoginPage || isAuthenticated);

  return (
    <>
      {/* Pantalla de carga superpuesta para evitar parpadeos mientras montamos/verificamos sesión */}
      {!showContent && (
        <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-[#0B0F19]"></div>
      )}

      {isLoginPage ? (
        <main className="relative z-10 w-full min-h-[100dvh]">{children}</main>
      ) : (
        <div className="flex h-[100dvh] flex-col md:flex-row w-full">
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative z-10 w-full pb-20 md:pb-0 custom-scrollbar">
            {children}
          </main>
        </div>
      )}
    </>
  );
}
