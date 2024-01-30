const express = require('express');
const router = express.Router();
const connection = require('../data/connection');

// Obtener todos los roles
router.get('/', (req, res) => {
  connection.query('SELECT * FROM roles', (error, results) => {
    if (error) {
      console.error('Error al obtener roles:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Crear un nuevo rol
router.post('/', (req, res) => {
  const { nombre, rol_id, categoria_id } = req.body;

  if (!nombre || !rol_id || !categoria_id) {
    return res.status(400).json({ error: 'Se requieren todos los campos: nombre, rol_id y categoria_id' });
  }

  connection.query('INSERT INTO roles (nombre, rol_id, categoria_id) VALUES (?, ?, ?)', [nombre, rol_id, categoria_id], (error, result) => {
    if (error) {
      console.error('Error al crear rol:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(201).json({ message: 'Rol creado exitosamente', id: result.insertId });
    }
  });
});

// Actualizar un rol por su ID
router.put('/:id', (req, res) => {
  const { nombre, rol_id, categoria_id } = req.body;
  const id = req.params.id;

  if (!nombre || !rol_id || !categoria_id) {
    return res.status(400).json({ error: 'Se requieren todos los campos: nombre, rol_id y categoria_id' });
  }

  connection.query('SELECT * FROM roles WHERE id = ?', [id], (selectError, selectResult) => {
    if (selectError) {
      console.error('Error al verificar existencia del ID:', selectError);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'No se encontró el rol con el ID especificado' });
    }

    connection.query('UPDATE roles SET nombre = ?, rol_id = ?, categoria_id = ? WHERE id = ?', [nombre, rol_id, categoria_id, id], (updateError, updateResult) => {
      if (updateError) {
        console.error('Error al actualizar rol:', updateError);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Rol actualizado exitosamente' });
      }
    });
  });
});

// Eliminar un rol por su ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  connection.query('SELECT * FROM roles WHERE id = ?', [id], (selectError, selectResult) => {
    if (selectError) {
      console.error('Error al verificar existencia del ID:', selectError);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'No se encontró el rol con el ID especificado' });
    }

    connection.query('DELETE FROM roles WHERE id = ?', [id], (deleteError, deleteResult) => {
      if (deleteError) {
        console.error('Error al eliminar rol:', deleteError);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Rol eliminado exitosamente' });
      }
    });
  });
});

module.exports = router;
