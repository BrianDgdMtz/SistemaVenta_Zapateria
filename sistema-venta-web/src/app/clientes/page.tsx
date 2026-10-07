"use client";

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Plus, Search, Edit2, Trash2, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientesPage() {
  const { clientes, addCliente, updateCliente, deleteCliente } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({ nombre: '', apellidos: '', email: '' });

  const filteredClientes = clientes.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (client?: typeof clientes[0]) => {
    if (client) {
      setEditingId(client.id);
      setFormData({ nombre: client.nombre, apellidos: client.apellidos, email: client.email });
    } else {
      setEditingId(null);
      setFormData({ nombre: '', apellidos: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCliente(editingId, formData);
    } else {
      addCliente(formData);
    }
    handleCloseModal();
  };

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Directorio de Clientes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Gestiona y visualiza la base de clientes de tu zapatería.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold flex items-center shadow-lg shadow-indigo-500/30 transition-all border border-indigo-400/20 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Agregar Cliente
        </motion.button>
      </div>

      {/* Toolbar */}
      <div className="glass-panel p-2 rounded-2xl flex items-center border border-gray-200 dark:border-white/10">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest font-semibold">
                <th className="p-4 sm:p-5 pl-6 sm:pl-8">Cliente</th>
                <th className="p-4 sm:p-5">Contacto (Email)</th>
                <th className="p-4 sm:p-5">ID Ref</th>
                <th className="p-4 sm:p-5 text-right pr-6 sm:pr-8">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              <AnimatePresence>
                {filteredClientes.map((cliente) => (
                  <motion.tr 
                    key={cliente.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-4 sm:p-5 pl-6 sm:pl-8">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold mr-3 sm:mr-4 flex-shrink-0">
                          {cliente.nombre.charAt(0)}{cliente.apellidos.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-none">{cliente.nombre} {cliente.apellidos}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-gray-600 dark:text-gray-400 truncate max-w-[150px] sm:max-w-none">{cliente.email}</td>
                    <td className="p-4 sm:p-5 text-gray-400 dark:text-gray-500 font-mono text-xs">#{cliente.id.toString().padStart(4, '0')}</td>
                    <td className="p-4 sm:p-5 pr-6 sm:pr-8">
                      <div className="flex justify-end space-x-2 sm:space-x-3 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(cliente)} className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg transition-colors border border-transparent dark:hover:border-indigo-500/30">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteCliente(cliente.id)} className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg transition-colors border border-transparent dark:hover:border-rose-500/30">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredClientes.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 sm:p-12 text-center text-gray-500">
                    <User className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-20" />
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-end sm:items-center justify-center z-[60] px-0 sm:px-4 pb-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div 
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-t-[2rem] sm:rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-none"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
              
              <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Nombre</label>
                  <input 
                    required type="text" value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Ej. Juan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Apellidos</label>
                  <input 
                    required type="text" value={formData.apellidos}
                    onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                    className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Ej. Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Email de Contacto</label>
                  <input 
                    required type="email" value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
                
                <div className="pt-4 sm:pt-6 flex justify-end space-x-3">
                  <button type="button" onClick={handleCloseModal} className="px-4 sm:px-5 py-2.5 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-5 sm:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                    {editingId ? 'Actualizar' : 'Guardar Cliente'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
