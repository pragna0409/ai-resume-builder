const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Get all career paths
router.get('/', async (req, res) => {
  try {
    const [careerPaths] = await pool.execute(
      'SELECT * FROM career_paths ORDER BY industry, experience_level'
    );

    res.json({ careerPaths });
  } catch (error) {
    console.error('Get career paths error:', error);
    res.status(500).json({ error: 'Failed to get career paths' });
  }
});

// Get career path by ID with skills
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [careerPaths] = await pool.execute(
      'SELECT * FROM career_paths WHERE id = ?',
      [id]
    );

    if (careerPaths.length === 0) {
      return res.status(404).json({ error: 'Career path not found' });
    }

    const careerPath = careerPaths[0];

    // Get required skills for this career path
    const [skills] = await pool.execute(
      `SELECT s.*, cps.importance_level
       FROM career_path_skills cps
       JOIN skills s ON cps.skill_id = s.id
       WHERE cps.career_path_id = ?
       ORDER BY cps.importance_level DESC, s.name`,
      [id]
    );

    careerPath.skills = skills;

    res.json({ careerPath });
  } catch (error) {
    console.error('Get career path error:', error);
    res.status(500).json({ error: 'Failed to get career path' });
  }
});

// Get career recommendations for user
router.get('/user/recommendations', authenticateToken, async (req, res) => {
  try {
    // Get user's skills
    const [userSkills] = await pool.execute(
      'SELECT skill_id, proficiency_level, is_verified FROM user_skills WHERE user_id = ?',
      [req.user.id]
    );

    if (userSkills.length === 0) {
      // If no skills, return all career paths
      const [allCareerPaths] = await pool.execute(
        'SELECT * FROM career_paths ORDER BY industry, experience_level LIMIT 10'
      );
      return res.json({ careerPaths: allCareerPaths });
    }

    const userSkillIds = userSkills.map(s => s.skill_id);

    // Get career paths with matching skills
    const [careerPaths] = await pool.execute(
      `SELECT cp.*, 
              COUNT(cps.skill_id) as matching_skills,
              AVG(CASE WHEN us.is_verified = TRUE THEN 1 ELSE 0 END) as verified_ratio
       FROM career_paths cp
       JOIN career_path_skills cps ON cp.id = cps.career_path_id
       LEFT JOIN user_skills us ON cps.skill_id = us.skill_id AND us.user_id = ?
       WHERE cps.skill_id IN (${userSkillIds.map(() => '?').join(',')})
       GROUP BY cp.id
       ORDER BY matching_skills DESC, verified_ratio DESC
       LIMIT 10`,
      [req.user.id, ...userSkillIds]
    );

    // Calculate confidence scores for each career path
    for (let careerPath of careerPaths) {
      const [requiredSkills] = await pool.execute(
        'SELECT skill_id, importance_level FROM career_path_skills WHERE career_path_id = ?',
        [careerPath.id]
      );

      let totalScore = 0;
      let maxScore = 0;

      for (let requiredSkill of requiredSkills) {
        const importanceWeight = {
          'low': 1,
          'medium': 2,
          'high': 3,
          'critical': 4
        }[requiredSkill.importance_level] || 1;

        maxScore += importanceWeight;

        const userSkill = userSkills.find(us => us.skill_id === requiredSkill.skill_id);
        if (userSkill) {
          const proficiencyWeight = {
            'beginner': 0.5,
            'intermediate': 0.75,
            'advanced': 0.9,
            'expert': 1
          }[userSkill.proficiency_level] || 0.5;

          const verificationBonus = userSkill.is_verified ? 0.2 : 0;
          totalScore += importanceWeight * (proficiencyWeight + verificationBonus);
        }
      }

      careerPath.confidence_score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    }

    // Sort by confidence score
    careerPaths.sort((a, b) => b.confidence_score - a.confidence_score);

    res.json({ careerPaths });
  } catch (error) {
    console.error('Get career recommendations error:', error);
    res.status(500).json({ error: 'Failed to get career recommendations' });
  }
});

