"use client";

import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Plus, Search, Edit2, Trash2, X, Package, Tag, Layers, Upload, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArticulosPage() {
  const { articulos, categorias, presentaciones, addArticulo, updateArticulo, deleteArticulo } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialForm = {
    codigo: '',
    nombre: '',
    descripcion: '',
    imagen: '',
    id_categoria: 1,
    id_presentacion: 1,
    precio: 0,
    stock_actual: 0
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredArticulos = articulos.filter(a => 
    a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (articulo?: typeof articulos[0]) => {
    if (articulo) {
      setEditingId(articulo.id);
      setFormData(articulo);
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateArticulo(editingId, formData);
    } else {
      addArticulo(formData);
    }
    handleCloseModal();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagen: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getCategoriaName = (id: number) => categorias.find(c => c.id === id)?.nombre || 'N/A';
  const getPresentacionName = (id: number) => presentaciones.find(p => p.id === id)?.nombre || 'N/A';

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Inventario de Artículos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Gestiona el catálogo de productos, su stock e imágenes.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold flex items-center shadow-lg shadow-indigo-500/30 transition-all border border-indigo-400/20 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Agregar Artículo
        </motion.button>
      </div>

      {/* Toolbar */}
      <div className="glass-panel p-2 rounded-2xl flex items-center border border-gray-200 dark:border-white/10">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar por código o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest font-semibold">
                <th className="p-4 sm:p-5 pl-6 sm:pl-8">Producto</th>
                <th className="p-4 sm:p-5">Detalles</th>
                <th className="p-4 sm:p-5 text-right">Precio</th>
                <th className="p-4 sm:p-5 text-center">Stock</th>
                <th className="p-4 sm:p-5 text-right pr-6 sm:pr-8">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              <AnimatePresence>
                {filteredArticulos.map((articulo) => (
                  <motion.tr 
                    key={articulo.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-4 sm:p-5 pl-6 sm:pl-8">
                      <div className="flex items-center">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-500 mr-4 flex-shrink-0 overflow-hidden">
                          {articulo.imagen && articulo.imagen.startsWith('data:image') ? (
                            <img src={articulo.imagen} alt={articulo.nombre} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-7 h-7" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{articulo.nombre}</p>
                          <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 mt-1">{articulo.codigo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="flex flex-col space-y-1">
                        <span className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400">
                          <Tag className="w-3 h-3 mr-1" /> {getCategoriaName(articulo.id_categoria)}
                        </span>
                        <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-500">
                          <Layers className="w-3 h-3 mr-1" /> {getPresentacionName(articulo.id_presentacion)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-right font-semibold text-gray-900 dark:text-white">
                      ${articulo.precio.toFixed(2)}
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        articulo.stock_actual > 20 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : articulo.stock_actual > 0 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                      }`}>
                        {articulo.stock_actual} unid.
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 pr-6 sm:pr-8">
                      <div className="flex justify-end space-x-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(articulo)} className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg transition-colors border border-transparent dark:hover:border-indigo-500/30">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteArticulo(articulo.id)} className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg transition-colors border border-transparent dark:hover:border-rose-500/30">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredArticulos.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 sm:p-12 text-center text-gray-500">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-20" />
                    No se encontraron artículos.
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
              className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[95dvh] sm:max-h-[90vh]"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
              
              <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 dark:border-white/5 shrink-0">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Editar Artículo' : 'Nuevo Artículo'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto p-5 sm:p-6">
                <form id="articulo-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Photo Upload Zone */}
                  <div className="md:col-span-2 flex justify-center mb-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-32 h-32 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-500/5 hover:bg-indigo-100 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer relative overflow-hidden group"
                    >
                      {formData.imagen ? (
                        <>
                          <img src={formData.imagen} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-indigo-400 mb-2" />
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium text-center px-2">Subir Foto</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Artículo</label>
                    <input 
                      required type="text" value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="Ej. Nike Air Zoom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código</label>
                    <input 
                      required type="text" value={formData.codigo}
                      onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="ZAP-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio (USD)</label>
                    <input 
                      required type="number" step="0.01" min="0" value={formData.precio}
                      onChange={(e) => setFormData({...formData, precio: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Inicial</label>
                    <input 
                      required type="number" min="0" value={formData.stock_actual}
                      onChange={(e) => setFormData({...formData, stock_actual: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                    <select 
                      value={formData.id_categoria}
                      onChange={(e) => setFormData({...formData, id_categoria: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                    >
                      {categorias.map(c => <option key={c.id} value={c.id} className="dark:bg-gray-900">{c.nombre}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Presentación</label>
                    <select 
                      value={formData.id_presentacion}
                      onChange={(e) => setFormData({...formData, id_presentacion: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                    >
                      {presentaciones.map(p => <option key={p.id} value={p.id} className="dark:bg-gray-900">{p.nombre}</option>)}
                    </select>
                  </div>

                </form>
              </div>
              
              <div className="p-5 sm:p-6 border-t border-gray-100 dark:border-white/5 flex justify-end space-x-3 shrink-0 bg-gray-50/50 dark:bg-black/20">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-white/5 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" form="articulo-form" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                  {editingId ? 'Actualizar' : 'Guardar Artículo'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
