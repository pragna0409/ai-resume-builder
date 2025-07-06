import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Award,
  ArrowRight,
  RotateCcw,
  Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TestResult {
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number;
}

const SkillTest: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const availableSkills = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨', difficulty: 'Intermediate' },
    { id: 'react', name: 'React', icon: '⚛️', difficulty: 'Advanced' },
    { id: 'python', name: 'Python', icon: '🐍', difficulty: 'Beginner' },
    { id: 'nodejs', name: 'Node.js', icon: '🟢', difficulty: 'Intermediate' },
    { id: 'css', name: 'CSS', icon: '🎨', difficulty: 'Beginner' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷', difficulty: 'Advanced' },
  ];

  const javascriptQuestions: Question[] = [
    {
      id: 1,
      question: "What is the output of: console.log(typeof null)?",
      options: ["null", "undefined", "object", "boolean"],
      correctAnswer: 2,
      explanation: "In JavaScript, typeof null returns 'object'. This is a known quirk in the language."
    },
    {
      id: 2,
      question: "Which method is used to add an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctAnswer: 0,
      explanation: "The push() method adds one or more elements to the end of an array."
    },
    {
      id: 3,
      question: "What does the '===' operator do in JavaScript?",
      options: ["Assignment", "Loose equality", "Strict equality", "Not equal"],
      correctAnswer: 2,
      explanation: "The '===' operator checks for strict equality, comparing both value and type."
    },
    {
      id: 4,
      question: "Which of the following is NOT a JavaScript data type?",
      options: ["String", "Boolean", "Float", "Symbol"],
      correctAnswer: 2,
      explanation: "JavaScript doesn't have a specific 'Float' data type. Numbers are represented as the 'Number' type."
    },
    {
      id: 5,
      question: "What is a closure in JavaScript?",
      options: [
        "A way to close the browser",
        "A function that has access to outer scope variables",
        "A method to end a loop",
        "A type of error"
      ],
      correctAnswer: 1,
      explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned."
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && !testCompleted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && testStarted && !testCompleted) {
      handleTestComplete();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, testStarted, testCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = (skill: string) => {
    setSelectedSkill(skill);
    setTestStarted(true);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setTimeLeft(600);
    setTestCompleted(false);
    setTestResult(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = selectedAnswer;
      setUserAnswers(newAnswers);
      
      if (currentQuestion < javascriptQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        handleTestComplete();
      }
    }
  };

  const handleTestComplete = () => {
    const finalAnswers = [...userAnswers];
    if (selectedAnswer !== null) {
      finalAnswers[currentQuestion] = selectedAnswer;
    }
    
    const correctAnswers = finalAnswers.filter((answer, index) => 
      answer === javascriptQuestions[index]?.correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / javascriptQuestions.length) * 100);
    const passed = score >= 70;
    const timeSpent = 600 - timeLeft;
    
    setTestResult({
      score,
      totalQuestions: javascriptQuestions.length,
      passed,
      timeSpent
    });
    
    setTestCompleted(true);
    
    if (passed) {
      toast.success(`Congratulations! You passed with ${score}%`);
    } else {
      toast.error(`Test completed. Score: ${score}% (70% required to pass)`);
    }
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setSelectedSkill('');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setTimeLeft(600);
    setTestResult(null);
  };

  if (testCompleted && testResult) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="glass p-8 rounded-2xl text-center"
          >
            <div className="mb-8">
              {testResult.passed ? (
                <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-4" />
              ) : (
                <Target className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              )}
              
              <h1 className="text-4xl font-bold mb-4">
                {testResult.passed ? (
                  <span className="text-green-400">Test Passed! 🎉</span>
                ) : (
                  <span className="text-orange-400">Test Completed</span>
                )}
              </h1>
              
              <div className="text-6xl font-bold gradient-text mb-4">
                {testResult.score}%
              </div>
              
              <p className="text-xl text-gray-300">
                {selectedSkill} Skill Assessment
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="glass p-6 rounded-xl">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {testResult.score}%
                </div>
                <div className="text-gray-300">Final Score</div>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {userAnswers.filter((answer, index) => 
                    answer === javascriptQuestions[index]?.correctAnswer
                  ).length}/{testResult.totalQuestions}
                </div>
                <div className="text-gray-300">Correct Answers</div>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <div className="text-2xl font-bold text-purple-400 mb-2">
                  {formatTime(testResult.timeSpent)}
                </div>
                <div className="text-gray-300">Time Spent</div>
              </div>
            </div>

            {testResult.passed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-green-600/20 to-blue-600/20 p-6 rounded-xl mb-8"
              >
                <Award className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">Skill Verified!</h3>
                <p className="text-gray-300">
                  Your {selectedSkill} skill has been verified and added to your profile.
                  This certification will help you stand out to potential employers.
                </p>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetTest}
                className="flex items-center justify-center space-x-2 px-6 py-3 glass rounded-lg hover:bg-white/20 transition-colors"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Take Another Test</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/career-path'}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                <span>View Career Path</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (testStarted && selectedSkill) {
    const question = javascriptQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / javascriptQuestions.length) * 100;

    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Test Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-xl mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedSkill} Assessment</h2>
                <p className="text-gray-300">
                  Question {currentQuestion + 1} of {javascriptQuestions.length}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-orange-400">
                  <Clock className="h-5 w-5" />
                  <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Question */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass p-8 rounded-xl"
          >
            <h3 className="text-2xl font-semibold mb-8">{question.question}</h3>
            
            <div className="space-y-4 mb-8">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                    selectedAnswer === index
                      ? 'bg-blue-600 text-white'
                      : 'glass hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-white bg-white'
                        : 'border-gray-400'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {currentQuestion === javascriptQuestions.length - 1 ? 'Complete Test' : 'Next Question'}
                </span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Skill Authentication</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Verify your technical skills through interactive assessments. 
            Pass the test to earn verified badges that boost your profile credibility.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="glass p-6 rounded-xl interactive-card"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{skill.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${
                  skill.difficulty === 'Beginner' ? 'bg-green-600/20 text-green-400' :
                  skill.difficulty === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                  'bg-red-600/20 text-red-400'
                }`}>
                  {skill.difficulty}
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span>Questions:</span>
                    <span>5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Duration:</span>
                    <span>10 minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Pass Score:</span>
                    <span>70%</span>
                  </div>
                </div>
                
                <button
                  onClick={() => startTest(skill.name)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  <Target className="h-5 w-5" />
                  <span>Start Test</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Test Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 glass p-8 rounded-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Choose Your Skill</h3>
              <p className="text-gray-300">Select the skill you want to get verified</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Take the Test</h3>
              <p className="text-gray-300">Answer questions within the time limit</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Verified</h3>
              <p className="text-gray-300">Earn a verified badge for your profile</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkillTest;