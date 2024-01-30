const express = require('express');
const router = express.Router();
const connection = require('../data/connection');

// Obtener todos los baneados
router.get('/', (req, res) => {
  connection.query('SELECT * FROM baneados', (error, results) => {
    if (error) {
      console.error('Error al obtener baneados:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Crear un nuevo baneado
router.post('/', (req, res) => {
  const { contador, usuario } = req.body;

  if (!contador || !usuario) {
    return res.status(400).json({ error: 'Se requieren todos los campos: contador y usuario' });
  }

  connection.query('INSERT INTO baneados (contador, usuario) VALUES (?, ?)', [contador, usuario], (error, result) => {
    if (error) {
      console.error('Error al crear baneado:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(201).json({ message: 'Baneado creado exitosamente', id: result.insertId });
    }
  });
});

// Actualizar un baneado por su ID
router.put('/:id', (req, res) => {
  const { contador, usuario } = req.body;
  const id = req.params.id;

  if (!contador || !usuario) {
    return res.status(400).json({ error: 'Se requieren todos los campos: contador y usuario' });
  }

  connection.query('SELECT * FROM baneados WHERE id = ?', [id], (selectError, selectResult) => {
    if (selectError) {
      console.error('Error al verificar existencia del ID:', selectError);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'No se encontró el baneado con el ID especificado' });
    }

    connection.query('UPDATE baneados SET contador = ?, usuario = ? WHERE id = ?', [contador, usuario, id], (updateError, updateResult) => {
      if (updateError) {
        console.error('Error al actualizar baneado:', updateError);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Baneado actualizado exitosamente' });
      }
    });
  });
});

// Eliminar un baneado por su ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  connection.query('SELECT * FROM baneados WHERE id = ?', [id], (selectError, selectResult) => {
    if (selectError) {
      console.error('Error al verificar existencia del ID:', selectError);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    

    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'No se encontró el baneado con el ID especificado' });
    }

    connection.query('DELETE FROM baneados WHERE id = ?', [id], (deleteError, deleteResult) => {
      if (deleteError) {
        console.error('Error al eliminar baneado:', deleteError);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Baneado eliminado exitosamente' });
      }
    });
  });
});

module.exports = router;
