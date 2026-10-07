"use client";

import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { ShoppingCart, Users, DollarSign, Package, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { ventas, articulos, clientes } = useStore();

  const chartData = useMemo(() => {
    const ventasPorDia = ventas.reduce((acc, venta) => {
      const date = new Date(venta.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      if (!acc[date]) {
        acc[date] = { fecha: date, total: 0, cantidad: 0 };
      }
      acc[date].total += venta.total;
      acc[date].cantidad += 1;
      return acc;
    }, {} as Record<string, { fecha: string, total: number, cantidad: number }>);
    return Object.values(ventasPorDia).reverse();
  }, [ventas]);

  const totalIngresos = ventas.reduce((sum, v) => sum + v.total, 0);
  const stockTotal = articulos.reduce((sum, a) => sum + a.stock_actual, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 sm:space-y-10">

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
            Panel de Control
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Resumen de actividad y métricas clave.</p>
        </div>
        <div className="flex items-center space-x-4 sm:space-x-5 self-end sm:self-auto">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Brian</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400">Administrador Pro</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500">
            <img src="https://ui-avatars.com/api/?name=Brian&background=random&color=fff" alt="User" className="w-full h-full rounded-full border-2 border-white dark:border-[#0B0F19]" />
          </div>
        </div>
      </motion.header>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <StatCard title="Ingresos Totales" value={`$${totalIngresos.toFixed(2)}`} icon={<DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />} trend="+12.5%" />
        <StatCard title="Ventas Realizadas" value={ventas.length.toString()} icon={<ShoppingCart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />} trend="+5.2%" />
        <StatCard title="Clientes Activos" value={clientes.length.toString()} icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />} trend="+2.1%" />
        <StatCard title="Artículos en Stock" value={stockTotal.toString()} icon={<Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />} trend="-1.4%" />
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-white/10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                Ingresos Históricos
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Últimos 30 días</p>
            </div>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg border border-indigo-200 dark:border-indigo-500/30 hidden sm:block">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="h-[250px] sm:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#9ca3af40" />
                <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip cursor={{ fill: '#9ca3af20' }} contentStyle={{ backgroundColor: 'var(--tooltip-bg, #ffffff)', borderRadius: '12px', border: '1px solid #e5e7eb', color: 'var(--tooltip-text, #111827)' }} />
                <Bar dataKey="total" fill="url(#colorTotal)" radius={[6, 6, 0, 0]} barSize={40} />
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-white/10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                Volumen
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ventas por día</p>
            </div>
          </div>
          <div className="h-[250px] sm:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#9ca3af40" />
                <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg, #ffffff)', borderRadius: '12px', border: '1px solid #e5e7eb', color: 'var(--tooltip-text, #111827)' }} />
                <Line type="monotone" dataKey="cantidad" stroke="#34d399" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: 'var(--dot-bg, #fff)' }} activeDot={{ r: 8, fill: '#34d399' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );

  function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
    const isPositive = trend.startsWith('+');
    return (
      <motion.div variants={itemVariants} className="glass-panel p-5 sm:p-6 rounded-3xl border border-gray-200 dark:border-white/10 relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</h3>
          </div>
          <div className="p-2 sm:p-3 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 shadow-inner">
            {icon}
          </div>
        </div>
        <div className="mt-4 sm:mt-6 flex items-center relative z-10">
          <span className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-md ${isPositive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
            {trend}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 ml-2 sm:ml-3 font-medium">vs mes anterior</span>
        </div>
      </motion.div>
    );
  }
}
