import { create } from 'zustand';
import { 
  Cliente, Articulo, Venta, Categoria, Presentacion, 
  initialClientes, initialArticulos, initialVentas, initialCategorias, initialPresentaciones 
} from '@/lib/mockData';

interface AppState {
  clientes: Cliente[];
  articulos: Articulo[];
  ventas: Venta[];
  categorias: Categoria[];
  presentaciones: Presentacion[];
  
  // Acciones Clientes
  addCliente: (cliente: Omit<Cliente, 'id'>) => void;
  updateCliente: (id: number, cliente: Partial<Cliente>) => void;
  deleteCliente: (id: number) => void;
  
  // Acciones Articulos
  addArticulo: (articulo: Omit<Articulo, 'id'>) => void;
  updateArticulo: (id: number, articulo: Partial<Articulo>) => void;
  deleteArticulo: (id: number) => void;

  // Acciones Ventas
  addVenta: (venta: Omit<Venta, 'id' | 'correlativo'>) => void;
  deleteVenta: (id: number) => void;

  // Auth
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  clientes: initialClientes,
  articulos: initialArticulos,
  ventas: initialVentas,
  categorias: initialCategorias,
  presentaciones: initialPresentaciones,
  isAuthenticated: false,

  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),

  addCliente: (cliente) => set((state) => ({
    clientes: [...state.clientes, { ...cliente, id: Math.max(0, ...state.clientes.map(c => c.id)) + 1 }]
  })),
  
  updateCliente: (id, updatedFields) => set((state) => ({
    clientes: state.clientes.map(c => c.id === id ? { ...c, ...updatedFields } : c)
  })),
  
  deleteCliente: (id) => set((state) => ({
    clientes: state.clientes.filter(c => c.id !== id)
  })),

  addArticulo: (articulo) => set((state) => ({
    articulos: [...state.articulos, { ...articulo, id: Math.max(0, ...state.articulos.map(a => a.id)) + 1 }]
  })),
  
  updateArticulo: (id, updatedFields) => set((state) => ({
    articulos: state.articulos.map(a => a.id === id ? { ...a, ...updatedFields } : a)
  })),
  
  deleteArticulo: (id) => set((state) => ({
    articulos: state.articulos.filter(a => a.id !== id)
  })),

  addVenta: (venta) => set((state) => {
    const newId = Math.max(0, ...state.ventas.map(v => v.id)) + 1;
    const correlativo = newId.toString().padStart(6, '0');
    
    // Al registrar una venta, se debe descontar el stock de los artículos vendidos
    const newArticulos = state.articulos.map(art => {
      const detalleVenta = venta.detalles.find(d => d.id_articulo === art.id);
      if (detalleVenta) {
        return { ...art, stock_actual: Math.max(0, art.stock_actual - detalleVenta.cantidad) };
      }
      return art;
    });

    return {
      ventas: [{ ...venta, id: newId, correlativo }, ...state.ventas],
      articulos: newArticulos
    };
  }),

  deleteVenta: (id) => set((state) => {
    const ventaToRemove = state.ventas.find(v => v.id === id);
    if (!ventaToRemove) return state;

    // Al eliminar una venta, opcionalmente podríamos regresar el stock
    const newArticulos = state.articulos.map(art => {
      const detalleVenta = ventaToRemove.detalles.find(d => d.id_articulo === art.id);
      if (detalleVenta) {
        return { ...art, stock_actual: art.stock_actual + detalleVenta.cantidad };
      }
      return art;
    });

    return {
      ventas: state.ventas.filter(v => v.id !== id),
      articulos: newArticulos
    };
  }),
}));
