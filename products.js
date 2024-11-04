const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.json(rows); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// 2. Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// 3. Insertar un nuevo producto
router.post('/', async (req, res) => {
    const { nombre, descripcion, precio, categoria } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !descripcion || !precio || !categoria) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Insertar el producto en la base de datos
        const [result] = await pool.query(
            'INSERT INTO productos (nombre, descripcion, precio, categoria) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, precio, categoria]
        );
        res.status(201).json({ id: result.insertId, nombre, descripcion, precio, categoria });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar el producto' });
    }
});

// 4. Actualizar un producto por ID
router.put('/:id', async (req, res) => {
    const { nombre, descripcion, precio, categoria } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !descripcion || !precio || !categoria) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Actualizar el producto en la base de datos
        const [result] = await pool.query(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria = ? WHERE id = ?',
            [nombre, descripcion, precio, categoria, req.params.id]
        );

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Producto actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// 5. Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
    try {
        // Eliminar el producto de la base de datos
        const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
