const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const categoriaRoutes = require('./routes/categorias.routes');
const productosRoutes = require('./routes/productos.routes');
const ventasRoutes = require('./routes/ventas.routes');
const qrRoutes = require('./routes/qr.routes');



const { verificarToken, permisosRoles } = require('./middlewares/auth');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/login', authRoutes);
// Aquí protegemos todas las rutas para que sólo usuarios autenticados puedan entrar
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/qr', qrRoutes);

app.listen(4000, () => {
  console.log('Servidor kawaii escuchando en puerto 4000 🐾✨');
});
