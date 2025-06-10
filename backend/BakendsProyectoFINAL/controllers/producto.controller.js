const getConnection = require('../db/connection');

exports.crearProducto = async (req, res) => {
  try {
    const connection = await getConnection();
    const { nombre, precio, descripcion, stock, unidadDeMedida, imagen, Categoria_id } = req.body;
    await connection.query(`
      INSERT INTO producto 
      (nombre, precio, descripcion, stock, unidadDeMedida, imagen, Categoria_id, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `, [nombre, precio, descripcion, stock, unidadDeMedida, imagen, Categoria_id]);

    res.json({ mensaje: 'Producto creado con éxitooo nyaa~ 🎉🛍️' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear el producto qwq' });
  }
};

exports.obtenerProductos = async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM producto WHERE estado = 1');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al traer los productos unu' });
  }
};

exports.obtenerProductoPorId = async (req, res) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    const [rows] = await connection.query('SELECT * FROM producto WHERE id = ? AND estado = 1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado nwn' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el producto owo' });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    const { nombre, precio, descripcion, stock, unidadDeMedida, imagen, Categoria_id } = req.body;
    await connection.query(`
      UPDATE producto 
      SET nombre = ?, precio = ?, descripcion = ?, stock = ?, unidadDeMedida = ?, imagen = ?, Categoria_id = ?
      WHERE id = ?
    `, [nombre, precio, descripcion, stock, unidadDeMedida, imagen, Categoria_id, id]);

    res.json({ mensaje: 'Producto actualizado con amorcito 💖✨' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto unu' });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    await connection.query('UPDATE producto SET estado = 0 WHERE id = ?', [id]);
    res.json({ mensaje: 'Producto eliminado suavemente como un susurro de michi~ 🐱💤' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto uwu' });
  }






};

exports.obtenerMasVendidos = async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT p.id, p.nombre, SUM(si.cantidad) AS total_vendido
      FROM detalleventa si
      JOIN producto p ON si.idProducto = p.id
      GROUP BY si.idProducto
      ORDER BY total_vendido DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos más vendidos' });
  }
};

exports.obtenerStockBajo = async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM producto WHERE stock < 5 AND estado = 1');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos con bajo stock' });
  }
};

