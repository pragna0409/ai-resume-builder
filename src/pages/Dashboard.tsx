import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Target, 
  Briefcase, 
  TrendingUp, 
  Award, 
  Clock,
  Plus,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const name = localStorage.getItem('userName') || 'User';
    setUserName(name);
  }, [navigate]);

  const stats = [
    { icon: <FileText className="h-6 w-6" />, label: 'Resumes Created', value: '3', color: 'text-blue-400' },
    { icon: <Target className="h-6 w-6" />, label: 'Skills Verified', value: '7', color: 'text-green-400' },
    { icon: <Briefcase className="h-6 w-6" />, label: 'Job Applications', value: '12', color: 'text-purple-400' },
    { icon: <TrendingUp className="h-6 w-6" />, label: 'Profile Views', value: '45', color: 'text-orange-400' },
  ];

  const quickActions = [
    {
      title: 'Build Resume',
      description: 'Create or edit your professional resume',
      icon: <FileText className="h-8 w-8" />,
      link: '/resume-builder',
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Take Skill Test',
      description: 'Verify your skills with interactive tests',
      icon: <Target className="h-8 w-8" />,
      link: '/skill-test',
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Career Path',
      description: 'Discover your ideal career trajectory',
      icon: <TrendingUp className="h-8 w-8" />,
      link: '/career-path',
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Find Jobs',
      description: 'Browse personalized job recommendations',
      icon: <Briefcase className="h-8 w-8" />,
      link: '/jobs',
      color: 'from-orange-600 to-orange-700'
    }
  ];

  const recentActivity = [
    { action: 'Completed JavaScript Skill Test', time: '2 hours ago', icon: <CheckCircle className="h-5 w-5 text-green-400" /> },
    { action: 'Updated Resume - Frontend Developer', time: '1 day ago', icon: <FileText className="h-5 w-5 text-blue-400" /> },
    { action: 'Applied to Software Engineer at TechCorp', time: '2 days ago', icon: <Briefcase className="h-5 w-5 text-purple-400" /> },
    { action: 'Earned React Certification', time: '3 days ago', icon: <Award className="h-5 w-5 text-yellow-400" /> },
  ];

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{userName}</span>! 👋
          </h1>
          <p className="text-gray-300 text-lg">
            Ready to take your career to the next level? Let's continue building your future.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className={stat.color}>{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`glass p-6 rounded-xl interactive-card bg-gradient-to-br ${action.color} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300`}
                >
                  <div className="text-white mb-4">{action.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                  <p className="text-gray-300 mb-4">{action.description}</p>
                  <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span className="mr-2">Get Started</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity & Progress */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recent Activity</h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  {activity.icon}
                  <div className="flex-1">
                    <p className="text-white">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Profile Completion</h3>
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Personal Information</span>
                  <span className="text-green-400">100%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Skills Verification</span>
                  <span className="text-blue-400">70%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Resume Optimization</span>
                  <span className="text-purple-400">85%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full w-5/6"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Job Applications</span>
                  <span className="text-orange-400">45%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-400 h-2 rounded-full w-2/5"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;