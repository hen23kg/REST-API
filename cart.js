const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. Agregar un producto al carrito// Agregar un producto al carrito
router.post('/:carritoId/productos', async (req, res) => {
    const { productoId, cantidad } = req.body;
    const { carritoId } = req.params;

    try {
        // Verificar si el producto ya está en el carrito
        const [rows] = await pool.query(
            'SELECT * FROM carrito_productos WHERE carrito_id = ? AND producto_id = ?',
            [carritoId, productoId]
        );

        if (rows.length > 0) {
            // Si ya está en el carrito, actualizar la cantidad
            const nuevaCantidad = rows[0].cantidad + cantidad;
            await pool.query(
                'UPDATE carrito_productos SET cantidad = ? WHERE carrito_id = ? AND producto_id = ?',
                [nuevaCantidad, carritoId, productoId]
            );
        } else {
            // Si no está en el carrito, agregarlo
            await pool.query(
                'INSERT INTO carrito_productos (carrito_id, producto_id, cantidad) VALUES (?, ?, ?)',
                [carritoId, productoId, cantidad]
            );
        }

        res.json({ mensaje: 'Producto agregado al carrito' });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});


// 2. Ver los productos del carrito
router.get('/:carritoId/productos', async (req, res) => {
    const { carritoId } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT p.id, p.nombre, p.descripcion, p.precio, cp.cantidad 
            FROM carrito_productos cp 
            JOIN productos p ON cp.producto_id = p.id 
            WHERE cp.carrito_id = ?`,
            [carritoId]
        );

        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ error: 'El carrito está vacío o no existe' });
        }
    } catch (error) {
        console.error('Error al obtener los productos del carrito:', error);
        res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
});

// 3. Actualizar la cantidad de un producto en el carrito
router.put('/:carritoId/productos/:productoId', async (req, res) => {
    const { carritoId, productoId } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || cantidad < 1) {
        return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE carrito_productos SET cantidad = ? WHERE carrito_id = ? AND producto_id = ?',
            [cantidad, carritoId, productoId]
        );

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Cantidad actualizada correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        console.error('Error al actualizar la cantidad:', error);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

// 4. Eliminar un producto del carrito
router.delete('/:carritoId/productos/:productoId', async (req, res) => {
    const { carritoId, productoId } = req.params;

    try {
        const [result] = await pool.query(
            'DELETE FROM carrito_productos WHERE carrito_id = ? AND producto_id = ?',
            [carritoId, productoId]
        );

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Producto eliminado del carrito' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

module.exports = router;
