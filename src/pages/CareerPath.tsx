import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  BookOpen, 
  Users, 
  DollarSign,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Briefcase
} from 'lucide-react';

interface CareerPath {
  id: string;
  title: string;
  description: string;
  match: number;
  salaryRange: string;
  growth: string;
  skills: string[];
  nextSteps: string[];
  companies: string[];
  timeToAchieve: string;
}

interface Skill {
  name: string;
  verified: boolean;
  level: number;
}

const CareerPath: React.FC = () => {
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);

  useEffect(() => {
    // Simulate user skills from localStorage or API
    setUserSkills([
      { name: 'JavaScript', verified: true, level: 4 },
      { name: 'React', verified: true, level: 3 },
      { name: 'Node.js', verified: false, level: 2 },
      { name: 'Python', verified: false, level: 2 },
      { name: 'CSS', verified: true, level: 4 },
      { name: 'TypeScript', verified: false, level: 1 },
    ]);
  }, []);

  const careerPaths: CareerPath[] = [
    {
      id: 'frontend-dev',
      title: 'Senior Frontend Developer',
      description: 'Lead frontend development projects and mentor junior developers while building scalable user interfaces.',
      match: 92,
      salaryRange: '$80K - $120K',
      growth: '+15% annually',
      skills: ['JavaScript', 'React', 'TypeScript', 'CSS', 'Vue.js'],
      nextSteps: [
        'Master TypeScript fundamentals',
        'Learn advanced React patterns',
        'Build 2-3 complex projects',
        'Contribute to open source'
      ],
      companies: ['Google', 'Meta', 'Netflix', 'Airbnb', 'Spotify'],
      timeToAchieve: '6-12 months'
    },
    {
      id: 'fullstack-dev',
      title: 'Full Stack Developer',
      description: 'Work on both frontend and backend systems, handling the complete web development lifecycle.',
      match: 78,
      salaryRange: '$75K - $110K',
      growth: '+12% annually',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
      nextSteps: [
        'Strengthen Node.js skills',
        'Learn database design',
        'Master API development',
        'Deploy full-stack applications'
      ],
      companies: ['Stripe', 'Shopify', 'GitHub', 'Atlassian', 'Slack'],
      timeToAchieve: '8-15 months'
    },
    {
      id: 'react-specialist',
      title: 'React Specialist',
      description: 'Become an expert in React ecosystem, building complex applications and leading React initiatives.',
      match: 85,
      salaryRange: '$85K - $130K',
      growth: '+18% annually',
      skills: ['React', 'Redux', 'Next.js', 'TypeScript', 'Testing'],
      nextSteps: [
        'Master React advanced concepts',
        'Learn Next.js framework',
        'Implement testing strategies',
        'Build React component library'
      ],
      companies: ['Facebook', 'Vercel', 'Gatsby', 'Discord', 'WhatsApp'],
      timeToAchieve: '4-8 months'
    },
    {
      id: 'ui-engineer',
      title: 'UI/UX Engineer',
      description: 'Bridge the gap between design and development, creating beautiful and functional user interfaces.',
      match: 73,
      salaryRange: '$70K - $105K',
      growth: '+14% annually',
      skills: ['CSS', 'JavaScript', 'Design Systems', 'Figma', 'Animation'],
      nextSteps: [
        'Learn design principles',
        'Master CSS animations',
        'Study design systems',
        'Build interactive prototypes'
      ],
      companies: ['Adobe', 'Figma', 'Framer', 'Webflow', 'InVision'],
      timeToAchieve: '6-10 months'
    }
  ];

  const getSkillColor = (skill: Skill) => {
    if (skill.verified) return 'text-green-400 bg-green-400/20';
    if (skill.level >= 3) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-gray-400 bg-gray-400/20';
  };

  const getMatchColor = (match: number) => {
    if (match >= 85) return 'text-green-400';
    if (match >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your <span className="gradient-text">Career Path</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover personalized career recommendations based on your verified skills 
            and get a roadmap to achieve your professional goals.
          </p>
        </motion.div>

        {/* Current Skills Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="glass p-6 rounded-xl mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Your Current Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {userSkills.map((skill, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-center ${getSkillColor(skill)}`}
              >
                <div className="font-semibold">{skill.name}</div>
                <div className="text-sm mt-1">
                  {skill.verified ? (
                    <div className="flex items-center justify-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < skill.level ? 'bg-current' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Career Path Recommendations */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Recommended Career Paths</h2>
            <div className="space-y-6">
              {careerPaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  onClick={() => setSelectedPath(path)}
                  className={`glass p-6 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/10 ${
                    selectedPath?.id === path.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
                      <p className="text-gray-300 text-sm">{path.description}</p>
                    </div>
                    <div className={`text-2xl font-bold ${getMatchColor(path.match)}`}>
                      {path.match}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-sm">{path.salaryRange}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">{path.growth}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {path.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {path.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
                        +{path.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{path.timeToAchieve}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-blue-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detailed Path View */}
          <div>
            {selectedPath ? (
              <motion.div
                key={selectedPath.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="glass p-6 rounded-xl sticky top-24"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">{selectedPath.title}</h3>
                  <div className={`text-3xl font-bold ${getMatchColor(selectedPath.match)}`}>
                    {selectedPath.match}%
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{selectedPath.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="glass p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <span className="font-semibold">Salary Range</span>
                    </div>
                    <div className="text-xl font-bold text-green-400">
                      {selectedPath.salaryRange}
                    </div>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      <span className="font-semibold">Growth Rate</span>
                    </div>
                    <div className="text-xl font-bold text-blue-400">
                      {selectedPath.growth}
                    </div>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Required Skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPath.skills.map((skill, index) => {
                      const userSkill = userSkills.find(s => s.name === skill);
                      const hasSkill = userSkill && (userSkill.verified || userSkill.level >= 3);
                      
                      return (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
                            hasSkill 
                              ? 'bg-green-600/20 text-green-400' 
                              : 'bg-orange-600/20 text-orange-400'
                          }`}
                        >
                          {hasSkill && <CheckCircle className="h-3 w-3" />}
                          <span>{skill}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Next Steps</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedPath.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Top Companies */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Briefcase className="h-5 w-5" />
                    <span>Top Hiring Companies</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPath.companies.map((company, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
                  <Target className="h-5 w-5" />
                  <span>Start This Path</span>
                </button>
              </motion.div>
            ) : (
              <div className="glass p-8 rounded-xl text-center">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a Career Path</h3>
                <p className="text-gray-300">
                  Click on any career path to see detailed information and next steps.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPath;