// /app/ventas/modificar/[id]/page.jsx
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "../../../estilos.css";

async function modificarVenta(e, id, ventaData, setMensaje) {
    e.preventDefault();
    const url = `http://localhost:3000/ventas/modificarVenta/${id}`;

    try {
        const respuesta = await axios.put(url, ventaData);
        console.log(respuesta);
        setMensaje("Venta modificada exitosamente.");
        setTimeout(() => {
            window.location.href = "/ventas/mostrar";
        }, 2000);
    } catch (error) {
        console.error("Error al modificar la venta:", error);
        setMensaje("Error al modificar la venta.");
    }
}

export default function EditarVentaForm({ params }) {
    const [venta, setVenta] = useState({
        usuarioId: "",
        productos: [],
        estatus: "",
        fecha: new Date().toLocaleDateString()
    });
    const [mensaje, setMensaje] = useState("");
    const [availableProducts, setAvailableProducts] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const { id } = params;

    useEffect(() => {
        async function fetchVentaData() {
            const url = `http://localhost:3000/ventas/buscarVentaPorId/${id}`;
            const response = await axios.get(url);
            setVenta(response.data.venta);
        }

        async function fetchResources() {
            const productsResponse = await axios.get("http://localhost:3000/productos");
            setAvailableProducts(productsResponse.data);

            const usersResponse = await axios.get("http://localhost:3000/");
            setAvailableUsers(usersResponse.data);
        }

        fetchVentaData();
        fetchResources();
    }, [id]);

    const handleClientSelection = (e) => {
        setVenta({ ...venta, usuarioId: e.target.value });
    };

    const handleProductSelectionChange = (index, field, value) => {
        const updatedProducts = [...venta.productos];
        updatedProducts[index][field] = value;
        setVenta({ ...venta, productos: updatedProducts });
    };

    return (
        <div className="container">
            <h1 className="titulo">Modificar Venta</h1>
            <form onSubmit={(e) => modificarVenta(e, id, venta, setMensaje)} className="col-12">
                <div className="card text-center">
                    <div className="card-body">
                        <select
                            className="form-control mb-3"
                            value={venta.usuarioId}
                            onChange={handleClientSelection}
                            required
                            style={{ height: "60px" }}
                        >
                            <option value="">Seleccionar Cliente</option>
                            {availableUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.nombre}
                                </option>
                            ))}
                        </select>

                        <input
                            className="form-control mb-3"
                            type="text"
                            value={`Fecha de Venta: ${venta.fecha}`}
                            disabled
                            style={{ height: "60px" }}
                        />

                        {venta.productos.map((producto, index) => (
                            <div key={index} className="product-selection-row mb-3">
                                <select
                                    className="form-control mb-2"
                                    value={producto.id}
                                    onChange={(e) => handleProductSelectionChange(index, "id", e.target.value)}
                                    required
                                    style={{ height: "60px" }}
                                >
                                    <option value="">Seleccionar Producto</option>
                                    {availableProducts.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.nombre}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    className="form-control"
                                    type="number"
                                    min="1"
                                    placeholder="Cantidad"
                                    value={producto.cantidad}
                                    onChange={(e) => handleProductSelectionChange(index, "cantidad", Number(e.target.value))}
                                    required
                                    style={{ height: "60px" }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="card-footer">
                        <button type="submit" className="btn-red">
                            Modificar venta
                        </button>
                    </div>
                </div>
                {mensaje && <p className="text-center mt-3">{mensaje}</p>}
            </form>
        </div>
    );
}
