// warning/index.ts

import express from 'express';
import connection from '../../data/connection'; // Cambiar la extensión a '.js'

const router = express.Router();

// Create a new warning
router.post('/', (req, res) => {
  const { name, reason, message_count, roll_id } = req.body;
  const newWarning = { name, reason, message_count, roll_id };

  connection.query('INSERT INTO warning SET ?', newWarning, (error, results: any) => { // Especificar 'any' como tipo para 'results'
    if (error) {
      console.error('Error creating warning:', error);
      res.status(500).json({ error: 'Failed to create warning' });
    } else {
      res.status(201).json({ id: results.insertId, message: 'Warning created successfully' });
    }
  });
});

// Get all warnings
router.get('/', (_req, res) => { // Usar _req ya que no estamos usando la solicitud
  connection.query('SELECT * FROM warning', (error, results: any) => { // Especificar 'any' como tipo para 'results'
    if (error) {
      console.error('Error fetching warnings:', error);
      res.status(500).json({ error: 'Failed to fetch warnings' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Get warning by ID
router.get('/:id', (req, res) => {
  const warningId = req.params.id;
  connection.query('SELECT * FROM warning WHERE id = ?', [warningId], (error, results: any) => { // Especificar 'any' como tipo para 'results'
    if (error) {
      console.error('Error fetching warning:', error);
      res.status(500).json({ error: 'Failed to fetch warning' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// Update warning by ID
router.put('/:id', (req, res) => {
  const warningId = req.params.id;
  const updatedWarning = req.body;

  connection.query('UPDATE warning SET ? WHERE id = ?', [updatedWarning, warningId], (error) => {
    if (error) {
      console.error('Error updating warning:', error);
      res.status(500).json({ error: 'Failed to update warning' });
    } else {
      res.status(200).json({ message: 'Warning updated successfully' });
    }
  });
});

// Delete warning by ID
router.delete('/:id', (req, res) => {
  const warningId = req.params.id;
  connection.query('DELETE FROM warning WHERE id = ?', [warningId], (error) => {
    if (error) {
      console.error('Error deleting warning:', error);
      res.status(500).json({ error: 'Failed to delete warning' });
    } else {
      res.status(200).json({ message: 'Warning deleted successfully' });
    }
  });
});

export default router;
