const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Get all resumes for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [resumes] = await pool.execute(
      'SELECT * FROM resumes WHERE user_id = ? ORDER BY updated_at DESC',
      [req.user.id]
    );

    res.json({ resumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Failed to get resumes' });
  }
});

// Get single resume
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [resumes] = await pool.execute(
      'SELECT * FROM resumes WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (resumes.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ resume: resumes[0] });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Failed to get resume' });
  }
});

// Create new resume
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, template_name, content, is_public } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO resumes (user_id, title, template_name, content, is_public) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, template_name, JSON.stringify(content), is_public || false]
    );

    res.status(201).json({
      message: 'Resume created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

// Update resume
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, template_name, content, is_public } = req.body;

    await pool.execute(
      'UPDATE resumes SET title = ?, template_name = ?, content = ?, is_public = ? WHERE id = ? AND user_id = ?',
      [title, template_name, JSON.stringify(content), is_public, id, req.user.id]
    );

    res.json({ message: 'Resume updated successfully' });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

// Delete resume
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'DELETE FROM resumes WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

// Get public resume (for sharing)
router.get('/public/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [resumes] = await pool.execute(
      'SELECT * FROM resumes WHERE id = ? AND is_public = TRUE',
      [id]
    );

    if (resumes.length === 0) {
      return res.status(404).json({ error: 'Resume not found or not public' });
    }

    res.json({ resume: resumes[0] });
  } catch (error) {
    console.error('Get public resume error:', error);
    res.status(500).json({ error: 'Failed to get resume' });
  }
});

// Duplicate resume
router.post('/:id/duplicate', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Get original resume
    const [resumes] = await pool.execute(
      'SELECT * FROM resumes WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (resumes.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const originalResume = resumes[0];

    // Create duplicate
    const [result] = await pool.execute(
      'INSERT INTO resumes (user_id, title, template_name, content, is_public) VALUES (?, ?, ?, ?, ?)',
      [
        req.user.id,
        title || `${originalResume.title} (Copy)`,
        originalResume.template_name,
        originalResume.content,
        false
      ]
    );

    res.status(201).json({
      message: 'Resume duplicated successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Duplicate resume error:', error);
    res.status(500).json({ error: 'Failed to duplicate resume' });
  }
});

module.exports = router; 