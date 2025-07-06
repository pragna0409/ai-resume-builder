const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Get all job postings
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, location, job_type, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT jp.*, 
             GROUP_CONCAT(s.name) as required_skills
      FROM job_postings jp
      LEFT JOIN job_skills js ON jp.id = js.job_id
      LEFT JOIN skills s ON js.skill_id = s.id
      WHERE jp.is_active = TRUE
    `;
    
    const params = [];

    if (location) {
      query += ' AND jp.location LIKE ?';
      params.push(`%${location}%`);
    }

    if (job_type) {
      query += ' AND jp.job_type = ?';
      params.push(job_type);
    }

    if (search) {
      query += ' AND (jp.job_title LIKE ? OR jp.company_name LIKE ? OR jp.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY jp.id ORDER BY jp.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [jobs] = await pool.execute(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM job_postings WHERE is_active = TRUE';
    const countParams = [];

    if (location) {
      countQuery += ' AND location LIKE ?';
      countParams.push(`%${location}%`);
    }

    if (job_type) {
      countQuery += ' AND job_type = ?';
      countParams.push(job_type);
    }

    if (search) {
      countQuery += ' AND (job_title LIKE ? OR company_name LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
});

// Get single job posting
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [jobs] = await pool.execute(
      `SELECT jp.*, 
              GROUP_CONCAT(s.name) as required_skills,
              GROUP_CONCAT(s.id) as skill_ids
       FROM job_postings jp
       LEFT JOIN job_skills js ON jp.id = js.job_id
       LEFT JOIN skills s ON js.skill_id = s.id
       WHERE jp.id = ? AND jp.is_active = TRUE
       GROUP BY jp.id`,
      [id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job: jobs[0] });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to get job' });
  }
});

// Apply for a job
router.post('/:id/apply', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { resume_id, cover_letter } = req.body;

    // Check if job exists
    const [jobs] = await pool.execute(
      'SELECT * FROM job_postings WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user already applied
    const [existingApplications] = await pool.execute(
      'SELECT id FROM user_job_applications WHERE user_id = ? AND job_id = ?',
      [req.user.id, id]
    );

    if (existingApplications.length > 0) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    // Create application
    const [result] = await pool.execute(
      'INSERT INTO user_job_applications (user_id, job_id, resume_id, cover_letter) VALUES (?, ?, ?, ?)',
      [req.user.id, id, resume_id, cover_letter]
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      application_id: result.insertId
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get user's job applications
router.get('/user/applications', authenticateToken, async (req, res) => {
  try {
    const [applications] = await pool.execute(
      `SELECT uja.*, jp.job_title, jp.company_name, jp.location, jp.job_type,
              r.title as resume_title
       FROM user_job_applications uja
       JOIN job_postings jp ON uja.job_id = jp.id
       LEFT JOIN resumes r ON uja.resume_id = r.id
       WHERE uja.user_id = ?
       ORDER BY uja.applied_at DESC`,
      [req.user.id]
    );

    res.json({ applications });
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ error: 'Failed to get applications' });
  }
});

// Get recommended jobs for user
router.get('/user/recommendations', authenticateToken, async (req, res) => {
  try {
    // Get user's skills
    const [userSkills] = await pool.execute(
      'SELECT skill_id FROM user_skills WHERE user_id = ?',
      [req.user.id]
    );

    if (userSkills.length === 0) {
      // If no skills, return recent jobs
      const [recentJobs] = await pool.execute(
        'SELECT * FROM job_postings WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 10'
      );
      return res.json({ jobs: recentJobs });
    }

    const userSkillIds = userSkills.map(s => s.skill_id);

    // Find jobs that match user's skills
    const [recommendedJobs] = await pool.execute(
      `SELECT jp.*, 
              COUNT(js.skill_id) as matching_skills,
              GROUP_CONCAT(s.name) as required_skills
       FROM job_postings jp
       JOIN job_skills js ON jp.id = js.job_id
       JOIN skills s ON js.skill_id = s.id
       WHERE jp.is_active = TRUE AND js.skill_id IN (${userSkillIds.map(() => '?').join(',')})
       GROUP BY jp.id
       ORDER BY matching_skills DESC, jp.created_at DESC
       LIMIT 10`,
      userSkillIds
    );

    res.json({ jobs: recommendedJobs });
  } catch (error) {
    console.error('Get job recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Get job statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get total applications
    const [totalApplications] = await pool.execute(
      'SELECT COUNT(*) as count FROM user_job_applications WHERE user_id = ?',
      [req.user.id]
    );

    // Get applications by status
    const [statusStats] = await pool.execute(
      `SELECT status, COUNT(*) as count
       FROM user_job_applications
       WHERE user_id = ?
       GROUP BY status`,
      [req.user.id]
    );

    // Get recent applications
    const [recentApplications] = await pool.execute(
      `SELECT uja.*, jp.job_title, jp.company_name
       FROM user_job_applications uja
       JOIN job_postings jp ON uja.job_id = jp.id
       WHERE uja.user_id = ?
       ORDER BY uja.applied_at DESC
       LIMIT 5`,
      [req.user.id]
    );

    res.json({
      totalApplications: totalApplications[0].count,
      statusStats,
      recentApplications
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({ error: 'Failed to get job statistics' });
  }
});

module.exports = router; 