// Get career path by industry
router.get('/industry/:industry', async (req, res) => {
  try {
    const { industry } = req.params;

    const [careerPaths] = await pool.execute(
      'SELECT * FROM career_paths WHERE industry = ? ORDER BY experience_level',
      [industry]
    );

    res.json({ careerPaths });
  } catch (error) {
    console.error('Get career paths by industry error:', error);
    res.status(500).json({ error: 'Failed to get career paths' });
  }
});

// Get career path by experience level
router.get('/level/:level', async (req, res) => {
  try {
    const { level } = req.params;

    const [careerPaths] = await pool.execute(
      'SELECT * FROM career_paths WHERE experience_level = ? ORDER BY industry',
      [level]
    );

    res.json({ careerPaths });
  } catch (error) {
    console.error('Get career paths by level error:', error);
    res.status(500).json({ error: 'Failed to get career paths' });
  }
});

// Get user's career progress
router.get('/user/progress', authenticateToken, async (req, res) => {
  try {
    // Get user's skills
    const [userSkills] = await pool.execute(
      'SELECT skill_id, proficiency_level, is_verified FROM user_skills WHERE user_id = ?',
      [req.user.id]
    );

    if (userSkills.length === 0) {
      return res.json({ 
        totalSkills: 0,
        verifiedSkills: 0,
        careerPaths: [],
        progress: []
      });
    }

    const userSkillIds = userSkills.map(s => s.skill_id);

    // Get all career paths with progress
    const [careerPaths] = await pool.execute(
      `SELECT cp.*, 
              COUNT(cps.skill_id) as total_required_skills,
              COUNT(CASE WHEN us.skill_id IS NOT NULL THEN 1 END) as acquired_skills,
              COUNT(CASE WHEN us.is_verified = TRUE THEN 1 END) as verified_skills
       FROM career_paths cp
       JOIN career_path_skills cps ON cp.id = cps.career_path_id
       LEFT JOIN user_skills us ON cps.skill_id = us.skill_id AND us.user_id = ?
       GROUP BY cp.id
       HAVING acquired_skills > 0
       ORDER BY (acquired_skills / total_required_skills) DESC
       LIMIT 10`,
      [req.user.id]
    );

    // Calculate progress for each career path
    const progress = careerPaths.map(cp => ({
      ...cp,
      progress_percentage: Math.round((cp.acquired_skills / cp.total_required_skills) * 100),
      verified_percentage: Math.round((cp.verified_skills / cp.total_required_skills) * 100)
    }));

    res.json({
      totalSkills: userSkills.length,
      verifiedSkills: userSkills.filter(s => s.is_verified).length,
      careerPaths: progress
    });
  } catch (error) {
    console.error('Get career progress error:', error);
    res.status(500).json({ error: 'Failed to get career progress' });
  }
});

// Get career path statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get total career paths
    const [totalCareerPaths] = await pool.execute(
      'SELECT COUNT(*) as count FROM career_paths'
    );

    // Get career paths by industry
    const [industryStats] = await pool.execute(
      'SELECT industry, COUNT(*) as count FROM career_paths GROUP BY industry'
    );

    // Get career paths by experience level
    const [levelStats] = await pool.execute(
      'SELECT experience_level, COUNT(*) as count FROM career_paths GROUP BY experience_level'
    );

    // Get user's top career paths
    const [userCareerPaths] = await pool.execute(
      `SELECT cp.*, ucr.confidence_score
       FROM user_career_recommendations ucr
       JOIN career_paths cp ON ucr.career_path_id = cp.id
       WHERE ucr.user_id = ?
       ORDER BY ucr.confidence_score DESC
       LIMIT 5`,
      [req.user.id]
    );

    res.json({
      totalCareerPaths: totalCareerPaths[0].count,
      industryStats,
      levelStats,
      userCareerPaths
    });
  } catch (error) {
    console.error('Get career stats error:', error);
    res.status(500).json({ error: 'Failed to get career statistics' });
  }
});

module.exports = router; 