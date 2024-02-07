// banned/index.ts

import express from 'express';
import connection from '../../data/connection';

const router = express.Router();

router.post('/', (req, res) => {
  const { name, reason, roll_id } = req.body;
  const newBanned = { name, reason, roll_id };

  connection.query('INSERT INTO banned SET ?', newBanned, (error, results: any) => {
    if (error) {
      console.error('Error creating banned entry:', error);
      res.status(500).json({ error: 'Failed to create banned entry' });
    } else {
      res.status(201).json({ id: results.insertId, message: 'Banned entry created successfully' });
    }
  });
});

router.get('/', (_req, res) => {
  connection.query('SELECT * FROM banned', (error, results: any) => {
    if (error) {
      console.error('Error fetching banned entries:', error);
      res.status(500).json({ error: 'Failed to fetch banned entries' });
    } else {
      res.status(200).json(results);
    }
  });
});

router.get('/:id', (req, res) => {
  const bannedId = req.params.id;
  connection.query('SELECT * FROM banned WHERE id = ?', [bannedId], (error, results: any) => {
    if (error) {
      console.error('Error fetching banned entry:', error);
      res.status(500).json({ error: 'Failed to fetch banned entry' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

router.put('/:id', (req, res) => {
  const bannedId = req.params.id;
  const updatedBanned = req.body;

  connection.query('UPDATE banned SET ? WHERE id = ?', [updatedBanned, bannedId], (error) => {
    if (error) {
      console.error('Error updating banned entry:', error);
      res.status(500).json({ error: 'Failed to update banned entry' });
    } else {
      res.status(200).json({ message: 'Banned entry updated successfully' });
    }
  });
});

router.delete('/:id', (req, res) => {
  const bannedId = req.params.id;
  connection.query('DELETE FROM banned WHERE id = ?', [bannedId], (error) => {
    if (error) {
      console.error('Error deleting banned entry:', error);
      res.status(500).json({ error: 'Failed to delete banned entry' });
    } else {
      res.status(200).json({ message: 'Banned entry deleted successfully' });
    }
  });
});

export default router;
