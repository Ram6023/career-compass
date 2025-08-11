import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Compass,
  GraduationCap,
  Brain,
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Building,
  FileText,
  BarChart3,
  MessageSquare,
  Download,
  ExternalLink,
  Award,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Briefcase,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
import { useLanguage } from '@/components/ui/language-provider';
import { LanguageSelector } from '@/components/ui/language-selector';
import { toast } from '@/components/ui/use-toast';

const ACADEMIC_STREAMS = [
  'Science (PCM)', 'Science (PCB)', 'Science (PCMB)', 'Commerce', 'Arts/Humanities',
  'Engineering', 'Medicine', 'Law', 'Management', 'Design', 'Agriculture',
  'Pharmacy', 'Architecture', 'Mass Communication', 'Hotel Management',
  'Fashion Technology', 'Computer Applications', 'Social Work'
];

const SKILLS = [
  'Programming', 'Data Analysis', 'Communication', 'Leadership', 'Problem Solving',
  'Creativity', 'Project Management', 'Research', 'Design', 'Marketing',
  'Sales', 'Finance', 'Teaching', 'Mathematics', 'Writing', 'Public Speaking',
  'Team Management', 'Critical Thinking', 'Time Management', 'Adaptability',
  'Technical Writing', 'Data Visualization', 'Machine Learning', 'Cloud Computing',
  'Digital Marketing', 'Financial Analysis', 'Strategic Planning', 'Quality Assurance'
];

const INTERESTS = [
  'Machine Learning', 'Web Development', 'Mobile Development', 'Data Science',
  'Artificial Intelligence', 'Cybersecurity', 'UI/UX Design', 'Digital Marketing',
  'Business Analytics', 'Healthcare', 'Finance', 'Education', 'Research',
  'Entrepreneurship', 'Content Creation', 'Game Development', 'DevOps',
  'Blockchain', 'IoT', 'Robotics', 'Biotechnology', 'Environmental Science',
  'Renewable Energy', 'Space Technology', 'Virtual Reality'
];

