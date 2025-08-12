import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { 
  Compass, 
  ArrowRight, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Target, 
  Clock, 
  DollarSign, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter,
  MapPin,
  ExternalLink,
  BookOpen,
  Award,
  Calendar,
  BarChart3,
  Zap,
  Sparkles,
  Heart,
  Sun,
  Moon,
  User,
  Play,
  ChevronRight,
  Globe,
  Building,
  Code,
  Palette,
  BarChart,
  Shield,
  Smartphone,
  MessageSquare,
  School,
  Percent
} from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
import { useLanguage } from '@/components/ui/language-provider';
import { LanguageSelector } from '@/components/ui/language-selector';
import { authService } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

interface CareerRecommendation {
  title: string;
  description: string;
  requiredSkills: string[];
  averageSalary: string;
  jobGrowth: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeToStart: string;
  learningPath: string[];
  topCompanies: string[];
  matchScore: number;
  courses: Array<{
    title: string;
    provider: string;
    duration: string;
    url: string;
    type: 'free' | 'paid';
  }>;
  certifications: Array<{
    name: string;
    provider: string;
    difficulty: string;
    url: string;
  }>;
  roadmap: Array<{
    level: string;
    skills: string[];
    duration: string;
    projects: string[];
  }>;
  locations: Array<{
    city: string;
    demand: 'High' | 'Medium' | 'Low';
    avgSalary: string;
  }>;
}

const careerIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'Data Scientist': BarChart,
  'Full Stack Developer': Code,
  'UX/UI Designer': Palette,
  'Product Manager': Target,
  'DevOps Engineer': Shield,
  'Mobile Developer': Smartphone,
  'Default': Briefcase
};

