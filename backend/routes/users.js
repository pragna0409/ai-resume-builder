const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [profiles] = await pool.execute(
      `SELECT up.*, u.email, u.first_name, u.last_name, u.phone, u.profile_picture
       FROM user_profiles up
       JOIN users u ON up.user_id = u.id
       WHERE up.user_id = ?`,
      [req.user.id]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile: profiles[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const {
      headline,
      summary,
      location,
      website,
      linkedin_url,
      github_url,
      years_of_experience,
      current_salary,
      desired_salary
    } = req.body;

    await pool.execute(
      `UPDATE user_profiles SET
       headline = ?, summary = ?, location = ?, website = ?,
       linkedin_url = ?, github_url = ?, years_of_experience = ?,
       current_salary = ?, desired_salary = ?
       WHERE user_id = ?`,
      [
        headline, summary, location, website, linkedin_url,
        github_url, years_of_experience, current_salary, desired_salary, req.user.id
      ]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user education
router.get('/education', authenticateToken, async (req, res) => {
  try {
    const [education] = await pool.execute(
      'SELECT * FROM education WHERE user_id = ? ORDER BY start_date DESC',
      [req.user.id]
    );

    res.json({ education });
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ error: 'Failed to get education' });
  }
});

// Add education
router.post('/education', authenticateToken, async (req, res) => {
  try {
    const {
      institution,
      degree,
      field_of_study,
      start_date,
      end_date,
      gpa,
      description
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO education (user_id, institution, degree, field_of_study, start_date, end_date, gpa, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, institution, degree, field_of_study, start_date, end_date, gpa, description]
    );

    res.status(201).json({
      message: 'Education added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ error: 'Failed to add education' });
  }
});

// Update education
router.put('/education/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      institution,
      degree,
      field_of_study,
      start_date,
      end_date,
      gpa,
      description
    } = req.body;

    await pool.execute(
      `UPDATE education SET
       institution = ?, degree = ?, field_of_study = ?, start_date = ?,
       end_date = ?, gpa = ?, description = ?
       WHERE id = ? AND user_id = ?`,
      [institution, degree, field_of_study, start_date, end_date, gpa, description, id, req.user.id]
    );

    res.json({ message: 'Education updated successfully' });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ error: 'Failed to update education' });
  }
});

// Delete education
router.delete('/education/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'DELETE FROM education WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ error: 'Failed to delete education' });
  }
});

// Get work experience
router.get('/experience', authenticateToken, async (req, res) => {
  try {
    const [experience] = await pool.execute(
      'SELECT * FROM work_experience WHERE user_id = ? ORDER BY start_date DESC',
      [req.user.id]
    );

    res.json({ experience });
  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({ error: 'Failed to get experience' });
  }
});

// Add work experience
router.post('/experience', authenticateToken, async (req, res) => {
  try {
    const {
      company_name,
      job_title,
      location,
      start_date,
      end_date,
      is_current_job,
      description,
      achievements
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO work_experience (user_id, company_name, job_title, location, start_date, end_date, is_current_job, description, achievements)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, company_name, job_title, location, start_date, end_date, is_current_job, description, achievements]
    );

    res.status(201).json({
      message: 'Work experience added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({ error: 'Failed to add work experience' });
  }
});

// Update work experience
router.put('/experience/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company_name,
      job_title,
      location,
      start_date,
      end_date,
      is_current_job,
      description,
      achievements
    } = req.body;

    await pool.execute(
      `UPDATE work_experience SET
       company_name = ?, job_title = ?, location = ?, start_date = ?,
       end_date = ?, is_current_job = ?, description = ?, achievements = ?
       WHERE id = ? AND user_id = ?`,
      [company_name, job_title, location, start_date, end_date, is_current_job, description, achievements, id, req.user.id]
    );

    res.json({ message: 'Work experience updated successfully' });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Failed to update work experience' });
  }
});

// Delete work experience
router.delete('/experience/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'DELETE FROM work_experience WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    res.json({ message: 'Work experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Failed to delete work experience' });
  }
});

module.exports = router; 