interface CareerRecommendation {
  title: string;
  description: string;
  requiredSkills: string[];
  averageSalary: string;
  learningPath: string[];
  topCompanies: string[];
  matchScore: number;
  jobGrowth: string;
  difficulty: string;
  timeToStart: string;
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

export default function Index() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    stream: '',
    cgpa: '',
    skills: [] as string[],
    interests: [] as string[],
    experience: '',
    careerGoal: ''
  });
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const toggleSkill = (skill: string) => {
    const isAdding = !formData.skills.includes(skill);
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));

    if (isAdding) {
      toast({
        title: "Skill added! ✨",
        description: `${skill} has been added to your skills profile.`,
        duration: 2000,
      });
    }
  };

  const toggleInterest = (interest: string) => {
    const isAdding = !formData.interests.includes(interest);
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));

    if (isAdding) {
      toast({
        title: "Interest added! 🎯",
        description: `${interest} has been added to your interests profile.`,
        duration: 2000,
      });
    }
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    // Simulate AI processing with progress
    const steps = [
      'Analyzing your academic background...',
      'Processing your skills and interests...',
      'Matching with career opportunities...',
      'Generating personalized roadmaps...',
      'Finalizing recommendations...'
    ];
    
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setLoadingProgress(i);
    }
    
    // Enhanced mock recommendations
    const mockRecommendations: CareerRecommendation[] = [
      {
        title: 'Data Scientist',
        description: 'Analyze complex data to help organizations make informed decisions using statistical analysis and machine learning algorithms.',
        requiredSkills: ['Data Analysis', 'Programming', 'Machine Learning', 'Statistics', 'Python', 'SQL'],
        averageSalary: '₹8-25 LPA ($70k-150k)',
        jobGrowth: '+35% (Next 5 years)',
        difficulty: 'Medium-Hard',
        timeToStart: '6-12 months',
        learningPath: ['Python Programming', 'Statistics & Probability', 'Machine Learning', 'Data Visualization', 'SQL', 'Deep Learning'],
        topCompanies: ['Google', 'Meta', 'Microsoft', 'Amazon', 'Netflix', 'Flipkart', 'Zomato'],
        matchScore: 95,
        courses: [
          { title: 'Python for Data Science', provider: 'Coursera', duration: '3 months', url: '#', type: 'paid' },
          { title: 'Machine Learning A-Z', provider: 'Udemy', duration: '4 months', url: '#', type: 'paid' },
          { title: 'Data Science Fundamentals', provider: 'YouTube', duration: '2 months', url: '#', type: 'free' }
        ],
        certifications: [
          { name: 'Google Data Analytics Certificate', provider: 'Google', difficulty: 'Beginner', url: '#' },
          { name: 'AWS Machine Learning', provider: 'Amazon', difficulty: 'Intermediate', url: '#' },
          { name: 'Microsoft Azure Data Scientist', provider: 'Microsoft', difficulty: 'Advanced', url: '#' }
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
          { title: 'The Complete Web Developer Bootcamp', provider: 'Udemy', duration: '6 months', url: '#', type: 'paid' },
          { title: 'Full Stack Open', provider: 'University of Helsinki', duration: '4 months', url: '#', type: 'free' },
          { title: 'React - The Complete Guide', provider: 'Udemy', duration: '3 months', url: '#', type: 'paid' }
        ],
        certifications: [
          { name: 'freeCodeCamp Full Stack', provider: 'freeCodeCamp', difficulty: 'Beginner', url: '#' },
          { name: 'Meta Front-End Developer', provider: 'Meta', difficulty: 'Intermediate', url: '#' },
          { name: 'AWS Developer Associate', provider: 'Amazon', difficulty: 'Advanced', url: '#' }
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
          { title: 'Google UX Design Certificate', provider: 'Coursera', duration: '4 months', url: '#', type: 'paid' },
          { title: 'UI/UX Design Specialization', provider: 'CalArts', duration: '5 months', url: '#', type: 'paid' },
          { title: 'Design Thinking Process', provider: 'YouTube', duration: '1 month', url: '#', type: 'free' }
        ],
        certifications: [
          { name: 'Google UX Design Certificate', provider: 'Google', difficulty: 'Beginner', url: '#' },
          { name: 'Adobe Certified Expert', provider: 'Adobe', difficulty: 'Intermediate', url: '#' },
          { name: 'Interaction Design Foundation', provider: 'IxDF', difficulty: 'Advanced', url: '#' }
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
      description: "Your personalized career recommendations are ready. Check out your top matches below!",
      duration: 5000,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show starting notification
    toast({
      title: "Starting AI Analysis... 🤖",
      description: "Analyzing your profile to find the perfect career matches.",
      duration: 3000,
    });

    generateRecommendations();
  };

  const exportResults = () => {
    if (recommendations.length === 0) return;

    // Create a comprehensive report content
    const reportContent = {
      title: 'CareerCompass - AI Career Recommendations Report',
      generatedDate: new Date().toLocaleDateString(),
      studentProfile: {
        stream: formData.stream,
        cgpa: formData.cgpa,
        skills: formData.skills,
        interests: formData.interests,
        experience: formData.experience,
        careerGoal: formData.careerGoal
      },
      recommendations: recommendations.map((career, index) => ({
        rank: index + 1,
        title: career.title,
        description: career.description,
        matchScore: career.matchScore,
        averageSalary: career.averageSalary,
        jobGrowth: career.jobGrowth,
        difficulty: career.difficulty,
        timeToStart: career.timeToStart,
        requiredSkills: career.requiredSkills,
        topCompanies: career.topCompanies,
        courses: career.courses,
        certifications: career.certifications,
        roadmap: career.roadmap,
        locations: career.locations
      }))
    };

    // Generate HTML content for the report
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>CareerCompass Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 28px; font-weight: bold; color: #e11d48; margin-bottom: 10px; }
            .subtitle { color: #666; margin-bottom: 20px; }
            .profile { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .career { margin-bottom: 40px; page-break-inside: avoid; }
            .career-title { font-size: 24px; font-weight: bold; color: #e11d48; margin-bottom: 10px; }
            .match-score { background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
            .section { margin: 15px 0; }
            .section-title { font-weight: bold; color: #374151; margin-bottom: 8px; }
            .skills, .companies { display: flex; flex-wrap: wrap; gap: 8px; }
            .skill, .company { background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .roadmap { margin: 10px 0; }
            .roadmap-level { margin: 8px 0; padding: 10px; background: #f9fafb; border-left: 3px solid #e11d48; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background: #f3f4f6; }
            @media print { .no-print { display: none; } }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">🧭 CareerCompass</div>
            <div class="subtitle">AI-Powered Career Recommendations Report</div>
            <div>Generated on: ${reportContent.generatedDate}</div>
        </div>

        <div class="profile">
            <h2>Student Profile</h2>
            <p><strong>Academic Stream:</strong> ${reportContent.studentProfile.stream}</p>
            <p><strong>CGPA:</strong> ${reportContent.studentProfile.cgpa}</p>
            <p><strong>Experience Level:</strong> ${reportContent.studentProfile.experience || 'Not specified'}</p>
            <p><strong>Career Goal:</strong> ${reportContent.studentProfile.careerGoal || 'Not specified'}</p>
            <div class="section">
                <div class="section-title">Skills:</div>
                <div class="skills">
                    ${reportContent.studentProfile.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="section">
                <div class="section-title">Interests:</div>
                <div class="skills">
                    ${reportContent.studentProfile.interests.map(interest => `<span class="skill">${interest}</span>`).join('')}
                </div>
            </div>
        </div>

        ${reportContent.recommendations.map(career => `
            <div class="career">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2 class="career-title">${career.rank}. ${career.title}</h2>
                    <span class="match-score">${career.matchScore}% Match</span>
                </div>

                <p>${career.description}</p>

                <table>
                    <tr><th>Salary Range</th><td>${career.averageSalary}</td></tr>
                    <tr><th>Job Growth</th><td>${career.jobGrowth}</td></tr>
                    <tr><th>Difficulty</th><td>${career.difficulty}</td></tr>
                    <tr><th>Time to Start</th><td>${career.timeToStart}</td></tr>
                </table>

                <div class="section">
                    <div class="section-title">Required Skills:</div>
                    <div class="skills">
                        ${career.requiredSkills.map(skill => `<span class="skill">${skill}</span>`).join('')}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Top Hiring Companies:</div>
                    <div class="companies">
                        ${career.topCompanies.map(company => `<span class="company">${company}</span>`).join('')}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Learning Roadmap:</div>
                    ${career.roadmap.map(level => `
                        <div class="roadmap-level">
                            <strong>${level.level}</strong> (${level.duration})
                            <br>Skills: ${level.skills.join(', ')}
                            <br>Projects: ${level.projects.join(', ')}
                        </div>
                    `).join('')}
                </div>

                <div class="section">
                    <div class="section-title">Recommended Courses:</div>
                    ${career.courses.map(course => `
                        <div style="margin: 5px 0; padding: 8px; background: #f9fafb;">
                            <strong>${course.title}</strong> (${course.provider})
                            <br>Duration: ${course.duration} | Type: ${course.type}
                        </div>
                    `).join('')}
                </div>

                <div class="section">
                    <div class="section-title">Location-wise Opportunities:</div>
                    ${career.locations.map(location => `
                        <div style="margin: 5px 0;">
                            <strong>${location.city}:</strong> ${location.demand} demand, ${location.avgSalary}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}

        <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px;">
            <p>This report was generated by CareerCompass AI Career Recommendation System</p>
            <p>For more information, visit CareerCompass.ai</p>
        </div>
    </body>
    </html>
    `;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CareerCompass_Report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Also create a simple text version
    const textContent = `
CAREERCOMPASS - AI CAREER RECOMMENDATIONS REPORT
Generated on: ${reportContent.generatedDate}

STUDENT PROFILE:
- Academic Stream: ${reportContent.studentProfile.stream}
- CGPA: ${reportContent.studentProfile.cgpa}
- Skills: ${reportContent.studentProfile.skills.join(', ')}
- Interests: ${reportContent.studentProfile.interests.join(', ')}

CAREER RECOMMENDATIONS:

${reportContent.recommendations.map((career, index) => `
${index + 1}. ${career.title} (${career.matchScore}% Match)
   ${career.description}

   Salary: ${career.averageSalary}
   Growth: ${career.jobGrowth}
   Difficulty: ${career.difficulty}
   Time to Start: ${career.timeToStart}

   Required Skills: ${career.requiredSkills.join(', ')}
   Top Companies: ${career.topCompanies.join(', ')}

   Learning Path:
   ${career.roadmap.map(level => `   - ${level.level}: ${level.skills.join(', ')}`).join('\n')}
`).join('\n')}

---
Report generated by CareerCompass AI Career Recommendation System
    `;

    // Download text version as well
    const textBlob = new Blob([textContent], { type: 'text/plain' });
    const textUrl = window.URL.createObjectURL(textBlob);
    const textLink = document.createElement('a');
    textLink.href = textUrl;
    textLink.download = `CareerCompass_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(textLink);
    setTimeout(() => {
      textLink.click();
      document.body.removeChild(textLink);
      window.URL.revokeObjectURL(textUrl);

      // Show success notification
      toast({
        title: "Export Successful! 📄",
        description: "Your career recommendations have been downloaded as HTML and TXT files.",
        duration: 5000,
      });
    }, 100);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-bg mesh-gradient"></div>

      {/* Floating particles */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
      {/* Enhanced Header */}
      <header className="border-b border-white/20 bg-white/10 backdrop-blur-md dark:bg-black/10 dark:border-white/10 sticky top-0 z-50 glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  {t('header.title')}
                </h1>
                <p className="text-xs text-white/70">{t('header.subtitle')}</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/careers" className="text-white/80 hover:text-white transition-colors font-medium hover-glow">{t('header.explorecareers')}</Link>
              <Link to="/resume-analyzer" className="text-white/80 hover:text-white transition-colors font-medium hover-glow">{t('header.resumeAnalyzer')}</Link>
              <Link to="/roadmaps" className="text-white/80 hover:text-white transition-colors font-medium hover-glow">{t('header.careerRoadmaps')}</Link>
              <Link to="/chat" className="text-white/80 hover:text-white transition-colors font-medium hover-glow">{t('header.aiAssistant')}</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-9 px-0"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button variant="ghost" asChild className="text-white/80 hover:text-white hover:bg-white/10">
                <Link to="/login">{t('header.login')}</Link>
              </Button>
              <Button asChild className="bg-white/20 hover:bg-white/30 text-white shadow-lg hover-glow backdrop-blur-sm border border-white/30">
                <Link to="/register">{t('header.getStarted')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-rose-500/20 to-pink-600/20 rounded-2xl backdrop-blur-sm shadow-xl">
                <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            {t('hero.title')}
            <span className="bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent block pulse-soft">
              {t('hero.subtitle')}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed drop-shadow">
            {t('hero.description')}
            <br className="hidden md:block" />
            <span className="text-yellow-200 font-semibold">{t('hero.cta')}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/20 text-white shadow-lg border-white/30 backdrop-blur-sm glass hover-glow">
              <Target className="w-4 h-4 mr-2" />
              {t('stats.accuracy')}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/20 text-white shadow-lg border-white/30 backdrop-blur-sm glass hover-glow">
              <Users className="w-4 h-4 mr-2" />
              {t('stats.students')}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/20 text-white shadow-lg border-white/30 backdrop-blur-sm glass hover-glow">
              <Briefcase className="w-4 h-4 mr-2" />
              {t('stats.careers')}
            </Badge>
          </div>
        </div>

        {isLoading ? (
          /* Enhanced Loading State */
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 bg-white dark:bg-slate-900 rounded-full"></div>
                  <div className="absolute inset-4 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 drop-shadow">
                AI is Analyzing Your Profile
              </h3>
              <p className="text-white/80 mb-6 drop-shadow">
                Please wait while we generate your personalized career recommendations
              </p>
              <Progress value={loadingProgress} className="mb-4" />
              <p className="text-sm text-white/70">{loadingProgress}% Complete</p>
            </CardContent>
          </Card>
        ) : recommendations.length === 0 ? (
          /* Enhanced Career Assessment Form */
          <Card className="max-w-5xl mx-auto shadow-2xl glass hover-glow">
            <CardHeader className="bg-white/10 border-b border-white/20 backdrop-blur-sm">
              <CardTitle className="flex items-center space-x-3 text-2xl text-white drop-shadow">
                <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span>Career Assessment</span>
              </CardTitle>
              <CardDescription className="text-lg text-white/80">
                Complete this comprehensive assessment to get personalized AI-powered career recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Academic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center drop-shadow">
                    <BookOpen className="h-5 w-5 mr-2 text-yellow-300" />
                    Academic Background
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="stream" className="text-base font-medium">Academic Stream</Label>
                      <Select value={formData.stream} onValueChange={(value) => setFormData(prev => ({ ...prev, stream: value }))}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select your academic stream" />
                        </SelectTrigger>
                        <SelectContent>
                          {ACADEMIC_STREAMS.map((stream) => (
                            <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cgpa" className="text-base font-medium">CGPA / Percentage</Label>
                      <Input
                        id="cgpa"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="e.g., 8.5 or 85%"
                        value={formData.cgpa}
                        onChange={(e) => setFormData(prev => ({ ...prev, cgpa: e.target.value }))}
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-base font-medium">Experience Level</Label>
                      <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fresher">Fresher (0 years)</SelectItem>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                          <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="careerGoal" className="text-base font-medium">Career Goal Timeline</Label>
                      <Select value={formData.careerGoal} onValueChange={(value) => setFormData(prev => ({ ...prev, careerGoal: value }))}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="When do you want to start?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate (0-6 months)</SelectItem>
                          <SelectItem value="short">Short term (6-12 months)</SelectItem>
                          <SelectItem value="medium">Medium term (1-2 years)</SelectItem>
                          <SelectItem value="long">Long term (2+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Skills Selection */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-rose-600 dark:text-rose-400" />
                    Your Skills ({formData.skills.length} selected)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {SKILLS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                        />
                        <Label
                          htmlFor={`skill-${skill}`}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="cursor-pointer bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors duration-200 border border-rose-200/50"
                          onClick={() => {
                            toggleSkill(skill);
                            toast({
                              title: "Skill removed",
                              description: `${skill} has been removed from your skills list.`,
                              duration: 2000,
                            });
                          }}
                        >
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interests Selection */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Star className="h-5 w-5 mr-2 text-rose-600 dark:text-rose-400" />
                    Your Interests ({formData.interests.length} selected)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {INTERESTS.map((interest) => (
                      <div key={interest} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
                        <Checkbox
                          id={`interest-${interest}`}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={() => toggleInterest(interest)}
                        />
                        <Label
                          htmlFor={`interest-${interest}`}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant="outline"
                          className="cursor-pointer border-pink-200 text-pink-700 hover:bg-pink-50 transition-colors duration-200"
                          onClick={() => {
                            toggleInterest(interest);
                            toast({
                              title: "Interest removed",
                              description: `${interest} has been removed from your interests list.`,
                              duration: 2000,
                            });
                          }}
                        >
                          {interest} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 text-lg bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg"
                  disabled={!formData.stream || !formData.cgpa || formData.skills.length === 0 || formData.interests.length === 0}
                >
                  <div className="flex items-center space-x-3">
                    <Brain className="h-6 w-6" />
                    <span>Generate AI Career Recommendations</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Enhanced Career Recommendations */
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Your Personalized Career Recommendations
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
                Based on your profile analysis, here are the top career paths tailored for you
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setRecommendations([]);
                    setFormData({
                      stream: '',
                      cgpa: '',
                      skills: [],
                      interests: [],
                      experience: '',
                      careerGoal: ''
                    });
                    toast({
                      title: "Assessment Reset! 🔄",
                      description: "You can now take the career assessment again with updated information.",
                      duration: 3000,
                    });
                  }}
                  className="bg-white"
                >
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Take Assessment Again
                </Button>
                <Button
                  onClick={exportResults}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {recommendations.map((career, index) => (
                <Card key={index} className="relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-600"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      {career.matchScore}% Match
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-rose-500/10 to-pink-600/10 rounded-lg">
                        <Briefcase className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{career.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{career.difficulty}</Badge>
                          <Badge variant="outline" className="text-xs">{career.timeToStart}</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {career.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 text-xs">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                        <TabsTrigger value="courses">Courses</TabsTrigger>
                        <TabsTrigger value="jobs">Jobs</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-4 mt-4">
                        {/* Salary & Growth */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center text-green-700 mb-1">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span className="text-xs font-medium">Salary Range</span>
                            </div>
                            <p className="text-sm font-semibold">{career.averageSalary}</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center text-blue-700 mb-1">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              <span className="text-xs font-medium">Job Growth</span>
                            </div>
                            <p className="text-sm font-semibold">{career.jobGrowth}</p>
                          </div>
                        </div>

                        {/* Required Skills */}
                        <div>
                          <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                            Key Skills Required
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {career.requiredSkills.slice(0, 4).map((skill) => (
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
                          <div key={i} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
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
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-8">
              <Button
                variant="outline"
                className="bg-white"
                asChild
              >
                <Link to="/chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat with AI Assistant
                </Link>
              </Button>
              <Button
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg"
                asChild
              >
                <Link to="/resume-analyzer">
                  <FileText className="h-4 w-4 mr-2" />
                  Analyze My Resume
                </Link>
              </Button>
              <Button
                variant="outline"
                className="bg-white"
                asChild
              >
                <Link to="/compare">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Compare Careers
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Features Section */}
        {recommendations.length === 0 && !isLoading && (
          <div className="mt-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose CareerCompass?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Our comprehensive AI-powered platform provides everything you need for career success
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8">
                  <div className="p-4 bg-gradient-to-br from-rose-500/10 to-pink-600/10 rounded-2xl w-fit mx-auto mb-4">
                    <Brain className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Advanced machine learning algorithms analyze your complete profile for accurate recommendations
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8">
                  <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl w-fit mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Real-time Market Data</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Live salary data, job market trends, and industry insights updated daily
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8">
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-2xl w-fit mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Personalized Roadmaps</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Step-by-step learning paths with courses, certifications, and project recommendations
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8">
                  <div className="p-4 bg-gradient-to-br from-pink-500/10 to-purple-600/10 rounded-2xl w-fit mx-auto mb-4">
                    <Users className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    24/7 AI career assistant and access to industry mentors and career counselors
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
