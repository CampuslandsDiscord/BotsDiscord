// cycle/index.ts

import express from 'express';
import connection from '../../data/connection';

const router = express.Router();

router.post('/', (req, res) => {
  const { name } = req.body;
  const newCycle = { name };

  connection.query('INSERT INTO cycle SET ?', newCycle, (error, results: any) => { 
    if (error) {
      console.error('Error creating cycle:', error);
      res.status(500).json({ error: 'Failed to create cycle' });
    } else {
      res.status(201).json({ id: results.insertId, message: 'Cycle created successfully' });
    }
  });
});

router.get('/', (_req, res) => {
  connection.query('SELECT * FROM cycle', (error, results: any) => { 
    if (error) {
      console.error('Error fetching cycles:', error);
      res.status(500).json({ error: 'Failed to fetch cycles' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Get cycle by ID
router.get('/:id', (req, res) => {
  const cycleId = req.params.id;
  connection.query('SELECT * FROM cycle WHERE id = ?', [cycleId], (error, results: any) => { 
    if (error) {
      console.error('Error fetching cycle:', error);
      res.status(500).json({ error: 'Failed to fetch cycle' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

router.put('/:id', (req, res) => {
  const cycleId = req.params.id;
  const updatedCycle = req.body;

  connection.query('UPDATE cycle SET ? WHERE id = ?', [updatedCycle, cycleId], (error) => {
    if (error) {
      console.error('Error updating cycle:', error);
      res.status(500).json({ error: 'Failed to update cycle' });
    } else {
      res.status(200).json({ message: 'Cycle updated successfully' });
    }
  });
});

router.delete('/:id', (req, res) => {
  const cycleId = req.params.id;
  connection.query('DELETE FROM cycle WHERE id = ?', [cycleId], (error) => {
    if (error) {
      console.error('Error deleting cycle:', error);
      res.status(500).json({ error: 'Failed to delete cycle' });
    } else {
      res.status(200).json({ message: 'Cycle deleted successfully' });
    }
  });
});

export default router;
