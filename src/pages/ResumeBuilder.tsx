import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award,
  Plus,
  Trash2,
  Download,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  gpa?: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

const ResumeBuilder: React.FC = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: <User className="h-5 w-5" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="h-5 w-5" /> },
    { id: 'skills', label: 'Skills', icon: <Award className="h-5 w-5" /> },
  ];

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      duration: '',
      description: ''
    };
    setExperiences([...experiences, newExp]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      year: '',
      gpa: ''
    };
    setEducation([...education, newEdu]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 3
    };
    setSkills([...skills, newSkill]);
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const handleSave = () => {
    toast.success('Resume saved successfully!');
  };

  const handlePreview = () => {
    toast.success('Opening resume preview...');
  };

  const handleDownload = () => {
    toast.success('Resume downloaded as PDF!');
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <input
            type="text"
            value={personalInfo.name}
            onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
            className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
            className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
            className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
          <input
            type="text"
            value={personalInfo.location}
            onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
            className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New York, NY"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Professional Summary</label>
        <textarea
          value={personalInfo.summary}
          onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
          rows={4}
          className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief summary of your professional background and career objectives..."
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Work Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
        </button>
      </div>
      
      {experiences.map((exp, index) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-medium">Experience {index + 1}</h4>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={exp.company}
              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
              className="px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Company Name"
            />
            <input
              type="text"
              value={exp.position}
              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
              className="px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Job Title"
            />
          </div>
          
          <input
            type="text"
            value={exp.duration}
            onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
            className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Jan 2020 - Present"
          />
          
          <textarea
            value={exp.description}
            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your responsibilities and achievements..."
          />
        </motion.div>
      ))}
      
      {experiences.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No work experience added yet. Click "Add Experience" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Education</h3>
        <button
          onClick={addEducation}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </button>
      </div>
      
      {education.map((edu, index) => (
        <motion.div
          key={edu.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-medium">Education {index + 1}</h4>
            <button
              onClick={() => removeEducation(edu.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={edu.institution}
              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
              className="px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="University/School Name"
            />
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
              className="px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Degree/Certification"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={edu.year}
              onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
              className="px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Graduation Year"
            />
            <input
              type="text"
              value={edu.gpa || ''}
              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
              className="px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="GPA (Optional)"
            />
          </div>
        </motion.div>
      ))}
      
      {education.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No education added yet. Click "Add Education" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Skills</h3>
        <button
          onClick={addSkill}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </button>
      </div>
      
      {skills.map((skill, index) => (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-medium">Skill {index + 1}</h4>
            <button
              onClick={() => removeSkill(skill.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
              className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Skill Name (e.g., JavaScript, Python, Design)"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Proficiency Level: {skill.level}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {skills.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No skills added yet. Click "Add Skill" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalInfo();
      case 'experience':
        return renderExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Resume Builder</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Create a professional resume that stands out from the crowd
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass p-6 rounded-xl sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
              
              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={handlePreview}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 glass rounded-lg hover:bg-white/20 transition-colors"
                >
                  <span>Save Draft</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="glass p-8 rounded-xl">
              {renderContent()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;