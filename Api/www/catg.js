const express = require('express');
const router = express.Router();
const connection = require('../data/connection');

// Obtener todas las categorías
router.get('/', (req, res) => {
  connection.query('SELECT * FROM categorias', (error, results) => {
    if (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Crear una nueva categoría
router.post('/', (req, res) => {
  const { categoria_name } = req.body;

  if (!categoria_name) {
    return res.status(400).json({ error: 'Se requiere el campo categoria_name' });
  }

  // Verificar si ya existe una categoría con el mismo nombre (ignorando mayúsculas y minúsculas)
  connection.query('SELECT * FROM categorias WHERE LOWER(categoria_name) = LOWER(?)', [categoria_name], (selectError, selectResult) => {
    if (selectError) {
      console.error('Error al verificar existencia del nombre de categoría:', selectError);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (selectResult.length > 0) {
      return res.status(400).json({ error: 'Ya existe una categoría con el mismo nombre' });
    }

    // Insertar la nueva categoría si no existe una con el mismo nombre
    connection.query('INSERT INTO categorias (categoria_name) VALUES (?)', [categoria_name], (error, result) => {
      if (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(201).json({ message: 'Categoría creada exitosamente', id: result.insertId });
      }
    });
  });
});

// Actualizar una categoría por su ID
router.put('/:id', (req, res) => {
  const { categoria_name } = req.body;
  const id = req.params.id;

  if (!categoria_name) {
    return res.status(400).json({ error: 'Se requiere el campo categoria_name' });
  }

  // Verificar si ya existe otra categoría con el mismo nombre (ignorando mayúsculas y minúsculas)
  connection.query('SELECT * FROM categorias WHERE LOWER(categoria_name) = LOWER(?) AND id != ?', [categoria_name, id], (selectError, selectResult) => {
    if (selectError) {
      console.error('Error al verificar existencia del nombre de categoría:', selectError);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (selectResult.length > 0) {
      return res.status(400).json({ error: 'Ya existe otra categoría con el mismo nombre' });
    }

    // Actualizar la categoría si no existe otra con el mismo nombre
    connection.query('UPDATE categorias SET categoria_name = ? WHERE id = ?', [categoria_name, id], (updateError, updateResult) => {
      if (updateError) {
        console.error('Error al actualizar categoría:', updateError);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Categoría actualizada exitosamente' });
      }
    });
  });
});

// Eliminar una categoría por su ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  connection.query('SELECT * FROM categorias WHERE id = ?', [id], (selectError, selectResult) => {
    if (selectError) {
      console.error('Error al verificar existencia del ID:', selectError);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'No se encontró la categoría con el ID especificado' });
    }

    connection.query('DELETE FROM categorias WHERE id = ?', [id], (deleteError, deleteResult) => {
      if (deleteError) {
        console.error('Error al eliminar categoría:', deleteError);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Categoría eliminada exitosamente' });
      }
    });
  });
});

module.exports = router;
