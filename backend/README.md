# AI Resume Builder Backend

A comprehensive backend API for the AI Resume Builder application with MySQL database.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: Profile, education, and work experience management
- **Resume Builder**: Create, update, and manage multiple resumes
- **Skill Management**: Add, verify, and track user skills
- **Skill Testing**: Interactive skill assessment and verification system
- **Job Postings**: Browse and apply for jobs with skill matching
- **Career Paths**: AI-powered career recommendations based on skills
- **Statistics**: Comprehensive analytics and progress tracking

## Database Schema

The application uses MySQL with the following main tables:

- `users` - User accounts and authentication
- `user_profiles` - Extended user profile information
- `education` - User education history
- `work_experience` - User work experience
- `skills` - Available skills database
- `user_skills` - User-skill relationships with verification
- `skill_tests` - Skill assessment tests
- `test_questions` & `test_answers` - Test content
- `user_test_attempts` - Test attempt tracking
- `resumes` - User resume storage
- `job_postings` - Available job opportunities
- `job_skills` - Job-skill requirements
- `user_job_applications` - Job application tracking
- `career_paths` - Career path definitions
- `career_path_skills` - Career path skill requirements
- `user_career_recommendations` - AI career recommendations

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Database Setup

1. **Install MySQL** if not already installed
2. **Start MySQL service**
3. **Create database and tables**:

```bash
# Connect to MySQL as root
mysql -u root -p

# Enter your password: admin123

# Run the schema file
source database/schema.sql;
```

### 2. Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
Create a `.env` file in the backend directory with:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin123
DB_NAME=ai_resume_builder
DB_PORT=3306
```

4. **Start the server**:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

### 3. Database Connection Details

- **Host**: localhost
- **Port**: 3306
- **Username**: root
- **Password**: admin123
- **Database**: ai_resume_builder

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/education` - Get user education
- `POST /api/users/education` - Add education
- `PUT /api/users/education/:id` - Update education
- `DELETE /api/users/education/:id` - Delete education
- `GET /api/users/experience` - Get work experience
- `POST /api/users/experience` - Add work experience
- `PUT /api/users/experience/:id` - Update work experience
- `DELETE /api/users/experience/:id` - Delete work experience

### Resumes
- `GET /api/resumes` - Get user resumes
- `GET /api/resumes/:id` - Get single resume
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `GET /api/resumes/public/:id` - Get public resume
- `POST /api/resumes/:id/duplicate` - Duplicate resume

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/category/:category` - Get skills by category
- `GET /api/skills/user` - Get user skills
- `POST /api/skills/user` - Add skill to user
- `PUT /api/skills/user/:id` - Update user skill
- `DELETE /api/skills/user/:id` - Remove user skill
- `GET /api/skills/search` - Search skills
- `GET /api/skills/stats` - Get skill statistics

### Tests
- `GET /api/tests` - Get available tests
- `GET /api/tests/:id` - Get test with questions
- `POST /api/tests/:id/start` - Start test
- `POST /api/tests/:id/submit` - Submit test answers
- `GET /api/tests/user/attempts` - Get user test attempts
- `GET /api/tests/stats` - Get test statistics

### Jobs
- `GET /api/jobs` - Get job postings
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs/:id/apply` - Apply for job
- `GET /api/jobs/user/applications` - Get user applications
- `GET /api/jobs/user/recommendations` - Get job recommendations
- `GET /api/jobs/stats` - Get job statistics

### Careers
- `GET /api/careers` - Get career paths
- `GET /api/careers/:id` - Get career path with skills
- `GET /api/careers/user/recommendations` - Get career recommendations
- `GET /api/careers/industry/:industry` - Get career paths by industry
- `GET /api/careers/level/:level` - Get career paths by level
- `GET /api/careers/user/progress` - Get career progress
- `GET /api/careers/stats` - Get career statistics

## Sample Data

The database comes pre-populated with:
- 40+ skills across different categories
- 15+ career paths
- 5 sample job postings
- Sample skill tests and questions

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- SQL injection prevention with parameterized queries
- CORS enabled for frontend integration

## Error Handling

All endpoints include comprehensive error handling with appropriate HTTP status codes and descriptive error messages.

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

The server will automatically restart when files are changed.

## Production Deployment

1. Set appropriate environment variables
2. Use a production MySQL server
3. Set up proper JWT secret
4. Configure CORS for your domain
5. Use a process manager like PM2

## API Documentation

Test the API endpoints using tools like Postman or curl. The health check endpoint is available at:
```
GET http://localhost:5000/api/health
``` 