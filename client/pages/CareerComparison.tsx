import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Compass, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  BookOpen,
  Briefcase,
  Star,
  ArrowRight,
  Target,
  Award,
  BarChart3,
  Zap,
  Brain,
  Palette,
  Code,
  Database,
  Shield,
  Smartphone,
  Globe
} from 'lucide-react';

interface Career {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  averageSalary: string;
  salaryRange: { min: number; max: number };
  difficultyLevel: number;
  timeToStart: string;
  jobGrowthRate: number;
  skillsRequired: string[];
  topCompanies: string[];
  workLifeBalance: number;
  remoteFriendly: number;
  learningCurve: number;
  marketDemand: number;
  creativeFreedom: number;
  teamwork: number;
  pros: string[];
  cons: string[];
  futureOutlook: string;
  category: string;
}

const CAREERS: Career[] = [
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Analyze complex data to help organizations make informed decisions using statistical analysis and machine learning.',
    icon: BarChart3,
    averageSalary: '₹15 LPA',
    salaryRange: { min: 8, max: 25 },
    difficultyLevel: 8,
    timeToStart: '8-12 months',
    jobGrowthRate: 35,
    skillsRequired: ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Visualization'],
    topCompanies: ['Google', 'Meta', 'Microsoft', 'Amazon', 'Netflix'],
    workLifeBalance: 7,
    remoteFriendly: 9,
    learningCurve: 8,
    marketDemand: 9,
    creativeFreedom: 7,
    teamwork: 8,
    pros: ['High salary potential', 'Growing field', 'Remote work opportunities', 'Intellectually challenging'],
    cons: ['Steep learning curve', 'Requires strong math background', 'Can be isolating'],
    futureOutlook: 'Excellent - AI and ML driving massive demand',
    category: 'Technology'
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Design, develop, and maintain software applications and systems using various programming languages.',
    icon: Code,
    averageSalary: '₹12 LPA',
    salaryRange: { min: 5, max: 20 },
    difficultyLevel: 7,
    timeToStart: '6-9 months',
    jobGrowthRate: 25,
    skillsRequired: ['Programming', 'Problem Solving', 'Git', 'Algorithms', 'System Design'],
    topCompanies: ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'],
    workLifeBalance: 8,
    remoteFriendly: 9,
    learningCurve: 7,
    marketDemand: 9,
    creativeFreedom: 8,
    teamwork: 8,
    pros: ['High demand', 'Great work-life balance', 'Remote opportunities', 'Continuous learning'],
    cons: ['Requires constant upskilling', 'Can be mentally demanding', 'Deadline pressure'],
    futureOutlook: 'Very Strong - Digital transformation continues',
    category: 'Technology'
  },
  {
    id: 'ux-designer',
    title: 'UX/UI Designer',
    description: 'Create user-centered designs for digital products, focusing on user experience and interface design.',
    icon: Palette,
    averageSalary: '₹9 LPA',
    salaryRange: { min: 4, max: 15 },
    difficultyLevel: 6,
    timeToStart: '4-6 months',
    jobGrowthRate: 20,
    skillsRequired: ['Design Thinking', 'Prototyping', 'User Research', 'Figma', 'Visual Design'],
    topCompanies: ['Adobe', 'Figma', 'Airbnb', 'Uber', 'Spotify'],
    workLifeBalance: 8,
    remoteFriendly: 8,
    learningCurve: 6,
    marketDemand: 8,
    creativeFreedom: 9,
    teamwork: 9,
    pros: ['Creative work', 'Good work-life balance', 'User impact', 'Collaborative environment'],
    cons: ['Subjective feedback', 'Tight deadlines', 'Requires portfolio building'],
    futureOutlook: 'Strong - UX becoming more important',
    category: 'Design'
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Lead product development from conception to launch, working with cross-functional teams.',
    icon: Target,
    averageSalary: '₹18 LPA',
    salaryRange: { min: 10, max: 30 },
    difficultyLevel: 7,
    timeToStart: '12-18 months',
    jobGrowthRate: 30,
    skillsRequired: ['Strategy', 'Communication', 'Analytics', 'Leadership', 'Market Research'],
    topCompanies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Spotify'],
    workLifeBalance: 6,
    remoteFriendly: 8,
    learningCurve: 8,
    marketDemand: 8,
    creativeFreedom: 8,
    teamwork: 10,
    pros: ['High impact', 'Strategic thinking', 'Leadership opportunities', 'High salary'],
    cons: ['High pressure', 'Long hours', 'Requires experience', 'Blame for failures'],
    futureOutlook: 'Excellent - Product-led growth focus',
    category: 'Management'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    description: 'Protect organizations from cyber threats by monitoring, detecting, and responding to security incidents.',
    icon: Shield,
    averageSalary: '₹11 LPA',
    salaryRange: { min: 6, max: 18 },
    difficultyLevel: 7,
    timeToStart: '6-12 months',
    jobGrowthRate: 40,
    skillsRequired: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Incident Response', 'Compliance'],
    topCompanies: ['IBM', 'Cisco', 'Palo Alto', 'CrowdStrike', 'Microsoft'],
    workLifeBalance: 7,
    remoteFriendly: 7,
    learningCurve: 8,
    marketDemand: 10,
    creativeFreedom: 6,
    teamwork: 7,
    pros: ['High demand', 'Job security', 'Challenging work', 'Good salary growth'],
    cons: ['Constantly evolving threats', 'High stress', 'On-call requirements'],
    futureOutlook: 'Exceptional - Cyber threats increasing',
    category: 'Technology'
  },
  {
    id: 'mobile-developer',
    title: 'Mobile App Developer',
    description: 'Develop mobile applications for iOS and Android platforms using native or cross-platform frameworks.',
    icon: Smartphone,
    averageSalary: '₹10 LPA',
    salaryRange: { min: 5, max: 18 },
    difficultyLevel: 7,
    timeToStart: '6-8 months',
    jobGrowthRate: 22,
    skillsRequired: ['iOS/Android Development', 'UI/UX', 'APIs', 'App Store Guidelines', 'Performance Optimization'],
    topCompanies: ['Apple', 'Google', 'Uber', 'WhatsApp', 'Instagram'],
    workLifeBalance: 8,
    remoteFriendly: 8,
    learningCurve: 7,
    marketDemand: 8,
    creativeFreedom: 8,
    teamwork: 7,
    pros: ['Mobile-first world', 'Creative projects', 'Freelance opportunities', 'User impact'],
    cons: ['Platform fragmentation', 'App store approval', 'Device compatibility'],
    futureOutlook: 'Strong - Mobile usage growing',
    category: 'Technology'
  }
];

