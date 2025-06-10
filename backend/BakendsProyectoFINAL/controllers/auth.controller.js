const getConnection = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'BACKENDKEYEST1234567890';

const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: 'Faltan datos, uwu!' });
  }

  try {
    const connection = await getConnection();
    const [results] = await connection.query(
      'SELECT * FROM usuario WHERE correo = ? AND estado = 1',
      [correo]
    );

    if (results.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado >w<' });
    }

    const usuario = results[0];
    const match = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!match) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta unu' });
    }

    delete usuario.contraseña;

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.status(200).json({ mensaje: '¡Login exitoso! 🎉🐾', usuario, token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno :c' });
  }
};

module.exports = { login };