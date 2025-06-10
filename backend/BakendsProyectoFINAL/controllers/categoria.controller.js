const getConnection = require('../db/connection');

exports.crearCategoria = async (req, res) => {
  try {
    const connection = await getConnection();
    const { nombre } = req.body;
    await connection.query('INSERT INTO categoria (nombre) VALUES (?)', [nombre]);
    res.json({ mensaje: 'Categoría creada con éxitooo! 🐾✨' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categoría unu' });
  }
};

exports.obtenerCategorias = async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM categoria');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron traer las categorías uwu' });
  }
};

exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    const [rows] = await connection.query('SELECT * FROM categoria WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada nwn' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la categoría unu' });
  }
};

exports.actualizarCategoria = async (req, res) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    const { nombre } = req.body;
    await connection.query('UPDATE categoria SET nombre = ? WHERE id = ?', [nombre, id]);
    res.json({ mensaje: 'Categoría actualizada con amorcito 💖' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar la categoría qwq' });
  }
};

exports.eliminarCategoria = async (req, res) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    await connection.query('DELETE FROM categoria WHERE id = ?', [id]);
    res.json({ mensaje: 'Categoría eliminada suavemente 💨✨' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar la categoría unu' });
  }
};