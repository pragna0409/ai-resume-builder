const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const [skills] = await pool.execute(
      'SELECT * FROM skills ORDER BY category, name'
    );

    res.json({ skills });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Failed to get skills' });
  }
});

// Get skills by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;

    const [skills] = await pool.execute(
      'SELECT * FROM skills WHERE category = ? ORDER BY name',
      [category]
    );

    res.json({ skills });
  } catch (error) {
    console.error('Get skills by category error:', error);
    res.status(500).json({ error: 'Failed to get skills' });
  }
});

// Get user skills
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const [userSkills] = await pool.execute(
      `SELECT us.*, s.name, s.category
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ?
       ORDER BY s.category, s.name`,
      [req.user.id]
    );

    res.json({ userSkills });
  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({ error: 'Failed to get user skills' });
  }
});

// Add skill to user
router.post('/user', authenticateToken, async (req, res) => {
  try {
    const { skill_id, proficiency_level, years_of_experience } = req.body;

    // Check if skill exists
    const [skills] = await pool.execute(
      'SELECT id FROM skills WHERE id = ?',
      [skill_id]
    );

    if (skills.length === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Check if user already has this skill
    const [existingSkills] = await pool.execute(
      'SELECT id FROM user_skills WHERE user_id = ? AND skill_id = ?',
      [req.user.id, skill_id]
    );

    if (existingSkills.length > 0) {
      return res.status(400).json({ error: 'Skill already added' });
    }

    const [result] = await pool.execute(
      'INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_of_experience) VALUES (?, ?, ?, ?)',
      [req.user.id, skill_id, proficiency_level || 'intermediate', years_of_experience || 0]
    );

    res.status(201).json({
      message: 'Skill added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Add user skill error:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

// Update user skill
router.put('/user/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { proficiency_level, years_of_experience, is_verified } = req.body;

    await pool.execute(
      'UPDATE user_skills SET proficiency_level = ?, years_of_experience = ?, is_verified = ? WHERE id = ? AND user_id = ?',
      [proficiency_level, years_of_experience, is_verified, id, req.user.id]
    );

    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    console.error('Update user skill error:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// Remove skill from user
router.delete('/user/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'DELETE FROM user_skills WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    res.json({ message: 'Skill removed successfully' });
  } catch (error) {
    console.error('Remove user skill error:', error);
    res.status(500).json({ error: 'Failed to remove skill' });
  }
});

// Search skills
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const [skills] = await pool.execute(
      'SELECT * FROM skills WHERE name LIKE ? OR category LIKE ? ORDER BY name LIMIT 20',
      [`%${q}%`, `%${q}%`]
    );

    res.json({ skills });
  } catch (error) {
    console.error('Search skills error:', error);
    res.status(500).json({ error: 'Failed to search skills' });
  }
});

// Get skill statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get user's skill count by category
    const [categoryStats] = await pool.execute(
      `SELECT s.category, COUNT(us.id) as count
       FROM skills s
       LEFT JOIN user_skills us ON s.id = us.skill_id AND us.user_id = ?
       GROUP BY s.category
       ORDER BY count DESC`,
      [req.user.id]
    );

    // Get proficiency level distribution
    const [proficiencyStats] = await pool.execute(
      `SELECT proficiency_level, COUNT(*) as count
       FROM user_skills
       WHERE user_id = ?
       GROUP BY proficiency_level`,
      [req.user.id]
    );

    // Get verified skills count
    const [verifiedCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM user_skills WHERE user_id = ? AND is_verified = TRUE',
      [req.user.id]
    );

    res.json({
      categoryStats,
      proficiencyStats,
      verifiedSkills: verifiedCount[0].count
    });
  } catch (error) {
    console.error('Get skill stats error:', error);
    res.status(500).json({ error: 'Failed to get skill statistics' });
  }
});

module.exports = router; 