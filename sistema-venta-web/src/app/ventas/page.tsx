"use client";

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { ShoppingCart, Plus, Minus, Trash2, User, Package, CheckCircle2, Search, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VentasPage() {
  const { articulos, clientes, ventas, addVenta } = useStore();
  
  // UI States
  const [activeTab, setActiveTab] = useState<'POS' | 'HISTORIAL'>('POS');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  // POS States
  const [selectedCliente, setSelectedCliente] = useState<number | ''>('');
  const [cart, setCart] = useState<{ articulo: typeof articulos[0], cantidad: number }[]>([]);

  // POS Handlers
  const addToCart = (articulo: typeof articulos[0]) => {
    if (articulo.stock_actual <= 0) return; // No hay stock
    setCart(prev => {
      const existing = prev.find(item => item.articulo.id === articulo.id);
      if (existing) {
        if (existing.cantidad >= articulo.stock_actual) return prev; // Límite de stock
        return prev.map(item => item.articulo.id === articulo.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { articulo, cantidad: 1 }];
    });
  };

  const updateCartQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.articulo.id === id) {
        const newQty = item.cantidad + delta;
        if (newQty > 0 && newQty <= item.articulo.stock_actual) {
          return { ...item, cantidad: newQty };
        }
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.articulo.id !== id));
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.articulo.precio * item.cantidad), 0), [cart]);

  const handleCheckout = () => {
    if (!selectedCliente || cart.length === 0) return;

    addVenta({
      id_cliente: Number(selectedCliente),
      id_trabajador: 1, // Simulando admin
      fecha: new Date().toISOString(),
      tipo_comprobante: "Boleta",
      serie: "B002",
      igv: 18,
      total: cartTotal,
      detalles: cart.map(c => ({
        id: Math.random(), // Mock ID
        id_venta: 0, 
        id_articulo: c.articulo.id,
        cantidad: c.cantidad,
        precio_venta: c.articulo.precio,
        descuento: 0
      }))
    });

    setCart([]);
    setSelectedCliente('');
    setIsSuccessModalOpen(true);
  };

  // Historial Data
  const getClienteName = (id: number) => {
    const c = clientes.find(c => c.id === id);
    return c ? `${c.nombre} ${c.apellidos}` : 'Desconocido';
  };

  const filteredArticulos = articulos.filter(a => 
    a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Módulo de Ventas</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Punto de venta y registro histórico.</p>
        </div>
        
        <div className="glass-panel p-1 rounded-2xl flex border border-gray-200 dark:border-white/10 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('POS')}
            className={`flex-1 sm:px-8 py-2.5 rounded-xl font-medium transition-all text-sm sm:text-base ${
              activeTab === 'POS' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Punto de Venta
          </button>
          <button 
            onClick={() => setActiveTab('HISTORIAL')}
            className={`flex-1 sm:px-8 py-2.5 rounded-xl font-medium transition-all text-sm sm:text-base ${
              activeTab === 'HISTORIAL' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Historial de Ventas
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'POS' ? (
          <motion.div 
            key="pos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {/* Catalogo (Left) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Buscar producto para vender..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 glass-panel border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredArticulos.map(art => (
                  <motion.div 
                    key={art.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => addToCart(art)}
                    className={`glass-panel p-4 rounded-3xl border transition-colors cursor-pointer flex flex-col items-center text-center ${
                      art.stock_actual > 0 
                        ? 'border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/50' 
                        : 'border-red-200 dark:border-red-500/20 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-white/5 dark:to-transparent flex items-center justify-center mb-3 overflow-hidden">
                      {art.imagen && art.imagen.startsWith('data:image') ? (
                        <img src={art.imagen} alt={art.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-8 h-8 text-indigo-400" />
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">{art.nombre}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-mono">{art.codigo}</p>
                    <div className="mt-auto flex w-full justify-between items-center px-1">
                      <span className="font-black text-indigo-600 dark:text-indigo-400">${art.precio.toFixed(2)}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${art.stock_actual > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                        {art.stock_actual} ud
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cart (Right) */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-white/10 sticky top-28 flex flex-col h-[calc(100vh-140px)]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-3 text-indigo-500" />
                  Carrito de Venta
                </h2>
                
                <div className="mb-6 relative">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Cliente</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select 
                      value={selectedCliente}
                      onChange={(e) => setSelectedCliente(e.target.value ? Number(e.target.value) : '')}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none font-medium text-sm"
                    >
                      <option value="" disabled className="dark:bg-gray-900 text-gray-400">Seleccionar Cliente...</option>
                      {clientes.map(c => <option key={c.id} value={c.id} className="dark:bg-gray-900">{c.nombre} {c.apellidos}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div 
                        key={item.articulo.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-gray-50 dark:bg-white/[0.03] p-3 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.articulo.nombre}</p>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">${(item.articulo.precio * item.cantidad).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-white dark:bg-black/50 p-1 rounded-xl border border-gray-200 dark:border-white/10 shrink-0">
                          <button onClick={() => updateCartQty(item.articulo.id, -1)} className="p-1 text-gray-500 hover:text-indigo-500 transition-colors"><Minus className="w-3 h-3" /></button>
                          <span className="w-4 text-center text-xs font-bold text-gray-900 dark:text-white">{item.cantidad}</span>
                          <button onClick={() => updateCartQty(item.articulo.id, 1)} className="p-1 text-gray-500 hover:text-indigo-500 transition-colors"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.articulo.id)} className="ml-2 p-2 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-xl transition-colors shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                    {cart.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 py-10">
                        <ShoppingCart className="w-12 h-12 mb-3" />
                        <p className="text-sm">El carrito está vacío</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-white/10 shrink-0">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Total a Pagar</span>
                    <span className="text-3xl font-black text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || !selectedCliente}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 disabled:bg-gray-300 disabled:dark:bg-white/5 disabled:text-gray-500 dark:disabled:text-gray-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95 flex justify-center items-center"
                  >
                    Procesar Venta <ShoppingCart className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="historial"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest font-semibold">
                    <th className="p-5 pl-8">Comprobante</th>
                    <th className="p-5">Fecha</th>
                    <th className="p-5">Cliente</th>
                    <th className="p-5 text-right pr-8">Total Cobrado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {ventas.map((venta) => (
                    <tr key={venta.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 pl-8">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-4">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{venta.tipo_comprobante}</p>
                            <p className="text-xs font-mono text-gray-500 dark:text-gray-400">{venta.serie}-{venta.correlativo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="inline-flex items-center text-gray-600 dark:text-gray-300 font-medium text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(venta.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="p-5 font-medium text-gray-700 dark:text-gray-300">
                        {getClienteName(venta.id_cliente)}
                      </td>
                      <td className="p-5 text-right font-black text-emerald-600 dark:text-emerald-400 text-lg pr-8">
                        ${venta.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {ventas.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-gray-500">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        No hay ventas registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[70] px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#111827] border border-emerald-200 dark:border-emerald-500/20 p-8 rounded-3xl shadow-2xl relative z-10 flex flex-col items-center text-center max-w-sm"
            >
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">¡Venta Exitosa!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">El stock de los artículos ha sido descontado correctamente de la base de datos.</p>
              <button 
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Continuar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>

    </div>
  );
}
