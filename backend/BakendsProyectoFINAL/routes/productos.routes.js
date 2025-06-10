const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');


router.get('/mas-vendidos', productoController.obtenerMasVendidos);

router.get('/stock-bajo', productoController.obtenerStockBajo);

// Crear
router.post('/', productoController.crearProducto);

// Leer todos (solo activos)
router.get('/', productoController.obtenerProductos);

// Leer uno por ID
router.get('/:id', productoController.obtenerProductoPorId);

// Actualizar
router.put('/:id', productoController.actualizarProducto);

// Eliminar (cambio de estado)
router.delete('/:id', productoController.eliminarProducto);



module.exports = router;
