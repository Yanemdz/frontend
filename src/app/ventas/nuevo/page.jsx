"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import qs from 'qs';
import "../../estilos.css"; // Asegúrate de que esta ruta sea correcta

// Fetch available products
async function fetchAvailableProducts() {
    const url = "http://localhost:3000/productos";
    const productos = await axios.get(url);
    return productos.data;
}

// Fetch available clients
async function fetchUsuarios() {
    const url = "http://localhost:3000/";
    const usuarios = await axios.get(url);
    return usuarios.data;
}

export default function NuevaVenta() {
    const router = useRouter();
    const [ventaData, setVentaData] = useState({
        clientId: "",
        productos: [],
        fecha: new Date().toLocaleDateString()
    });
    const [availableProducts, setAvailableProducts] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [productSelections, setProductSelections] = useState([{ productId: "", quantity: 1 }]);

    useEffect(() => {
        fetchAvailableProducts().then(setAvailableProducts);
        fetchUsuarios().then(setAvailableUsers);
    }, []);

    const handleClientSelection = (e) => {
        setVentaData({ ...ventaData, clientId: e.target.value });
    };

    const addProductSelection = () => {
        setProductSelections([...productSelections, { productId: "", quantity: 1 }]);
    };

    const handleProductSelectionChange = (index, field, value) => {
        const updatedSelections = [...productSelections];
        updatedSelections[index][field] = value;
        setProductSelections(updatedSelections);
    };

    async function enviarVenta(e) {
        e.preventDefault();

        const productos = productSelections
            .filter(selection => selection.productId)
            .map((selection, index) => ({
                [`productos[${index}].id`]: selection.productId,
                [`productos[${index}].cantidad`]: selection.quantity
            }));

        const ventaPayload = {
            usuarioId: ventaData.clientId,
            ...Object.assign({}, ...productos)
        };

        const url = "http://localhost:3000/ventas/nuevaVenta";

        try {
            const respuesta = await axios.post(url, qs.stringify(ventaPayload), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            alert("Solicitud de venta enviada exitosamente al backend");
            router.replace("/ventas/mostrar");
        } catch (error) {
            console.error("Detalles del error al enviar la solicitud de venta:", error.response?.data || error.message);
            alert("Ocurrió un error al enviar la solicitud de venta");
        }
    }

    return (
        <div className="container">
            <h1 className="titulo">Nueva Venta</h1>
            <p className="descripcion">Completa la información para registrar una nueva venta</p>
            <form onSubmit={enviarVenta} className="col-12">
                <div className="card text-center">
                    <div className="card-body">
                        <select
                            style={{ height: "60px" }}
                            className="form-control mb-3"
                            value={ventaData.clientId}
                            onChange={handleClientSelection}
                            required
                        >
                            <option value="">Seleccionar Cliente</option>
                            {availableUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.nombre}
                                </option>
                            ))}
                        </select>

                        <input
                            style={{ height: "60px" }}
                            className="form-control mb-3"
                            type="text"
                            value={`Fecha de Venta: ${ventaData.fecha}`}
                            disabled
                        />

                        {productSelections.map((selection, index) => (
                            <div key={index} className="product-selection-row mb-3">
                                <select
                                    style={{ height: "60px" }}
                                    className="form-control mb-2"
                                    value={selection.productId}
                                    onChange={(e) => handleProductSelectionChange(index, "productId", e.target.value)}
                                    required
                                >
                                    <option value="">Seleccionar Producto</option>
                                    {availableProducts.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.nombre}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    style={{ height: "60px" }}
                                    className="form-control"
                                    type="number"
                                    min="1"
                                    placeholder="Cantidad"
                                    value={selection.quantity}
                                    onChange={(e) => handleProductSelectionChange(index, "quantity", Number(e.target.value))}
                                    required
                                />
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-secondary mb-3"
                            onClick={addProductSelection}
                        >
                            Agregar Otro Producto
                        </button>

                        <div className="selected-products">
                            <h5>Productos Seleccionados:</h5>
                            <ul>
                                {productSelections.map((prod, index) => {
                                    const product = availableProducts.find((p) => p.id === prod.productId);
                                    return product ? (
                                        <li key={index}>
                                            {product.nombre} - Cantidad: {prod.quantity}
                                        </li>
                                    ) : null;
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="card-footer">
                        <button type="submit" className="btn-red">
                            Enviar solicitud de venta
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
