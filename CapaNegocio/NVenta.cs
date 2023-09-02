﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using CapaDatos;

namespace CapaNegocio
{
    public class NVenta
    {
        /*Metodo Insertar que llama al metodo Insertar de la clase DVenta de la capa datos*/
        public static string Insertar(int idcliente, int idtrabajador, DateTime fecha, string tipo_comprobante,
            string serie, string correlativo, decimal igv, DataTable dtDetalles)
        {
            DVenta Obj = new DVenta();
            Obj.Idcliente = idcliente;
            Obj.Idtrabajador = idtrabajador;
            Obj.Fecha = fecha;
            Obj.Tipo_Comprobante = tipo_comprobante;
            Obj.Serie = serie;
            Obj.Correlativo = correlativo;
            Obj.Igv = igv;
            List<DDetalle_Venta> detalles = new List<DDetalle_Venta>();
            foreach (DataRow row in dtDetalles.Rows)
            {
                DDetalle_Venta detalle = new DDetalle_Venta();
                detalle.Iddetalle_ingreso = Convert.ToInt32(row["iddetalle_ingreso"].ToString());
                detalle.Cantidad = Convert.ToInt32(row["cantidad"].ToString());
                detalle.Precio_Venta = Convert.ToDecimal(row["precio_venta"].ToString());
                detalle.Descuento = Convert.ToDecimal(row["descuento"].ToString());
                detalles.Add(detalle);
            }
            return Obj.Insertar(Obj, detalles);
        }

        /*Metodo Eliminar que llama al metodo Eliminar de la clase DVenta de la capa datos*/
        public static string Eliminar(int idventa)
        {
            DVenta Obj = new DVenta();
            Obj.Idventa = idventa;
            return Obj.Eliminar(Obj);
        }

        /*Metodo Mostrar que llama al metodo Mostrar de la clase DVenta de la capa datos*/
        public static DataTable Mostrar()
        {
            return new DVenta().Mostrar();
        }

        /*Metodo BuscarFecha que llama al metodo BuscarFecha de la clase DVenta de la capa datos*/
        public static DataTable BuscarFechas(string textobuscar, string textobuscar2)
        {
            DVenta Obj = new DVenta();
            return Obj.BuscarFechas(textobuscar, textobuscar2);
        }

        /*Metodo MostrarDetalle que llama al metodo MostrarDetalle de la clase DVenta de la capa datos*/
        public static DataTable MostrarDetalle(string textobuscar)
        {
            DVenta Obj = new DVenta();
            return Obj.MostrarDetalle(textobuscar);
        }

        /*Metodo MostrarArticulo_Venta_Nombre que llama al metodo MostrarArticulo_Venta_Nombre
          de la clase DVenta de la capa datos*/
        public static DataTable MostrarArticulo_Venta_Nombre(string textobuscar)
        {
            DVenta Obj = new DVenta();
            return Obj.MostrarArticulo_Venta_Nombre(textobuscar);
        }

        /*Metodo MostrarArticulo_Venta_Codigo que llama al metodo MostrarArticulo_Venta_Codigo
          de la clase DVenta de la capa datos*/
        public static DataTable MostrarArticulo_Venta_Codigo(string textobuscar)
        {
            DVenta Obj = new DVenta();
            return Obj.MostrarArticulo_Venta_codigo(textobuscar);
        }
    }
}