export default function CareerComparison() {
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleCareerSelect = (careerId: string, index: number) => {
    const newSelected = [...selectedCareers];
    newSelected[index] = careerId;
    setSelectedCareers(newSelected);
    
    if (newSelected.length >= 2 && newSelected[0] && newSelected[1]) {
      setShowComparison(true);
    }
  };

  const getSelectedCareerData = (index: number): Career | null => {
    const careerId = selectedCareers[index];
    return careerId ? CAREERS.find(c => c.id === careerId) || null : null;
  };

  const getComparisonScore = (value1: number, value2: number, higherIsBetter: boolean = true) => {
    if (higherIsBetter) {
      if (value1 > value2) return 'better';
      if (value1 < value2) return 'worse';
    } else {
      if (value1 < value2) return 'better';
      if (value1 > value2) return 'worse';
    }
    return 'equal';
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'better': return 'text-green-600 bg-green-100';
      case 'worse': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-700/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  CareerCompass
                </h1>
                <p className="text-xs text-gray-500">Career Comparison</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Home</Link>
              <Link to="/careers" className="text-gray-600 hover:text-indigo-600 transition-colors">Explore Careers</Link>
              <Link to="/resume-analyzer" className="text-gray-600 hover:text-indigo-600 transition-colors">Resume Analyzer</Link>
              <Link to="/chat" className="text-gray-600 hover:text-indigo-600 transition-colors">AI Assistant</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Compare
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent block">
              Career Paths
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Make informed career decisions by comparing different career paths side-by-side. 
            Analyze skills, salaries, growth prospects, and more.
          </p>
        </div>

        {/* Career Selection */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <Target className="h-6 w-6" />
                <span>Select Careers to Compare</span>
              </CardTitle>
              <CardDescription>
                Choose two careers from our database to see a detailed side-by-side comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Career</label>
                  <Select value={selectedCareers[0] || ''} onValueChange={(value) => handleCareerSelect(value, 0)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select first career to compare" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAREERS.map((career) => (
                        <SelectItem key={career.id} value={career.id} disabled={career.id === selectedCareers[1]}>
                          <div className="flex items-center space-x-3">
                            <career.icon className="h-4 w-4" />
                            <span>{career.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Second Career</label>
                  <Select value={selectedCareers[1] || ''} onValueChange={(value) => handleCareerSelect(value, 1)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select second career to compare" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAREERS.map((career) => (
                        <SelectItem key={career.id} value={career.id} disabled={career.id === selectedCareers[0]}>
                          <div className="flex items-center space-x-3">
                            <career.icon className="h-4 w-4" />
                            <span>{career.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Results */}
        {showComparison && (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Career Comparison Results
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Detailed side-by-side analysis of your selected career paths
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {[0, 1].map((index) => {
                const career = getSelectedCareerData(index);
                if (!career) return null;

                return (
                  <Card key={index} className="shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                          <career.icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{career.title}</CardTitle>
                          <CardDescription className="text-base">{career.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center text-green-700 mb-2">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Average Salary</span>
                          </div>
                          <p className="text-xl font-bold text-green-900">{career.averageSalary}</p>
                          <p className="text-xs text-green-600">₹{career.salaryRange.min}-{career.salaryRange.max} LPA</p>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center text-blue-700 mb-2">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Job Growth</span>
                          </div>
                          <p className="text-xl font-bold text-blue-900">+{career.jobGrowthRate}%</p>
                          <p className="text-xs text-blue-600">Next 5 years</p>
                        </div>
                      </div>

                      {/* Skills & Ratings */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Key Skills Required</h4>
                          <div className="flex flex-wrap gap-1">
                            {career.skillsRequired.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Work-Life Balance</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={career.workLifeBalance * 10} className="w-20 h-2" />
                              <span className="text-sm font-medium">{career.workLifeBalance}/10</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Remote Friendly</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={career.remoteFriendly * 10} className="w-20 h-2" />
                              <span className="text-sm font-medium">{career.remoteFriendly}/10</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Market Demand</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={career.marketDemand * 10} className="w-20 h-2" />
                              <span className="text-sm font-medium">{career.marketDemand}/10</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Top Companies</h4>
                          <div className="flex flex-wrap gap-1">
                            {career.topCompanies.slice(0, 4).map((company) => (
                              <Badge key={company} variant="secondary" className="text-xs">
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Detailed Comparison Table */}
            {getSelectedCareerData(0) && getSelectedCareerData(1) && (
              <Card className="shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Detailed Comparison</CardTitle>
                  <CardDescription>
                    Side-by-side analysis of key factors for both careers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Comparison Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="font-medium text-gray-900">Factor</div>
                      <div className="font-medium text-gray-900 text-center">{getSelectedCareerData(0)?.title}</div>
                      <div className="font-medium text-gray-900 text-center">{getSelectedCareerData(1)?.title}</div>
                      
                      {/* Salary Comparison */}
                      <div className="text-sm text-gray-600">Average Salary</div>
                      <div className={`text-center p-2 rounded ${getScoreColor(getComparisonScore(
                        getSelectedCareerData(0)?.salaryRange.max || 0,
                        getSelectedCareerData(1)?.salaryRange.max || 0
                      ))}`}>
                        {getSelectedCareerData(0)?.averageSalary}
                      </div>
                      <div className={`text-center p-2 rounded ${getScoreColor(getComparisonScore(
                        getSelectedCareerData(1)?.salaryRange.max || 0,
                        getSelectedCareerData(0)?.salaryRange.max || 0
                      ))}`}>
                        {getSelectedCareerData(1)?.averageSalary}
                      </div>

                      {/* Job Growth */}
                      <div className="text-sm text-gray-600">Job Growth Rate</div>
                      <div className={`text-center p-2 rounded ${getScoreColor(getComparisonScore(
                        getSelectedCareerData(0)?.jobGrowthRate || 0,
                        getSelectedCareerData(1)?.jobGrowthRate || 0
                      ))}`}>
                        +{getSelectedCareerData(0)?.jobGrowthRate}%
                      </div>
                      <div className={`text-center p-2 rounded ${getScoreColor(getComparisonScore(
                        getSelectedCareerData(1)?.jobGrowthRate || 0,
                        getSelectedCareerData(0)?.jobGrowthRate || 0
                      ))}`}>
                        +{getSelectedCareerData(1)?.jobGrowthRate}%
                      </div>

                      {/* Difficulty Level */}
                      <div className="text-sm text-gray-600">Difficulty Level</div>
                      <div className={`text-center p-2 rounded ${getScoreColor(getComparisonScore(
                        getSelectedCareerData(0)?.difficultyLevel || 0,
                        getSelectedCareerData(1)?.difficultyLevel || 0,
                        false
                      ))}`}>
                        {getSelectedCareerData(0)?.difficultyLevel}/10
                      </div>
                      <div className={`text-center p-2 rounded ${getScoreColor(getComparisonScore(
                        getSelectedCareerData(1)?.difficultyLevel || 0,
                        getSelectedCareerData(0)?.difficultyLevel || 0,
                        false
                      ))}`}>
                        {getSelectedCareerData(1)?.difficultyLevel}/10
                      </div>

                      {/* Time to Start */}
                      <div className="text-sm text-gray-600">Time to Start</div>
                      <div className="text-center p-2 rounded bg-gray-100">
                        {getSelectedCareerData(0)?.timeToStart}
                      </div>
                      <div className="text-center p-2 rounded bg-gray-100">
                        {getSelectedCareerData(1)?.timeToStart}
                      </div>

                      {/* Work-Life Balance */}
                      <div className="text-sm text-gray-600">Work-Life Balance</div>
                      <div className={`text-center p-2 rounded ${getScoreColor(getComparisonScore(
                        getSelectedCareerData(0)?.workLifeBalance || 0,
                        getSelectedCareerData(1)?.workLifeBalance || 0
                      ))}`}>
                        {getSelectedCareerData(0)?.workLifeBalance}/10
                      </div>
                      <div className={`text-center p-2 rounded ${getScoreColor(getComparisonScore(
                        getSelectedCareerData(1)?.workLifeBalance || 0,
                        getSelectedCareerData(0)?.workLifeBalance || 0
                      ))}`}>
                        {getSelectedCareerData(1)?.workLifeBalance}/10
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid md:grid-cols-2 gap-8">
                      {[getSelectedCareerData(0), getSelectedCareerData(1)].map((career, index) => (
                        career && (
                          <div key={index} className="space-y-4">
                            <h4 className="font-semibold text-lg text-gray-900">{career.title}</h4>
                            
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium text-green-700 text-sm mb-2">Pros</h5>
                                <ul className="space-y-1">
                                  {career.pros.map((pro, i) => (
                                    <li key={i} className="text-sm text-gray-600 flex items-start">
                                      <span className="text-green-500 mr-2">✓</span>
                                      {pro}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-red-700 text-sm mb-2">Cons</h5>
                                <ul className="space-y-1">
                                  {career.cons.map((con, i) => (
                                    <li key={i} className="text-sm text-gray-600 flex items-start">
                                      <span className="text-red-500 mr-2">✗</span>
                                      {con}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-blue-700 text-sm mb-2">Future Outlook</h5>
                                <p className="text-sm text-gray-600">{career.futureOutlook}</p>
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => setShowComparison(false)}>
                Compare Different Careers
              </Button>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
                <ArrowRight className="h-4 w-4 mr-2" />
                Get Detailed Career Assessment
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
