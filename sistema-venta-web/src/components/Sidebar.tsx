"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, ShoppingCart, LogOut, Store, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { logout } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Artículos', href: '/articulos', icon: Package },
    { name: 'Ventas', href: '/ventas', icon: ShoppingCart },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 glass-panel border-r border-gray-200 dark:border-white/[0.05] flex-col h-screen sticky top-0 left-0 z-50">
        {/* Logo */}
        <div className="h-24 flex items-center px-8 border-b border-gray-200 dark:border-white/[0.05]">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden mr-4 shadow-lg shadow-indigo-500/20 shrink-0">
            <img src="/logo.jpg" alt="KlikZapatos" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Klik<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Zapatos</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'text-indigo-700 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabDesktop" 
                    className="absolute inset-0 bg-indigo-100 dark:bg-transparent dark:bg-gradient-to-r dark:from-indigo-500/20 dark:to-purple-500/20 rounded-xl border border-indigo-200 dark:border-indigo-500/30"
                    transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 mr-4 relative z-10 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-gray-300'}`} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Tools */}
        <div className="p-6 border-t border-gray-200 dark:border-white/[0.05] space-y-4">
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors w-full"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 mr-4 text-amber-400" /> : <Moon className="w-5 h-5 mr-4 text-indigo-500" />}
              {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            </button>
          )}
          <button onClick={() => logout()} className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors w-full group">
            <LogOut className="w-5 h-5 mr-4 text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-gray-200 dark:border-white/[0.05] flex justify-around items-center p-3 z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
                isActive ? 'text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTabMobile" 
                  className="absolute inset-0 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl"
                  transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-6 h-6 relative z-10" />
              <span className="text-[10px] font-medium mt-1 relative z-10">{item.name}</span>
            </Link>
          );
        })}
        {/* Mobile Theme Toggle */}
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative flex flex-col items-center justify-center p-2 text-gray-500 dark:text-gray-400 rounded-xl"
          >
            {theme === 'dark' ? <Sun className="w-6 h-6 text-amber-400" /> : <Moon className="w-6 h-6 text-indigo-500" />}
            <span className="text-[10px] font-medium mt-1">Tema</span>
          </button>
        )}
      </nav>
    </>
  );
}
