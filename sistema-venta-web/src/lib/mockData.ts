export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Presentacion {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Articulo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  id_categoria: number;
  id_presentacion: number;
  precio: number;
  stock_actual: number;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
}

export interface DetalleVenta {
  id: number;
  id_venta: number;
  id_articulo: number;
  cantidad: number;
  precio_venta: number;
  descuento: number;
}

export interface Venta {
  id: number;
  id_cliente: number;
  id_trabajador: number;
  fecha: string;
  tipo_comprobante: string;
  serie: string;
  correlativo: string;
  igv: number;
  total: number;
  detalles: DetalleVenta[];
}

// Datos Semilla (Mock)
export const initialCategorias: Categoria[] = [
  { id: 1, nombre: "Deportivos", descripcion: "Zapatillas para correr y entrenar" },
  { id: 2, nombre: "Casuales", descripcion: "Zapatos de uso diario" },
  { id: 3, nombre: "Formales", descripcion: "Zapatos elegantes de vestir" },
];

export const initialPresentaciones: Presentacion[] = [
  { id: 1, nombre: "Caja Estándar", descripcion: "Caja de cartón con logo" },
  { id: 2, nombre: "Caja Premium", descripcion: "Caja imantada" },
];

export const initialArticulos: Articulo[] = [
  { id: 1, codigo: "ZAP-001", nombre: "Nike Air Zoom", descripcion: "Zapatillas running color negro", imagen: "/shoes1.png", id_categoria: 1, id_presentacion: 1, precio: 120.50, stock_actual: 45 },
  { id: 2, codigo: "ZAP-002", nombre: "Adidas Stan Smith", descripcion: "Clásicas blancas", imagen: "/shoes2.png", id_categoria: 2, id_presentacion: 1, precio: 85.00, stock_actual: 30 },
  { id: 3, codigo: "ZAP-003", nombre: "Oxford Elegance", descripcion: "Zapato de cuero negro", imagen: "/shoes3.png", id_categoria: 3, id_presentacion: 2, precio: 150.00, stock_actual: 15 },
];

export const initialClientes: Cliente[] = [
  { id: 1, nombre: "Juan", apellidos: "Pérez", email: "juan.perez@email.com" },
  { id: 2, nombre: "María", apellidos: "Gómez", email: "maria.g@email.com" },
];

// Generar ventas ficticias para los gráficos (Determinista para evitar errores de hidratación)
const generateMockVentas = (): Venta[] => {
  const ventas: Venta[] = [];
  let currentId = 1;
  // Usar una fecha base fija para que el SSR y el Client rendericen exactamente lo mismo
  const baseDate = new Date('2024-01-15T12:00:00Z');
  
  // Generar 15 ventas repartidas
  for (let i = 30; i >= 0; i -= 2) {
    const fechaVenta = new Date(baseDate);
    fechaVenta.setDate(baseDate.getDate() - i);
    
    // Generar un total "aleatorio" pero predecible basado en el índice
    const pseudoRandomTotal = 80 + ((i * 27) % 220); 
    
    ventas.push({
      id: currentId,
      id_cliente: (currentId % 2) + 1,
      id_trabajador: 1,
      fecha: fechaVenta.toISOString(),
      tipo_comprobante: "Boleta",
      serie: "B001",
      correlativo: currentId.toString().padStart(6, '0'),
      igv: 18,
      total: pseudoRandomTotal,
      detalles: []
    });
    currentId++;
  }
  
  return ventas;
};

export const initialVentas: Venta[] = generateMockVentas();
