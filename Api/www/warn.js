const express = require('express');
const router = express.Router();
const connection = require('../data/connection');

// Obtener todas las advertencias
router.get('/', (req, res) => {
  connection.query('SELECT * FROM advertencias', (error, results) => {
    if (error) {
      console.error('Error al obtener advertencias:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Crear una nueva advertencia
router.post('/', (req, res) => {
  const { contador, usuario } = req.body;

  if (!contador || !usuario) {
    return res.status(400).json({ error: 'Se requieren todos los campos: contador y usuario' });
  }

  connection.query('INSERT INTO advertencias (contador, usuario) VALUES (?, ?)', [contador, usuario], (error, result) => {
    if (error) {
      console.error('Error al crear advertencia:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(201).json({ message: 'Advertencia creada exitosamente', id: result.insertId });
    }
  });
});

// Actualizar una advertencia por su ID
router.put('/:id', (req, res) => {
  const { contador, usuario } = req.body;
  const id = req.params.id;

  if (!contador || !usuario) {
    return res.status(400).json({ error: 'Se requieren todos los campos: contador y usuario' });
  }

  connection.query('SELECT * FROM advertencias WHERE id = ?', [id], (selectError, selectResult) => {
    if (selectError) {
      console.error('Error al verificar existencia del ID:', selectError);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'No se encontró la advertencia con el ID especificado' });
    }

    connection.query('UPDATE advertencias SET contador = ?, usuario = ? WHERE id = ?', [contador, usuario, id], (updateError, updateResult) => {
      if (updateError) {
        console.error('Error al actualizar advertencia:', updateError);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Advertencia actualizada exitosamente' });
      }
    });
  });
});

// Eliminar una advertencia por su ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  connection.query('SELECT * FROM advertencias WHERE id = ?', [id], (selectError, selectResult) => {
    if (selectError) {
      console.error('Error al verificar existencia del ID:', selectError);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'No se encontró la advertencia con el ID especificado' });
    }

    connection.query('DELETE FROM advertencias WHERE id = ?', [id], (deleteError, deleteResult) => {
      if (deleteError) {
        console.error('Error al eliminar advertencia:', deleteError);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Advertencia eliminada exitosamente' });
      }
    });
  });
});

module.exports = router;
