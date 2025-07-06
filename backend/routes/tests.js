const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Get all available tests
router.get('/', async (req, res) => {
  try {
    const [tests] = await pool.execute(
      `SELECT t.*, s.name as skill_name, s.category
       FROM skill_tests t
       JOIN skills s ON t.skill_id = s.id
       WHERE t.is_active = TRUE
       ORDER BY s.category, t.title`
    );

    res.json({ tests });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ error: 'Failed to get tests' });
  }
});

// Get test by ID with questions
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get test details
    const [tests] = await pool.execute(
      `SELECT t.*, s.name as skill_name, s.category
       FROM skill_tests t
       JOIN skills s ON t.skill_id = s.id
       WHERE t.id = ? AND t.is_active = TRUE`,
      [id]
    );

    if (tests.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const test = tests[0];

    // Get questions (without correct answers for security)
    const [questions] = await pool.execute(
      `SELECT id, question_text, question_type, points
       FROM test_questions
       WHERE test_id = ?
       ORDER BY id`,
      [id]
    );

    // Get answers for each question
    for (let question of questions) {
      const [answers] = await pool.execute(
        'SELECT id, answer_text FROM test_answers WHERE question_id = ? ORDER BY id',
        [question.id]
      );
      question.answers = answers;
    }

    test.questions = questions;

    res.json({ test });
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({ error: 'Failed to get test' });
  }
});

// Start a test
router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if test exists and is active
    const [tests] = await pool.execute(
      'SELECT * FROM skill_tests WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (tests.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Check if user already has an in-progress attempt
    const [existingAttempts] = await pool.execute(
      'SELECT id FROM user_test_attempts WHERE user_id = ? AND test_id = ? AND status = "in_progress"',
      [req.user.id, id]
    );

    if (existingAttempts.length > 0) {
      return res.status(400).json({ error: 'Test already in progress' });
    }

    // Create new attempt
    const [result] = await pool.execute(
      'INSERT INTO user_test_attempts (user_id, test_id) VALUES (?, ?)',
      [req.user.id, id]
    );

    res.status(201).json({
      message: 'Test started successfully',
      attempt_id: result.insertId
    });
  } catch (error) {
    console.error('Start test error:', error);
    res.status(500).json({ error: 'Failed to start test' });
  }
});

// Submit test answers
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { attempt_id, answers } = req.body;

    // Get test attempt
    const [attempts] = await pool.execute(
      'SELECT * FROM user_test_attempts WHERE id = ? AND user_id = ? AND test_id = ? AND status = "in_progress"',
      [attempt_id, req.user.id, id]
    );

    if (attempts.length === 0) {
      return res.status(404).json({ error: 'Test attempt not found' });
    }

    const attempt = attempts[0];

    // Get test questions and correct answers
    const [questions] = await pool.execute(
      'SELECT id, points FROM test_questions WHERE test_id = ?',
      [id]
    );

    let totalScore = 0;
    let maxScore = 0;

    // Calculate score
    for (let question of questions) {
      maxScore += question.points;
      
      if (answers[question.id]) {
        const [correctAnswers] = await pool.execute(
          'SELECT id FROM test_answers WHERE question_id = ? AND is_correct = TRUE',
          [question.id]
        );

        const userAnswerIds = Array.isArray(answers[question.id]) ? answers[question.id] : [answers[question.id]];
        const correctAnswerIds = correctAnswers.map(a => a.id);

        // Check if all correct answers are selected and no incorrect ones
        const isCorrect = correctAnswerIds.length === userAnswerIds.length &&
          correctAnswerIds.every(id => userAnswerIds.includes(id));

        if (isCorrect) {
          totalScore += question.points;
        }
      }
    }

    // Get test details for passing score
    const [tests] = await pool.execute(
      'SELECT passing_score FROM skill_tests WHERE id = ?',
      [id]
    );

    const passingScore = tests[0].passing_score;
    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = percentage >= passingScore;

    // Update attempt
    await pool.execute(
      'UPDATE user_test_attempts SET score = ?, max_score = ?, status = "completed", completed_at = NOW() WHERE id = ?',
      [totalScore, maxScore, attempt_id]
    );

    // If passed, verify the skill
    if (passed) {
      const [testDetails] = await pool.execute(
        'SELECT skill_id FROM skill_tests WHERE id = ?',
        [id]
      );

      await pool.execute(
        'UPDATE user_skills SET is_verified = TRUE WHERE user_id = ? AND skill_id = ?',
        [req.user.id, testDetails[0].skill_id]
      );
    }

    res.json({
      message: 'Test submitted successfully',
      score: totalScore,
      maxScore,
      percentage,
      passed
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ error: 'Failed to submit test' });
  }
});

// Get user's test attempts
router.get('/user/attempts', authenticateToken, async (req, res) => {
  try {
    const [attempts] = await pool.execute(
      `SELECT uta.*, st.title, st.passing_score, s.name as skill_name
       FROM user_test_attempts uta
       JOIN skill_tests st ON uta.test_id = st.id
       JOIN skills s ON st.skill_id = s.id
       WHERE uta.user_id = ?
       ORDER BY uta.started_at DESC`,
      [req.user.id]
    );

    res.json({ attempts });
  } catch (error) {
    console.error('Get user attempts error:', error);
    res.status(500).json({ error: 'Failed to get test attempts' });
  }
});

// Get test statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get total attempts
    const [totalAttempts] = await pool.execute(
      'SELECT COUNT(*) as count FROM user_test_attempts WHERE user_id = ?',
      [req.user.id]
    );

    // Get passed tests
    const [passedTests] = await pool.execute(
      `SELECT COUNT(*) as count
       FROM user_test_attempts uta
       JOIN skill_tests st ON uta.test_id = st.id
       WHERE uta.user_id = ? AND uta.status = 'completed'
       AND (uta.score / uta.max_score * 100) >= st.passing_score`,
      [req.user.id]
    );

    // Get average score
    const [avgScore] = await pool.execute(
      `SELECT AVG(uta.score / uta.max_score * 100) as average
       FROM user_test_attempts uta
       WHERE uta.user_id = ? AND uta.status = 'completed'`,
      [req.user.id]
    );

    // Get recent attempts
    const [recentAttempts] = await pool.execute(
      `SELECT uta.*, st.title, s.name as skill_name
       FROM user_test_attempts uta
       JOIN skill_tests st ON uta.test_id = st.id
       JOIN skills s ON st.skill_id = s.id
       WHERE uta.user_id = ?
       ORDER BY uta.started_at DESC
       LIMIT 5`,
      [req.user.id]
    );

    res.json({
      totalAttempts: totalAttempts[0].count,
      passedTests: passedTests[0].count,
      averageScore: avgScore[0].average || 0,
      recentAttempts
    });
  } catch (error) {
    console.error('Get test stats error:', error);
    res.status(500).json({ error: 'Failed to get test statistics' });
  }
});

module.exports = router; 