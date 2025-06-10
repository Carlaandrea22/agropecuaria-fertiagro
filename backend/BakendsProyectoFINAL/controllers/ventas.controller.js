const getConnection = require('../db/connection');
const PDFDocument = require('pdfkit');


exports.crearVenta = async (req, res) => {
  const { idVendedor, detalles } = req.body;

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    const [ventaResult] = await connection.query(
      'INSERT INTO venta (fechaVenta, estado, idVendedor) VALUES (NOW(), 1, ?)',
      [idVendedor]
    );

    const idVenta = ventaResult.insertId;

    const detalleQuery = `
      INSERT INTO detalleventa (idVenta, cantidad, precioUnitario, idProducto)
      VALUES ?
    `;

    const valores = detalles.map(d => [idVenta, d.cantidad, d.precioUnitario, d.idProducto]);

    await connection.query(detalleQuery, [valores]);

    await connection.commit();

    res.json({ mensaje: '¡Venta registrada exitosamente! 🛍️✨', idVenta });
  } catch (error) {
    await connection.rollback();
    console.error('💥 Error en transacción:', error);
    res.status(500).json({ mensaje: 'Error al registrar la venta unu' });
  }
};

exports.obtenerVentas = async (req, res) => {
  try {
    const connection = await getConnection();
    const [results] = await connection.query('SELECT * FROM venta WHERE estado = 1');
    res.json(results);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener ventas uwu' });
  }
};

exports.obtenerVentaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await getConnection();
    const [ventaResult] = await connection.query('SELECT * FROM venta WHERE id = ?', [id]);

    if (ventaResult.length === 0) return res.status(404).json({ mensaje: 'Venta no encontrada :c' });

    const [detalles] = await connection.query('SELECT * FROM detalleventa WHERE idVenta = ?', [id]);

    res.json({ ...ventaResult[0], detalles });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al buscar venta y detalles owo' });
  }
};

exports.eliminarVenta = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await getConnection();
    const [result] = await connection.query('UPDATE venta SET estado = 0 WHERE id = ?', [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Venta no encontrada para eliminar :c' });

    res.json({ mensaje: 'Venta eliminada suavemente (soft delete) 💫🗑️' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar la venta unu' });
  }
};

exports.obtenerTotales = async (req, res) => {
  try {
    const connection = await getConnection();
    const [dia] = await connection.query(`SELECT SUM(dv.cantidad * dv.precioUnitario) AS total FROM venta v JOIN detalleventa dv ON v.id = dv.idVenta WHERE DATE(v.fechaVenta) = CURDATE()`);
    const [semana] = await connection.query(`SELECT SUM(dv.cantidad * dv.precioUnitario) AS total FROM venta v JOIN detalleventa dv ON v.id = dv.idVenta WHERE YEARWEEK(v.fechaVenta, 1) = YEARWEEK(CURDATE(), 1)`);
    const [mes] = await connection.query(`SELECT SUM(dv.cantidad * dv.precioUnitario) AS total FROM venta v JOIN detalleventa dv ON v.id = dv.idVenta WHERE MONTH(v.fechaVenta) = MONTH(CURDATE()) AND YEAR(v.fechaVenta) = YEAR(CURDATE())`);
    
    res.json({
      total_dia: dia[0].total || 0,
      total_semana: semana[0].total || 0,
      total_mes: mes[0].total || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular totales de ventas' });
  }
};

exports.obtenerPorCategoria = async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT c.nombre AS categoria, SUM(dv.cantidad * dv.precioUnitario) AS total
      FROM venta v
      JOIN detalleventa dv ON v.id = dv.idVenta
      JOIN producto p ON dv.idProducto = p.id
      JOIN categoria c ON p.Categoria_id = c.id
      GROUP BY c.nombre
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al agrupar ventas por categoría' });
  }
};

exports.generarReporteVentas = async (req, res) => {
  const { desde, hasta, categoria, producto } = req.query;
  let query = `
    SELECT v.fechaVenta, p.nombre AS producto, c.nombre AS categoria,
           dv.cantidad, dv.precioUnitario,
           (dv.cantidad * dv.precioUnitario) AS total
    FROM venta v
    JOIN detalleventa dv ON v.id = dv.idVenta
    JOIN producto p ON dv.idProducto = p.id
    JOIN categoria c ON p.Categoria_id = c.id
    WHERE v.estado = 1
  `;
  const values = [];

  if (desde && hasta) {
    query += ' AND DATE(v.fechaVenta) BETWEEN ? AND ?';
    values.push(desde, hasta);
  }
  if (categoria) {
    query += ' AND c.id = ?';
    values.push(categoria);
  }
  if (producto) {
    query += ' AND p.id = ?';
    values.push(producto);
  }

  try {
    const connection = await getConnection();
    const [rows] = await connection.query(query, values);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el reporte' });
  }
};

exports.exportarReportePDF = async (req, res) => {
  try {
    const connection = await getConnection();

    const { desde, hasta, categoria, producto } = req.query;

    let query = `
      SELECT v.fechaVenta, p.nombre AS producto, c.nombre AS categoria,
             dv.cantidad, dv.precioUnitario,
             (dv.cantidad * dv.precioUnitario) AS total
      FROM venta v
      JOIN detalleventa dv ON v.id = dv.idVenta
      JOIN producto p ON dv.idProducto = p.id
      JOIN categoria c ON p.Categoria_id = c.id
      WHERE v.estado = 1
    `;

    const values = [];

    if (desde && hasta) {
      query += ' AND DATE(v.fechaVenta) BETWEEN ? AND ?';
      values.push(desde, hasta);
    }

    if (categoria) {
      query += ' AND c.id = ?';
      values.push(categoria);
    }

    if (producto) {
      query += ' AND p.id = ?';
      values.push(producto);
    }

    query += ' ORDER BY v.fechaVenta DESC';

    const [ventas] = await connection.query(query, values);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte_ventas.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Reporte de Ventas FertiAgro', { align: 'center' });
    doc.moveDown();

    ventas.forEach(v => {
      doc.fontSize(12).text(
        `📅 ${v.fechaVenta} | 📦 ${v.producto} | 🗂 ${v.categoria} | Cant: ${v.cantidad} | 💵 Bs. ${v.total.toFixed(2)}`
      );
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error("❌ Error generando PDF:", error);  // <- Agregado
    res.status(500).json({ error: 'Error al generar el PDF' });
  }
};

