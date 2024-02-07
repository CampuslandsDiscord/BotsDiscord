// user/index.ts

import express from 'express';
import connection from '../../data/connection'; // Cambiar la extensión a '.js'

const router = express.Router();

// Create a new user
router.post('/', (req, res) => {
  const { name, cycle_id, banned_id, warning_id } = req.body;
  const newUser = { name, cycle_id, banned_id, warning_id };

  connection.query('INSERT INTO user SET ?', newUser, (error, results: any) => { 
    if (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    } else {
      res.status(201).json({ id: results.insertId, message: 'User created successfully' });
    }
  });
});

// Get all users
router.get('/', (_req, res) => {
  connection.query('SELECT * FROM user', (error, results: any) => {
    if (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Get user by ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  connection.query('SELECT * FROM user WHERE id = ?', [userId], (error, results: any) => { 
    if (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// Update user by ID
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  connection.query('UPDATE user SET ? WHERE id = ?', [updatedUser, userId], (error) => {
    if (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    } else {
      res.status(200).json({ message: 'User updated successfully' });
    }
  });
});

// Delete user by ID
router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  connection.query('DELETE FROM user WHERE id = ?', [userId], (error) => {
    if (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  });
});

export default router;
