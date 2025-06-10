const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventas.controller');


router.get('/totales', ventasController.obtenerTotales);
router.get('/por-categoria', ventasController.obtenerPorCategoria);
router.get('/reporte', ventasController.generarReporteVentas); // 🔍 con filtros
router.get('/reporte/pdf', ventasController.exportarReportePDF); // 📄 exportar a PDF


router.post('/', ventasController.crearVenta);
router.get('/', ventasController.obtenerVentas);
router.get('/:id', ventasController.obtenerVentaPorId);
router.delete('/:id', ventasController.eliminarVenta);



module.exports = router;
