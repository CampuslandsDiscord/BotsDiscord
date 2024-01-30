const express = require('express');
const router = express.Router();
const connection = require('../data/connection');

// Obtener todos los canales
router.get('/', (req, res) => {
  connection.query('SELECT * FROM canales', (error, results) => {
    if (error) {
      console.error('Error al obtener canales:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Crear un nuevo canal
router.post('/', (req, res) => {
  const { nombre, canales_id } = req.body;

  if (!nombre || !canales_id) {
    return res.status(400).json({ error: 'Se requieren todos los campos: nombre y canales_id' });
  }

  connection.beginTransaction((transactionError) => {
    if (transactionError) {
      console.error('Error al iniciar transacción:', transactionError);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    // Realizar la inserción en la tabla canales
    connection.query('INSERT INTO canales (nombre, canales_id) VALUES (?, ?)', [nombre, canales_id], (error, result) => {
      if (error) {
        console.error('Error al crear canal:', error);
        connection.rollback(() => {
          res.status(500).json({ error: 'Error interno del servidor' });
        });
      } else {
        const canalId = result.insertId;

        // Registrar la operación en la tabla logs
        connection.query('INSERT INTO logs (metodo, endpoint, detalles_adicionales) VALUES (?, ?, ?)',
          ['POST', '/canales', `Canal creado con ID: ${canalId}`],
          (logError) => {
            if (logError) {
              console.error('Error al registrar en logs:', logError);
              connection.rollback(() => {
                res.status(500).json({ error: 'Error interno del servidor' });
              });
            } else {
              connection.commit((commitError) => {
                if (commitError) {
                  console.error('Error al hacer commit:', commitError);
                  connection.rollback(() => {
                    res.status(500).json({ error: 'Error interno del servidor' });
                  });
                } else {
                  res.status(201).json({ message: 'Canal creado exitosamente', id: canalId });
                }
              });
            }
          });
      }
    });
  });
});

// Actualizar un canal por su ID
router.put('/:id', (req, res) => {
  const { nombre, canales_id } = req.body;
  const id = req.params.id;

  if (!nombre || !canales_id) {
    return res.status(400).json({ error: 'Se requieren todos los campos: nombre y canales_id' });
  }

  connection.query('SELECT * FROM canales WHERE id = ?', [id], (selectError, selectResult) => {
    if (selectError) {
      console.error('Error al verificar existencia del ID:', selectError);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'No se encontró el canal con el ID especificado' });
    }

    connection.query('UPDATE canales SET nombre = ?, canales_id = ? WHERE id = ?', [nombre, canales_id, id], (updateError, updateResult) => {
      if (updateError) {
        console.error('Error al actualizar canal:', updateError);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Canal actualizado exitosamente' });
      }
    });
  });
});

// Eliminar un canal por su ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  connection.query('SELECT * FROM canales WHERE id = ?', [id], (selectError, selectResult) => {
    if (selectError) {
      console.error('Error al verificar existencia del ID:', selectError);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'No se encontró el canal con el ID especificado' });
    }

    connection.query('DELETE FROM canales WHERE id = ?', [id], (deleteError, deleteResult) => {
      if (deleteError) {
        console.error('Error al eliminar canal:', deleteError);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Canal eliminado exitosamente' });
      }
    });
  });
});

module.exports = router;
