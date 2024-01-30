const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const connection = require('./data/connection');

const warnRoutes = require('./www/warn');
const banRoutes = require('./www/ban');
const catRoutes = require('./www/catg');
const rolsRoutes = require('./www/rols');
const logsRoutes = require('./www/logs');
const chanlsRoutes = require('./www/canales');

app.use('/warn', warnRoutes);
app.use('/ban', banRoutes);
app.use('/categorias', catRoutes);
app.use('/roles', rolsRoutes);
app.use('/logs', logsRoutes);
app.use('/canales', chanlsRoutes);

app.listen(port, () => {
  console.log(`La API está escuchando en http://localhost:${port}`);
});