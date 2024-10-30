import Link from "next/link"; 
import Boton from "@/components/boton"; 
import axios from "axios";
import '../../estilos.css'; 
import BorrarVenta from "@/components/borrarVenta";
import EditarVentaLink from "@/components/editarVentaLink";

async function getVentas() {
    const url = "http://localhost:3000/ventas";
    const ventas = await axios.get(url);
    return ventas.data;
}

function formatDate(timestamp) {
    const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
    return date.toLocaleString();
}

export default async function Ventas() {
    const ventas = await getVentas();

    return (
        <div className="container"> 
            <h1 className="titulo">Ventas</h1> 
            <p className="descripcion">Estas en ventas</p> 
            <table className="table"> 
                <thead>
                    <tr>
                        <th className="table-header">Id</th> 
                        <th className="table-header">Estatus</th>
                        <th className="table-header">Fecha</th>
                        <th className="table-header">Productos</th>
                        <th className="table-header">Editar / Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta) => (
                        <tr key={venta.id}>
                            <td className="table-data">{venta.id}</td>
                            <td className="table-data">{venta.estatus}</td>
                            <td className="table-data">{formatDate(venta.fecha)}</td>
                            <td className="table-data">
                                {venta.productos.map((producto) => (
                                    <div key={producto.id}>
                                        ID: {producto.id}, Cantidad: {producto.cantidad}
                                    </div>
                                ))}
                            </td>
                            <td className="table-data">
                                <EditarVentaLink id={venta.id} /> / <BorrarVenta id={venta.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link href="/ventas/nuevo" className="link">Agregar Venta</Link>
        </div>
    );
}
