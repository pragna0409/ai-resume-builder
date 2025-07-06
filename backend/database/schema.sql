-- Create database
CREATE DATABASE IF NOT EXISTS ai_resume_builder;
USE ai_resume_builder;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    headline VARCHAR(255),
    summary TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    years_of_experience INT,
    current_salary DECIMAL(10,2),
    desired_salary DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    gpa DECIMAL(3,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Work experience table
CREATE TABLE IF NOT EXISTS work_experience (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current_job BOOLEAN DEFAULT FALSE,
    description TEXT,
    achievements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User skills table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
    years_of_experience INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_skill (user_id, skill_id)
);

-- Skill tests table
CREATE TABLE IF NOT EXISTS skill_tests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    skill_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT DEFAULT 30,
    passing_score INT DEFAULT 70,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Test questions table
CREATE TABLE IF NOT EXISTS test_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    test_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'coding') DEFAULT 'multiple_choice',
    points INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES skill_tests(id) ON DELETE CASCADE
);

-- Test answers table
CREATE TABLE IF NOT EXISTS test_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES test_questions(id) ON DELETE CASCADE
);

-- User test attempts table
CREATE TABLE IF NOT EXISTS user_test_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    score INT,
    max_score INT,
    time_taken_minutes INT,
    status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES skill_tests(id) ON DELETE CASCADE
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    template_name VARCHAR(100) DEFAULT 'modern',
    content JSON,
    is_public BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Job postings table
CREATE TABLE IF NOT EXISTS job_postings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    job_type ENUM('full_time', 'part_time', 'contract', 'internship') DEFAULT 'full_time',
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    application_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Job skills table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS job_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    skill_id INT NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_job_skill (job_id, skill_id)
);

-- User job applications table
CREATE TABLE IF NOT EXISTS user_job_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    resume_id INT,
    cover_letter TEXT,
    status ENUM('applied', 'reviewing', 'interviewing', 'offered', 'rejected') DEFAULT 'applied',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL
);

-- Career paths table
CREATE TABLE IF NOT EXISTS career_paths (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    experience_level ENUM('entry', 'mid', 'senior', 'executive') DEFAULT 'entry',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Career path skills table
CREATE TABLE IF NOT EXISTS career_path_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    career_path_id INT NOT NULL,
    skill_id INT NOT NULL,
    importance_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (career_path_id) REFERENCES career_paths(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_career_skill (career_path_id, skill_id)
);

-- User career recommendations table
CREATE TABLE IF NOT EXISTS user_career_recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    career_path_id INT NOT NULL,
    confidence_score DECIMAL(3,2),
    reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (career_path_id) REFERENCES career_paths(id) ON DELETE CASCADE
);

-- Insert sample skills
INSERT IGNORE INTO skills (name, category) VALUES
('JavaScript', 'Programming'),
('Python', 'Programming'),
('React', 'Frontend'),
('Node.js', 'Backend'),
('MySQL', 'Database'),
('MongoDB', 'Database'),
('AWS', 'Cloud'),
('Docker', 'DevOps'),
('Git', 'Version Control'),
('HTML/CSS', 'Frontend'),
('TypeScript', 'Programming'),
('Angular', 'Frontend'),
('Vue.js', 'Frontend'),
('Express.js', 'Backend'),
('Django', 'Backend'),
('Flask', 'Backend'),
('PostgreSQL', 'Database'),
('Redis', 'Database'),
('Kubernetes', 'DevOps'),
('Jenkins', 'DevOps'),
('Machine Learning', 'AI/ML'),
('Data Analysis', 'Data Science'),
('Project Management', 'Management'),
('Agile', 'Methodology'),
('Scrum', 'Methodology'),
('UI/UX Design', 'Design'),
('Graphic Design', 'Design'),
('Digital Marketing', 'Marketing'),
('SEO', 'Marketing'),
('Content Writing', 'Content'),
('Video Editing', 'Media'),
('Photography', 'Media'),
('Sales', 'Business'),
('Customer Service', 'Business'),
('Accounting', 'Finance'),
('Financial Analysis', 'Finance'),
('Human Resources', 'HR'),
('Recruitment', 'HR'),
('Legal Research', 'Legal'),
('Contract Law', 'Legal'),
('Medical Coding', 'Healthcare'),
('Nursing', 'Healthcare'),
('Teaching', 'Education'),
('Curriculum Development', 'Education');

-- Insert sample career paths
INSERT IGNORE INTO career_paths (title, description, industry, experience_level) VALUES
('Frontend Developer', 'Build user interfaces and interactive web applications', 'Technology', 'entry'),
('Backend Developer', 'Develop server-side logic and APIs', 'Technology', 'entry'),
('Full Stack Developer', 'Develop both frontend and backend applications', 'Technology', 'mid'),
('Data Scientist', 'Analyze data and build machine learning models', 'Technology', 'mid'),
('DevOps Engineer', 'Manage infrastructure and deployment pipelines', 'Technology', 'mid'),
('Product Manager', 'Lead product development and strategy', 'Technology', 'senior'),
('UX Designer', 'Design user experiences and interfaces', 'Technology', 'entry'),
('Digital Marketing Specialist', 'Manage online marketing campaigns', 'Marketing', 'entry'),
('Content Writer', 'Create engaging content for various platforms', 'Content', 'entry'),
('Sales Representative', 'Generate leads and close deals', 'Business', 'entry'),
('Project Manager', 'Lead projects and coordinate teams', 'Management', 'mid'),
('Financial Analyst', 'Analyze financial data and create reports', 'Finance', 'entry'),
('HR Specialist', 'Manage human resources and recruitment', 'HR', 'entry'),
('Legal Assistant', 'Support legal professionals with research and documentation', 'Legal', 'entry'),
('Registered Nurse', 'Provide patient care and medical support', 'Healthcare', 'entry'),
('Teacher', 'Educate students in various subjects', 'Education', 'entry');

-- Insert sample job postings
INSERT IGNORE INTO job_postings (company_name, job_title, location, job_type, salary_min, salary_max, description, requirements, benefits) VALUES
('TechCorp Inc.', 'Frontend Developer', 'Remote', 'full_time', 60000, 90000, 'We are looking for a talented Frontend Developer to join our team and help build amazing user experiences.', 'React, JavaScript, HTML/CSS, 2+ years experience', 'Health insurance, 401k, flexible hours, remote work'),
('DataFlow Solutions', 'Data Scientist', 'New York, NY', 'full_time', 80000, 120000, 'Join our data science team to build predictive models and analyze complex datasets.', 'Python, Machine Learning, Statistics, MS/PhD preferred', 'Competitive salary, stock options, professional development'),
('StartupXYZ', 'Full Stack Developer', 'San Francisco, CA', 'full_time', 70000, 110000, 'Help us build the next big thing! We need a versatile developer who can work across the stack.', 'Node.js, React, MongoDB, 3+ years experience', 'Equity, flexible PTO, great team culture'),
('MarketingPro', 'Digital Marketing Specialist', 'Chicago, IL', 'full_time', 45000, 65000, 'Drive our digital marketing efforts and help grow our online presence.', 'Google Ads, Facebook Ads, Analytics, 1+ year experience', 'Health benefits, performance bonuses, career growth'),
('ContentHub', 'Content Writer', 'Remote', 'part_time', 25000, 40000, 'Create engaging content for our blog, social media, and marketing materials.', 'Excellent writing skills, SEO knowledge, portfolio required', 'Flexible schedule, remote work, creative freedom'); 