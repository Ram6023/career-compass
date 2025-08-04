import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Compass, GraduationCap, Brain, TrendingUp, Users, DollarSign, BookOpen, Building } from 'lucide-react';

const SKILLS = [
  'Programming', 'Data Analysis', 'Communication', 'Leadership', 'Problem Solving',
  'Creativity', 'Project Management', 'Research', 'Design', 'Marketing',
  'Sales', 'Finance', 'Teaching', 'Mathematics', 'Writing'
];

const INTERESTS = [
  'Machine Learning', 'Web Development', 'Mobile Development', 'Data Science',
  'Artificial Intelligence', 'Cybersecurity', 'UI/UX Design', 'Digital Marketing',
  'Business Analytics', 'Healthcare', 'Finance', 'Education', 'Research',
  'Entrepreneurship', 'Content Creation'
];

interface CareerRecommendation {
  title: string;
  description: string;
  requiredSkills: string[];
  averageSalary: string;
  learningPath: string[];
  topCompanies: string[];
  matchScore: number;
}

export default function Index() {
  const [formData, setFormData] = useState({
    stream: '',
    cgpa: '',
    skills: [] as string[],
    interests: [] as string[]
  });
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock recommendations based on input
    const mockRecommendations: CareerRecommendation[] = [
      {
        title: 'Data Scientist',
        description: 'Analyze complex data to help organizations make informed decisions using statistical analysis and machine learning.',
        requiredSkills: ['Data Analysis', 'Programming', 'Machine Learning', 'Statistics'],
        averageSalary: '$95,000 - $150,000',
        learningPath: ['Python Programming', 'Statistics & Probability', 'Machine Learning', 'Data Visualization', 'SQL'],
        topCompanies: ['Google', 'Meta', 'Microsoft', 'Amazon', 'Netflix'],
        matchScore: 95
      },
      {
        title: 'Software Engineer',
        description: 'Design, develop, and maintain software applications and systems using various programming languages.',
        requiredSkills: ['Programming', 'Problem Solving', 'Software Design', 'Testing'],
        averageSalary: '$80,000 - $130,000',
        learningPath: ['Programming Fundamentals', 'Data Structures', 'Algorithms', 'System Design', 'Testing'],
        topCompanies: ['Apple', 'Google', 'Microsoft', 'Meta', 'Tesla'],
        matchScore: 88
      },
      {
        title: 'UX/UI Designer',
        description: 'Create user-centered designs for digital products, focusing on user experience and interface design.',
        requiredSkills: ['Design', 'Creativity', 'User Research', 'Prototyping'],
        averageSalary: '$70,000 - $120,000',
        learningPath: ['Design Principles', 'User Research', 'Prototyping Tools', 'Visual Design', 'Usability Testing'],
        topCompanies: ['Adobe', 'Figma', 'Airbnb', 'Uber', 'Spotify'],
        matchScore: 82
      }
    ];
    
    setRecommendations(mockRecommendations);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateRecommendations();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CareerCompass</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Login</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Brain className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Discover Your Perfect
            <span className="text-primary block">Career Path</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Get AI-powered career recommendations tailored to your academic performance, skills, and interests. 
            Start your journey to a fulfilling career today.
          </p>
        </div>

        {recommendations.length === 0 ? (
          /* Career Assessment Form */
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6" />
                <span>Career Assessment</span>
              </CardTitle>
              <CardDescription>
                Tell us about yourself to get personalized career recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Academic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="stream">Academic Stream</Label>
                    <Select value={formData.stream} onValueChange={(value) => setFormData(prev => ({ ...prev, stream: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your stream" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="commerce">Commerce</SelectItem>
                        <SelectItem value="arts">Arts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cgpa">CGPA / Percentage</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      placeholder="e.g., 8.5 or 85%"
                      value={formData.cgpa}
                      onChange={(e) => setFormData(prev => ({ ...prev, cgpa: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Skills Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Your Skills</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {SKILLS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                        />
                        <Label
                          htmlFor={`skill-${skill}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => toggleSkill(skill)}>
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interests Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Your Interests</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {INTERESTS.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={`interest-${interest}`}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={() => toggleInterest(interest)}
                        />
                        <Label
                          htmlFor={`interest-${interest}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="cursor-pointer" onClick={() => toggleInterest(interest)}>
                          {interest} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg"
                  disabled={!formData.stream || !formData.cgpa || formData.skills.length === 0 || formData.interests.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Analyzing Your Profile...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>Get AI Career Recommendations</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Career Recommendations */
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Your Personalized Career Recommendations
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Based on your profile analysis, here are the top career paths for you
              </p>
              <Button 
                variant="outline" 
                onClick={() => setRecommendations([])}
                className="mt-4"
              >
                Take Assessment Again
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {recommendations.map((career, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {career.matchScore}% Match
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl mb-2">{career.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {career.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Required Skills */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
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

                    {/* Average Salary */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Average Salary
                      </h4>
                      <p className="text-lg font-semibold text-green-600">{career.averageSalary}</p>
                    </div>

                    {/* Learning Path */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Learning Roadmap
                      </h4>
                      <ul className="text-sm space-y-1">
                        {career.learningPath.slice(0, 3).map((step, i) => (
                          <li key={i} className="flex items-center text-gray-600 dark:text-gray-400">
                            <span className="w-4 h-4 bg-primary/20 text-primary rounded-full text-xs flex items-center justify-center mr-2 flex-shrink-0">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                        {career.learningPath.length > 3 && (
                          <li className="text-primary text-xs">+{career.learningPath.length - 3} more steps</li>
                        )}
                      </ul>
                    </div>

                    {/* Top Companies */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        Top Hiring Companies
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {career.topCompanies.slice(0, 3).map((company) => (
                          <Badge key={company} variant="secondary" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                        {career.topCompanies.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{career.topCompanies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        {recommendations.length === 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose CareerCompass?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our AI-powered platform provides comprehensive career guidance tailored to your unique profile
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Advanced algorithms analyze your skills, interests, and academic performance
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Market Insights</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get real-time salary data, job market trends, and industry insights
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Personalized Guidance</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Receive customized learning paths and career roadmaps
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
