import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star,
  Filter,
  Search,
  Bookmark,
  ExternalLink,
  Building,
  Users,
  TrendingUp,
  Heart,
  BookmarkCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary: string;
  experience: string;
  skills: string[];
  description: string;
  posted: string;
  applicants: number;
  match: number;
  saved: boolean;
  companyLogo: string;
  benefits: string[];
}

const JobRecommendations: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: '',
    experience: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate job data from various sources (LinkedIn, Indeed, Glassdoor)
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120K - $150K',
        experience: '3-5 years',
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS'],
        description: 'Join our dynamic team to build cutting-edge web applications using modern technologies. You will work on user-facing features and collaborate with designers and backend developers.',
        posted: '2 days ago',
        applicants: 45,
        match: 95,
        saved: false,
        companyLogo: '🏢',
        benefits: ['Health Insurance', 'Remote Work', '401k', 'Stock Options']
      },
      {
        id: '2',
        title: 'React Developer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$90K - $120K',
        experience: '2-4 years',
        skills: ['React', 'Node.js', 'JavaScript', 'MongoDB'],
        description: 'Looking for a passionate React developer to join our growing startup. You will have the opportunity to work on innovative products and make a real impact.',
        posted: '1 day ago',
        applicants: 23,
        match: 88,
        saved: true,
        companyLogo: '🚀',
        benefits: ['Flexible Hours', 'Learning Budget', 'Gym Membership']
      },
      {
        id: '3',
        title: 'Full Stack Engineer',
        company: 'InnovateLabs',
        location: 'Remote',
        type: 'Remote',
        salary: '$100K - $130K',
        experience: '3-6 years',
        skills: ['JavaScript', 'Python', 'React', 'Django'],
        description: 'Remote-first company seeking a full stack engineer to work on our SaaS platform. Great opportunity for growth and learning new technologies.',
        posted: '3 days ago',
        applicants: 67,
        match: 82,
        saved: false,
        companyLogo: '💡',
        benefits: ['Remote Work', 'Unlimited PTO', 'Home Office Setup']
      },
      {
        id: '4',
        title: 'Frontend Engineer',
        company: 'DesignStudio',
        location: 'Los Angeles, CA',
        type: 'Full-time',
        salary: '$85K - $110K',
        experience: '2-3 years',
        skills: ['CSS', 'JavaScript', 'Vue.js', 'Design Systems'],
        description: 'Creative frontend engineer needed to bring beautiful designs to life. Work closely with our design team to create amazing user experiences.',
        posted: '5 days ago',
        applicants: 34,
        match: 76,
        saved: false,
        companyLogo: '🎨',
        benefits: ['Creative Environment', 'Design Tools', 'Flexible Schedule']
      },
      {
        id: '5',
        title: 'JavaScript Developer',
        company: 'WebSolutions',
        location: 'Austin, TX',
        type: 'Contract',
        salary: '$70 - $90/hour',
        experience: '1-3 years',
        skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
        description: '6-month contract position for an experienced JavaScript developer. Work on multiple client projects and gain diverse experience.',
        posted: '1 week ago',
        applicants: 19,
        match: 71,
        saved: false,
        companyLogo: '🌐',
        benefits: ['High Hourly Rate', 'Flexible Contract', 'Remote Option']
      },
      {
        id: '6',
        title: 'UI/UX Developer',
        company: 'UserFirst',
        location: 'Seattle, WA',
        type: 'Full-time',
        salary: '$95K - $125K',
        experience: '2-5 years',
        skills: ['CSS', 'JavaScript', 'Figma', 'React'],
        description: 'Bridge the gap between design and development. Create beautiful, functional interfaces that users love.',
        posted: '4 days ago',
        applicants: 41,
        match: 79,
        saved: false,
        companyLogo: '👥',
        benefits: ['Design Tools', 'Conference Budget', 'Mentorship Program']
      }
    ];

    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (selectedFilters.type) {
      filtered = filtered.filter(job => job.type === selectedFilters.type);
    }

    // Experience filter
    if (selectedFilters.experience) {
      filtered = filtered.filter(job => job.experience.includes(selectedFilters.experience));
    }

    // Location filter
    if (selectedFilters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(selectedFilters.location.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedFilters, jobs]);

  const toggleSaveJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
    
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      toast.success(job.saved ? 'Job removed from saved' : 'Job saved successfully!');
    }
  };

  const applyToJob = (job: Job) => {
    toast.success(`Application submitted to ${job.company}!`);
  };

  const getMatchColor = (match: number) => {
    if (match >= 85) return 'text-green-400 bg-green-400/20';
    if (match >= 70) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-orange-400 bg-orange-400/20';
  };

  const clearFilters = () => {
    setSelectedFilters({ type: '', experience: '', location: '' });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Job Recommendations</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover personalized job opportunities from top companies based on your skills and preferences.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="glass p-6 rounded-xl mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs, companies, or skills..."
                className="w-full pl-10 pr-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 glass rounded-lg hover:bg-white/10 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <select
                  value={selectedFilters.type}
                  onChange={(e) => setSelectedFilters({...selectedFilters, type: e.target.value})}
                  className="px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>

                <select
                  value={selectedFilters.experience}
                  onChange={(e) => setSelectedFilters({...selectedFilters, experience: e.target.value})}
                  className="px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Experience Levels</option>
                  <option value="1">1-2 years</option>
                  <option value="2">2-3 years</option>
                  <option value="3">3-5 years</option>
                  <option value="5">5+ years</option>
                </select>

                <input
                  type="text"
                  value={selectedFilters.location}
                  onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
                  placeholder="Location"
                  className="px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-300">
            Showing {filteredJobs.length} of {jobs.length} jobs
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </motion.div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="glass p-6 rounded-xl hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{job.companyLogo}</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                        <div className="flex items-center space-x-4 text-gray-300 mb-2">
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{job.posted}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(job.match)}`}>
                      {job.match}% match
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

                  {/* Job Details */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-sm">{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">{job.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                      <span className="text-sm">{job.experience}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-orange-400" />
                      <span className="text-sm">{job.applicants} applicants</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                      <span
                        key={benefitIndex}
                        className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs"
                      >
                        {benefit}
                      </span>
                    ))}
                    {job.benefits.length > 3 && (
                      <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
                        +{job.benefits.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-3">
                  <button
                    onClick={() => applyToJob(job)}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex-1 lg:flex-none"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Apply Now</span>
                  </button>
                  
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors flex-1 lg:flex-none ${
                      job.saved 
                        ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30' 
                        : 'glass hover:bg-white/10'
                    }`}
                  >
                    {job.saved ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    <span>{job.saved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-gray-300 mb-4">
              Try adjusting your search criteria or filters to find more opportunities.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;