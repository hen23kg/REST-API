CREATE DATABASE education_db;

use education_db;
select * from materias;

show tables;
select * from estudiantes;


CREATE DATABASE tienda_db;
use tienda_db;
select * from productos;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion TEXT,
    precio DECIMAL(10, 2),
    categoria VARCHAR(255)
);

INSERT INTO productos (nombre, descripcion, precio, categoria) VALUES
('Producto 1', 'Descripción del producto 1', 10.99, 'Categoría A'),
('Producto 2', 'Descripción del producto 2', 19.99, 'Categoría B');
SELECT * FROM carritos WHERE id = 1;
SELECT * FROM carrito_productos WHERE carrito_id = 1;



INSERT INTO carrito_productos (carrito_id, producto_id, cantidad) VALUES (1, 1, 2);


SELECT * FROM carritos;
CREATE TABLE carritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO carritos (usuario_id) VALUES (1);
INSERT INTO carritos (usuario_id) VALUES (2);

select * from carrito_productos;
CREATE TABLE carrito_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrito_id INT,
    producto_id INT,
    cantidad INT,
    FOREIGN KEY (carrito_id) REFERENCES carritos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

