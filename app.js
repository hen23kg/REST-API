const express = require('express');
const app = express();
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart'); // Importar las rutas del carrito

// Middleware para manejar JSON
app.use(express.json());

// Rutas de productos
app.use('/api/productos', productRoutes);

// Rutas del carrito
app.use('/api/cart', cartRoutes); // Usar las rutas del carrito

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
