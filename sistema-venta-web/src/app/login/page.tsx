"use client";

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Store, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simular tiempo de carga para el login
    setTimeout(() => {
      login();
    }, 800);
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-[#0B0F19]">
      {/* Background Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" 
      />

      <div className="w-full max-w-md px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
          className="glass-panel p-8 sm:p-10 rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-2xl shadow-indigo-500/10"
        >
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-[1.25rem] overflow-hidden mb-6 shadow-2xl shadow-indigo-500/20">
              <img src="/logo.jpg" alt="KlikZapatos" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Klik<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Zapatos</span>
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Panel de Administración</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">Usuario</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting || !username || !password}
              className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/25 flex justify-center items-center group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Ingresar <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </motion.button>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Tip: Usa cualquier usuario y contraseña para entrar al demo.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