export default function Index() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticatedSync());
  
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const availableInterests = [
    // Technology & IT
    'Technology', 'AI/ML', 'Cybersecurity', 'Cloud Computing', 'Mobile Development', 'Web Development', 'Blockchain', 'IoT', 'Robotics', 'VR/AR',
    
    // Creative & Design
    'Design', 'Graphic Design', 'Photography', 'Video Editing', 'Animation', 'Digital Art', 'Fashion Design', 'Interior Design', 'Architecture',
    
    // Business & Finance
    'Business', 'Finance', 'Entrepreneurship', 'Investment', 'Cryptocurrency', 'E-commerce', 'Digital Marketing', 'Sales', 'Consulting', 'Real Estate',
    
    // Science & Analysis
    'Data', 'Data Science', 'Research', 'Analytics', 'Statistics', 'Machine Learning', 'Scientific Research', 'Biotechnology', 'Chemistry', 'Physics',
    
    // Healthcare & Life Sciences
    'Healthcare', 'Medicine', 'Nursing', 'Mental Health', 'Fitness', 'Nutrition', 'Pharmacy', 'Medical Research', 'Public Health',
    
    // Education & Training
    'Education', 'Teaching', 'Training & Development', 'Online Learning', 'Academic Research', 'Corporate Training',
    
    // Media & Communication
    'Marketing', 'Content Creation', 'Social Media', 'Journalism', 'Public Relations', 'Broadcasting', 'Podcasting', 'Writing', 'Blogging',
    
    // Entertainment & Gaming
    'Gaming', 'Game Development', 'Entertainment', 'Music', 'Film Making', 'Sports', 'Event Management',
    
    // Social Impact & Environment
    'Social Impact', 'Non-profit', 'Environmental Science', 'Sustainability', 'Social Work', 'Community Development', 'Human Rights',
    
    // Specialized Fields
    'Law', 'Psychology', 'Travel & Tourism', 'Agriculture', 'Manufacturing', 'Logistics', 'Aviation', 'Automotive', 'Energy'
  ];

  const availableSkills = [
    // Technical Skills
    'Programming', 'Software Development', 'Web Development', 'Mobile Development', 'Database Management', 'Cloud Computing', 'DevOps',
    'Cybersecurity', 'Network Administration', 'System Administration', 'IT Support', 'Quality Assurance', 'Software Testing',
    
    // Data & Analytics
    'Data Analysis', 'Data Science', 'Machine Learning', 'Artificial Intelligence', 'Statistical Analysis', 'Data Visualization', 
    'Business Intelligence', 'Big Data', 'Predictive Modeling', 'SQL', 'Python', 'R Programming',
    
    // Design & Creative
    'Design', 'UI/UX Design', 'Graphic Design', 'Visual Design', 'User Research', 'Prototyping', 'Adobe Creative Suite', 'Figma',
    'Photography', 'Video Editing', 'Animation', 'Digital Art', '3D Modeling', 'Illustration',
    
    // Business & Management
    'Leadership', 'Project Management', 'Product Management', 'Business Analysis', 'Strategic Planning', 'Operations Management',
    'Financial Analysis', 'Budget Management', 'Risk Management', 'Change Management', 'Process Improvement',
    
    // Marketing & Sales
    'Digital Marketing', 'Content Marketing', 'Social Media Marketing', 'SEO/SEM', 'Email Marketing', 'Sales', 'Customer Service',
    'Brand Management', 'Market Research', 'Public Relations', 'Advertising', 'Copywriting',
    
    // Communication & Soft Skills
    'Communication', 'Public Speaking', 'Writing', 'Technical Writing', 'Presentation Skills', 'Interpersonal Skills',
    'Teamwork', 'Collaboration', 'Negotiation', 'Conflict Resolution', 'Customer Relations',
    
    // Problem Solving & Analysis
    'Problem Solving', 'Critical Thinking', 'Analytical Thinking', 'Research', 'Investigation', 'Decision Making',
    'Attention to Detail', 'Organization', 'Time Management', 'Multitasking',
    
    // Creative & Innovation
    'Creativity', 'Innovation', 'Brainstorming', 'Ideation', 'Design Thinking', 'Creative Problem Solving',
    
    // Languages & Cultural
    'Multilingual', 'Translation', 'Cross-cultural Communication', 'International Business',
    
    // Specialized Skills
    'Teaching', 'Training', 'Mentoring', 'Consulting', 'Healthcare', 'Legal Knowledge', 'Compliance',
    'Engineering', 'Manufacturing', 'Quality Control', 'Supply Chain', 'Logistics'
  ];

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSkillToggle = (skill: string) => {
    setSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const generateRecommendations = async () => {
    if (interests.length === 0 || skills.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one interest and one skill to get recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);

    // Simulate AI processing with progress updates
    const progressSteps = [
      { progress: 20, message: "Analyzing your interests..." },
      { progress: 40, message: "Evaluating your skills..." },
      { progress: 60, message: "Considering your CGPA and experience..." },
      { progress: 80, message: "Matching with career opportunities..." },
      { progress: 100, message: "Generating personalized recommendations..." }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoadingProgress(step.progress);
    }

    // Mock recommendations with real course URLs
    const mockRecommendations: CareerRecommendation[] = [
      {
        title: 'Data Scientist',
        description: 'Analyze complex datasets to extract insights and drive business decisions using statistical methods and machine learning.',
        requiredSkills: ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Visualization', 'Critical Thinking'],
        averageSalary: '₹8-25 LPA ($60k-150k)',
        jobGrowth: '+35% (Next 5 years)',
        difficulty: 'Hard',
        timeToStart: '6-12 months',
        learningPath: ['Python Programming', 'Statistics & Probability', 'Machine Learning', 'Data Visualization', 'SQL', 'Deep Learning'],
        topCompanies: ['Google', 'Meta', 'Microsoft', 'Amazon', 'Netflix', 'Flipkart', 'Zomato'],
        matchScore: 95,
        courses: [
          { 
            title: 'Python for Data Science', 
            provider: 'freeCodeCamp', 
            duration: '12 hours', 
            url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/', 
            type: 'free' 
          },
          { 
            title: 'Machine Learning Course', 
            provider: 'Andrew Ng - Coursera', 
            duration: '11 weeks', 
            url: 'https://www.coursera.org/learn/machine-learning', 
            type: 'free' 
          },
          { 
            title: 'Data Science Fundamentals', 
            provider: 'Khan Academy', 
            duration: '40 hours', 
            url: 'https://www.khanacademy.org/computing/intro-to-programming', 
            type: 'free' 
          }
        ],
        certifications: [
          { 
            name: 'Google Data Analytics Certificate', 
            provider: 'Google', 
            difficulty: 'Beginner', 
            url: 'https://www.coursera.org/professional-certificates/google-data-analytics' 
          },
          { 
            name: 'IBM Data Science Certificate', 
            provider: 'IBM', 
            difficulty: 'Intermediate', 
            url: 'https://www.coursera.org/professional-certificates/ibm-data-science' 
          },
          { 
            name: 'Microsoft Azure Data Scientist', 
            provider: 'Microsoft', 
            difficulty: 'Advanced', 
            url: 'https://docs.microsoft.com/en-us/learn/certifications/azure-data-scientist/' 
          }
        ],
        roadmap: [
          { level: 'Beginner (0-3 months)', skills: ['Python', 'SQL', 'Statistics'], duration: '3 months', projects: ['Exploratory Data Analysis', 'Basic Visualization'] },
          { level: 'Intermediate (3-8 months)', skills: ['Machine Learning', 'Pandas', 'Scikit-learn'], duration: '5 months', projects: ['Prediction Models', 'Classification Projects'] },
          { level: 'Advanced (8-12 months)', skills: ['Deep Learning', 'TensorFlow', 'Big Data'], duration: '4 months', projects: ['Neural Networks', 'Real-time Analytics'] }
        ],
        locations: [
          { city: 'Bangalore', demand: 'High', avgSalary: '₹15-30 LPA' },
          { city: 'Hyderabad', demand: 'High', avgSalary: '₹12-25 LPA' },
          { city: 'Mumbai', demand: 'Medium', avgSalary: '₹10-22 LPA' }
        ]
      },
      {
        title: 'Full Stack Developer',
        description: 'Build complete web applications from frontend user interfaces to backend servers and databases.',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'Databases', 'Problem Solving', 'Git'],
        averageSalary: '₹5-20 LPA ($50k-120k)',
        jobGrowth: '+25% (Next 5 years)',
        difficulty: 'Medium',
        timeToStart: '4-8 months',
        learningPath: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Databases', 'Cloud Deployment'],
        topCompanies: ['Swiggy', 'Paytm', 'Razorpay', 'Freshworks', 'Zoho', 'Byju\'s', 'Unacademy'],
        matchScore: 88,
        courses: [
          { 
            title: 'The Complete Web Developer Bootcamp', 
            provider: 'freeCodeCamp', 
            duration: '300 hours', 
            url: 'https://www.freecodecamp.org/learn/responsive-web-design/', 
            type: 'free' 
          },
          { 
            title: 'Full Stack Open', 
            provider: 'University of Helsinki', 
            duration: '13 parts', 
            url: 'https://fullstackopen.com/en/', 
            type: 'free' 
          },
          { 
            title: 'React Complete Guide', 
            provider: 'React.dev', 
            duration: '20 hours', 
            url: 'https://react.dev/learn', 
            type: 'free' 
          }
        ],
        certifications: [
          { 
            name: 'freeCodeCamp Full Stack', 
            provider: 'freeCodeCamp', 
            difficulty: 'Beginner', 
            url: 'https://www.freecodecamp.org/learn/' 
          },
          { 
            name: 'Meta Front-End Developer', 
            provider: 'Meta', 
            difficulty: 'Intermediate', 
            url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' 
          },
          { 
            name: 'AWS Developer Associate', 
            provider: 'Amazon', 
            difficulty: 'Advanced', 
            url: 'https://aws.amazon.com/certification/certified-developer-associate/' 
          }
        ],
        roadmap: [
          { level: 'Beginner (0-2 months)', skills: ['HTML', 'CSS', 'JavaScript'], duration: '2 months', projects: ['Static Websites', 'DOM Manipulation'] },
          { level: 'Intermediate (2-6 months)', skills: ['React', 'Node.js', 'Express'], duration: '4 months', projects: ['Todo App', 'Blog Platform'] },
          { level: 'Advanced (6-8 months)', skills: ['Database Design', 'APIs', 'Cloud Deployment'], duration: '2 months', projects: ['E-commerce Site', 'Social Media App'] }
        ],
        locations: [
          { city: 'Pune', demand: 'High', avgSalary: '₹8-18 LPA' },
          { city: 'Chennai', demand: 'High', avgSalary: '₹7-16 LPA' },
          { city: 'Delhi', demand: 'Medium', avgSalary: '₹9-20 LPA' }
        ]
      },
      {
        title: 'UX/UI Designer',
        description: 'Create user-centered designs for digital products, focusing on user experience and beautiful, functional interfaces.',
        requiredSkills: ['Design', 'Creativity', 'User Research', 'Prototyping', 'Figma', 'Adobe Creative Suite'],
        averageSalary: '₹4-15 LPA ($45k-100k)',
        jobGrowth: '+20% (Next 5 years)',
        difficulty: 'Medium',
        timeToStart: '3-6 months',
        learningPath: ['Design Principles', 'User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Usability Testing'],
        topCompanies: ['Adobe', 'Figma', 'Airbnb', 'Uber', 'Spotify', 'Ola', 'PhonePe'],
        matchScore: 82,
        courses: [
          { 
            title: 'Google UX Design Certificate', 
            provider: 'Coursera', 
            duration: '6 months', 
            url: 'https://www.coursera.org/professional-certificates/google-ux-design', 
            type: 'free' 
          },
          { 
            title: 'UI/UX Design Specialization', 
            provider: 'California Institute of Arts', 
            duration: '8 months', 
            url: 'https://www.coursera.org/specializations/ui-ux-design', 
            type: 'free' 
          },
          { 
            title: 'Design Thinking Process', 
            provider: 'MIT OpenCourseWare', 
            duration: '6 weeks', 
            url: 'https://ocw.mit.edu/courses/15-390-new-enterprises-spring-2013/', 
            type: 'free' 
          }
        ],
        certifications: [
          { 
            name: 'Google UX Design Certificate', 
            provider: 'Google', 
            difficulty: 'Beginner', 
            url: 'https://www.coursera.org/professional-certificates/google-ux-design' 
          },
          { 
            name: 'Adobe Certified Expert', 
            provider: 'Adobe', 
            difficulty: 'Intermediate', 
            url: 'https://www.adobe.com/training/certification.html' 
          },
          { 
            name: 'Interaction Design Foundation', 
            provider: 'IxDF', 
            difficulty: 'Advanced', 
            url: 'https://www.interaction-design.org/courses' 
          }
        ],
        roadmap: [
          { level: 'Beginner (0-2 months)', skills: ['Design Principles', 'Figma', 'User Research'], duration: '2 months', projects: ['App Redesign', 'User Journey Maps'] },
          { level: 'Intermediate (2-5 months)', skills: ['Prototyping', 'Interaction Design', 'Design Systems'], duration: '3 months', projects: ['Mobile App Design', 'Web Platform Design'] },
          { level: 'Advanced (5-6 months)', skills: ['Advanced Prototyping', 'Design Leadership', 'Strategy'], duration: '1 month', projects: ['Complete Product Design', 'Design System Creation'] }
        ],
        locations: [
          { city: 'Bangalore', demand: 'High', avgSalary: '₹6-15 LPA' },
          { city: 'Mumbai', demand: 'High', avgSalary: '₹7-14 LPA' },
          { city: 'Gurgaon', demand: 'Medium', avgSalary: '₹8-16 LPA' }
        ]
      }
    ];
    
    setRecommendations(mockRecommendations);
    setIsLoading(false);
    setLoadingProgress(100);

    // Show success notification
    toast({
      title: "Assessment Complete! 🎉",
      description: `Your personalized career recommendations are ready. CGPA: ${cgpa || 'Not specified'} considered in the analysis.`,
      duration: 5000,
    });
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === '' || rec.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCareerIcon = (title: string) => {
    const IconComponent = careerIcons[title] || careerIcons['Default'];
    return IconComponent;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 rounded-2xl shadow-lg">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  CareerCompass AI
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your Future Starts Here</p>
              </div>
            </Link>
            
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/careers" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400">
                Explore Careers
              </Link>
              <Link to="/resume-analyzer" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400">
                Resume AI
              </Link>
              <Link to="/chat" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400">
                AI Assistant
              </Link>
              <Link to="/tips" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400">
                Daily Tips
              </Link>
              <Link to="/goals" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400">
                Goal Tracker
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-10 h-10 rounded-xl"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              
              {isLoggedIn && user ? (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" asChild className="rounded-xl">
                    <Link to="/profile" className="flex items-center space-x-2">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-6 h-6 rounded-full" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span>Profile</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-xl"
                    onClick={async () => {
                      await authService.signOut();
                      setUser(null);
                      setIsLoggedIn(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" asChild className="rounded-xl">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:via-purple-700 hover:to-cyan-600 shadow-lg rounded-xl">
                    <Link to="/register">Get Started Free</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Discover Your
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Perfect Career Path
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Let our AI analyze your interests, skills, and academic performance to recommend careers that match your unique profile. 
              Start your journey towards a fulfilling career today.
            </p>
          </div>
          
          {!isLoggedIn && (
            <div className="mb-12">
              <Button asChild size="lg" className="bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:via-purple-700 hover:to-cyan-600 shadow-xl rounded-xl text-lg px-8 py-6">
                <Link to="/register">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started Free
                </Link>
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                No credit card required • 100% free to start
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Career Assessment Form */}
      <section className="py-16 px-6 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                AI-Powered Career Assessment
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Answer a few questions to get personalized career recommendations
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Interests Selection */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-rose-500" />
                  What are your interests? (Select 3-8 that resonate with you)
                </h3>
                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
                  {availableInterests.map((interest) => (
                    <Button
                      key={interest}
                      variant={interests.includes(interest) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInterestToggle(interest)}
                      className={`rounded-full transition-all text-xs ${
                        interests.includes(interest) 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' 
                          : 'hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                      }`}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Selected: {interests.length} interests
                </p>
              </div>

              {/* Skills Selection */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  What are your top skills? (Select 5-10 skills you're confident in)
                </h3>
                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
                  {availableSkills.map((skill) => (
                    <Button
                      key={skill}
                      variant={skills.includes(skill) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSkillToggle(skill)}
                      className={`rounded-full transition-all text-xs ${
                        skills.includes(skill) 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' 
                          : 'hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                      }`}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Selected: {skills.length} skills
                </p>
              </div>

              {/* Experience Level and CGPA Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Experience Level */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-blue-500" />
                    Experience Level
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Beginner', 'Some Experience', 'Experienced', 'Expert'].map((level) => (
                      <Button
                        key={level}
                        variant={experience === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExperience(level)}
                        className={`rounded-full transition-all ${
                          experience === level 
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' 
                            : 'hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                        }`}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* CGPA Input */}
                <div>
                  <Label htmlFor="cgpa" className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                    <Percent className="h-5 w-5 mr-2 text-green-500" />
                    CGPA / Percentage (Optional)
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="cgpa"
                      type="number"
                      placeholder="e.g., 8.5 (CGPA) or 85 (Percentage)"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      className="rounded-xl"
                      min="0"
                      max="10"
                      step="0.1"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enter your CGPA (0-10) or percentage (0-100) to get more accurate recommendations
                    </p>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center pt-6">
                <Button
                  onClick={generateRecommendations}
                  disabled={isLoading || interests.length === 0 || skills.length === 0}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:via-purple-700 hover:to-cyan-600 shadow-xl rounded-xl px-12 py-6 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get My Career Recommendations
                    </>
                  )}
                </Button>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  AI will analyze your profile and suggest the best career matches
                </p>
              </div>

              {/* Progress Bar */}
              {isLoading && (
                <div className="space-y-2">
                  <Progress value={loadingProgress} className="w-full" />
                  <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    {loadingProgress < 20 && "Analyzing your interests..."}
                    {loadingProgress >= 20 && loadingProgress < 40 && "Evaluating your skills..."}
                    {loadingProgress >= 40 && loadingProgress < 60 && "Considering your CGPA and experience..."}
                    {loadingProgress >= 60 && loadingProgress < 80 && "Matching with career opportunities..."}
                    {loadingProgress >= 80 && "Generating personalized recommendations..."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Career Recommendations */}
      {recommendations.length > 0 && (
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Your Personalized Career Recommendations
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Based on your interests, skills, and academic performance, here are the careers that match your profile best.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search career recommendations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedDifficulty === '' ? "default" : "outline"}
                  onClick={() => setSelectedDifficulty('')}
                  className="rounded-xl"
                >
                  All Levels
                </Button>
                <Button
                  variant={selectedDifficulty === 'Easy' ? "default" : "outline"}
                  onClick={() => setSelectedDifficulty('Easy')}
                  className="rounded-xl"
                >
                  Easy
                </Button>
                <Button
                  variant={selectedDifficulty === 'Medium' ? "default" : "outline"}
                  onClick={() => setSelectedDifficulty('Medium')}
                  className="rounded-xl"
                >
                  Medium
                </Button>
                <Button
                  variant={selectedDifficulty === 'Hard' ? "default" : "outline"}
                  onClick={() => setSelectedDifficulty('Hard')}
                  className="rounded-xl"
                >
                  Hard
                </Button>
              </div>
            </div>

            {/* Recommendation Cards */}
            <div className="space-y-8">
              {filteredRecommendations.map((career, index) => {
                const IconComponent = getCareerIcon(career.title);
                return (
                  <Card key={index} className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 rounded-2xl shadow-lg">
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                              {career.title}
                            </CardTitle>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                              {career.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getMatchScoreColor(career.matchScore)}`}>
                            {career.matchScore}%
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Match Score</p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                          <div className="flex items-center text-green-700 dark:text-green-300 mb-1">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Salary Range</span>
                          </div>
                          <p className="text-sm font-semibold text-green-900 dark:text-green-100">{career.averageSalary}</p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <div className="flex items-center text-blue-700 dark:text-blue-300 mb-1">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Job Growth</span>
                          </div>
                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{career.jobGrowth}</p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                          <div className="flex items-center text-purple-700 dark:text-purple-300 mb-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Time to Start</span>
                          </div>
                          <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">{career.timeToStart}</p>
                        </div>
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                          <div className="flex items-center text-orange-700 dark:text-orange-300 mb-1">
                            <Target className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Difficulty</span>
                          </div>
                          <Badge className={getDifficultyColor(career.difficulty)}>
                            {career.difficulty}
                          </Badge>
                        </div>
                      </div>

                      {/* Detailed Information Tabs */}
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 rounded-xl">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="skills">Skills</TabsTrigger>
                          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                          <TabsTrigger value="courses">Courses</TabsTrigger>
                          <TabsTrigger value="jobs">Jobs</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4 mt-4">
                          {/* Required Skills */}
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                              Required Skills
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.requiredSkills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Learning Path */}
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                              Learning Path
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.learningPath.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Top Companies */}
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                              Top Hiring Companies
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.topCompanies.slice(0, 4).map((company) => (
                                <Badge key={company} variant="secondary" className="text-xs">
                                  {company}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="skills" className="space-y-4 mt-4">
                          {/* Required Skills */}
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                              Required Skills
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.requiredSkills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Top Companies */}
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                              Top Hiring Companies
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.topCompanies.slice(0, 4).map((company) => (
                                <Badge key={company} variant="secondary" className="text-xs">
                                  {company}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="roadmap" className="space-y-4 mt-4">
                          {career.roadmap.map((level, i) => (
                            <div key={i} className="border-l-2 border-indigo-200 pl-4">
                              <div className="flex items-center mb-2">
                                <div className="w-3 h-3 bg-rose-500 dark:bg-rose-400 rounded-full -ml-6 mr-3"></div>
                                <h5 className="font-medium text-sm">{level.level}</h5>
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                Duration: {level.duration}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {level.skills.map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="courses" className="space-y-3 mt-4">
                          {career.courses.map((course, i) => (
                            <div key={i} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-sm">{course.title}</h5>
                                <Badge variant={course.type === 'free' ? 'secondary' : 'outline'} className="text-xs">
                                  {course.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{course.provider} • {course.duration}</p>
                              <Button variant="link" className="p-0 h-auto text-xs text-rose-600 dark:text-rose-400" asChild>
                                <a href={course.url} target="_blank" rel="noopener noreferrer">
                                  View Course <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </Button>
                            </div>
                          ))}
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <h5 className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-2">Certifications</h5>
                            {career.certifications.map((cert, i) => (
                              <div key={i} className="flex items-center justify-between py-1">
                                <div>
                                  <p className="text-xs font-medium text-blue-800 dark:text-blue-200">{cert.name}</p>
                                  <p className="text-xs text-blue-600 dark:text-blue-300">{cert.provider} • {cert.difficulty}</p>
                                </div>
                                <Button variant="link" className="p-0 h-auto text-xs text-blue-600 dark:text-blue-400" asChild>
                                  <a href={cert.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="jobs" className="space-y-3 mt-4">
                          {career.locations.map((location, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">{location.city}</span>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  variant={location.demand === 'High' ? 'default' : location.demand === 'Medium' ? 'secondary' : 'outline'}
                                  className="text-xs mb-1"
                                >
                                  {location.demand} Demand
                                </Badge>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{location.avgSalary}</p>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Ready to Start Your Career Journey?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect career path with CareerCompass AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:via-purple-700 hover:to-cyan-600 shadow-xl rounded-xl">
              <Link to="/chat">
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat with AI Assistant
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link to="/resume-analyzer">
                <BookOpen className="mr-2 h-5 w-5" />
                Analyze Your Resume
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100/70 dark:bg-slate-800/70 border-t border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Developed and Designed by <span className="font-semibold text-indigo-600 dark:text-indigo-400">Sriram</span>
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
              © {new Date().getFullYear()} CareerCompass AI. Empowering careers with artificial intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
