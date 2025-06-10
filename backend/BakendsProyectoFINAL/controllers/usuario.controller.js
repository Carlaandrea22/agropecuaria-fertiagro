const getConnection = require('../db/connection');
const bcrypt = require('bcryptjs');

const getUsuarios = async (req, res) => {
  try {
    const connection = await getConnection();
    const [results] = await connection.query('SELECT * FROM usuario WHERE estado = 1');
    res.json(results);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios >w<' });
  }
};

const getUsuario = async (req, res) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    const [results] = await connection.query('SELECT * FROM usuario WHERE id = ? AND estado = 1', [id]);
    if (results.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado :c' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al buscar usuario unu' });
  }
};

const createUsuario = async (req, res) => {
  try {
    const connection = await getConnection();
    const {
      nombre, primerApellido, segundoApellido, correo,
      rol, telefono, imagen, contraseña
    } = req.body;

    if (!nombre || !primerApellido || !correo || !contraseña || !rol || !telefono) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios para crear el usuario' });
    }

    const rolesValidos = ['admin', 'vendedor', 'usuario'];
    if (!rolesValidos.includes(rol.toLowerCase())) {
      return res.status(400).json({ mensaje: 'Rol no válido' });
    }

    const hash = await bcrypt.hash(contraseña, 10);

    const [result] = await connection.query(`
      INSERT INTO usuario
      (nombre, primerApellido, segundoApellido, correo, rol, telefono, imagen, estado, contraseña)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `, [
      nombre, primerApellido, segundoApellido, correo,
      rol, telefono, imagen || null, hash
    ]);

    res.status(201).json({ mensaje: 'Usuario creado con ronroneos 💖✨', id: result.insertId });

  } catch (err) {
    console.error("❌ Error en createUsuario:", err);
    res.status(500).json({ mensaje: 'Error al crear usuario nyaaa' });
  }
};


const updateUsuario = async (req, res) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    const {
      nombre, primerApellido, segundoApellido, correo,
      rol, telefono, imagen, contraseña
    } = req.body;

    let query = 'UPDATE usuario SET ';
    const updates = [];
    const values = [];

    if (nombre) { updates.push('nombre = ?'); values.push(nombre); }
    if (primerApellido) { updates.push('primerApellido = ?'); values.push(primerApellido); }
    if (segundoApellido) { updates.push('segundoApellido = ?'); values.push(segundoApellido); }
    if (correo) { updates.push('correo = ?'); values.push(correo); }
    if (rol) { updates.push('rol = ?'); values.push(rol); }
    if (telefono) { updates.push('telefono = ?'); values.push(telefono); }
    if (imagen !== undefined) { updates.push('imagen = ?'); values.push(imagen); }
    if (contraseña) {
      const hash = await bcrypt.hash(contraseña, 10);
      updates.push('contraseña = ?');
      values.push(hash);
    }

    if (updates.length === 0) {
      return res.status(400).json({ mensaje: 'Nada que actualizar unu' });
    }

    query += updates.join(', ') + ' WHERE id = ?';
    values.push(id);

    await connection.query(query, values);
    res.json({ mensaje: 'Usuario actualizado con amorcito 💾💖' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar uwu' });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    await connection.query('UPDATE usuario SET estado = 0 WHERE id = ?', [id]);
    res.json({ mensaje: 'Usuario eliminado suavemente 🌸' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar ;w;' });
  }
};

module.exports = {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};