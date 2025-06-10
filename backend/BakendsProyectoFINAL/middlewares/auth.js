const jwt = require('jsonwebtoken');
const SECRET_KEY = 'BACKENDKEYEST1234567890'; // Cambia esto por algo más secreto y largo

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ mensaje: 'No autorizado, faltó el token uwu!' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: 'No autorizado, token inválido unu' });

  jwt.verify(token, SECRET_KEY, (err, usuario) => {
    if (err) return res.status(403).json({ mensaje: 'Token expirado o inválido :c' });
    req.usuario = usuario;
    next();
  });
}

function permisosRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para esta acción uwu' });
    }
    next();
  };
}

module.exports = { verificarToken, permisosRoles };
