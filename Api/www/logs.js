const express = require('express');
const router = express.Router();
const connection = require('../data/connection');

// Obtener todos los logs
router.get('/', (req, res) => {
  connection.query('SELECT * FROM logs', (error, results) => {
    if (error) {
      console.error('Error al obtener logs:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Crear un nuevo log
router.post('/', (req, res) => {
  const { fecha_hora, metodo, ip, pais, tipo_solicitud, endpoint, parametros, respuesta, usuario_id, detalles_adicionales } = req.body;

  if (!fecha_hora || !metodo || !ip || !pais || !tipo_solicitud || !endpoint || !parametros || !respuesta || !usuario_id || !detalles_adicionales) {
    return res.status(400).json({ error: 'Se requieren todos los campos' });
  }

  connection.query(
    'INSERT INTO logs (fecha_hora, metodo, ip, pais, tipo_solicitud, endpoint, parametros, respuesta, usuario_id, detalles_adicionales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [fecha_hora, metodo, ip, pais, tipo_solicitud, endpoint, parametros, respuesta, usuario_id, detalles_adicionales],
    (error, result) => {
      if (error) {
        console.error('Error al crear log:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(201).json({ message: 'Log creado exitosamente', id: result.insertId });
      }
    }
  );
});

// Actualizar un log por su ID
router.put('/:id', (req, res) => {
  const { fecha_hora, metodo, ip, pais, tipo_solicitud, endpoint, parametros, respuesta, usuario_id, detalles_adicionales } = req.body;
  const id = req.params.id;

  if (!fecha_hora || !metodo || !ip || !pais || !tipo_solicitud || !endpoint || !parametros || !respuesta || !usuario_id || !detalles_adicionales) {
    return res.status(400).json({ error: 'Se requieren todos los campos' });
  }

  connection.query('UPDATE logs SET fecha_hora = ?, metodo = ?, ip = ?, pais = ?, tipo_solicitud = ?, endpoint = ?, parametros = ?, respuesta = ?, usuario_id = ?, detalles_adicionales = ? WHERE id = ?',
    [fecha_hora, metodo, ip, pais, tipo_solicitud, endpoint, parametros, respuesta, usuario_id, detalles_adicionales, id],
    (error, result) => {
      if (error) {
        console.error('Error al actualizar log:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Log actualizado exitosamente' });
      }
    });
});

// Eliminar un log por su ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  connection.query('DELETE FROM logs WHERE id = ?', [id], (error, result) => {
    if (error) {
      console.error('Error al eliminar log:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json({ message: 'Log eliminado exitosamente' });
    }
  });
});

module.exports = router;
