import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Compass, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Settings,
  Download,
  Eye,
  Calendar,
  Filter,
  FileText,
  Brain,
  Target,
  Award,
  Briefcase,
  GraduationCap,
  MapPin,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';

interface DashboardStats {
  totalStudents: number;
  assessmentsCompleted: number;
  avgMatchScore: number;
  activeUsers: number;
  newRegistrations: number;
  resumesAnalyzed: number;
  chatSessions: number;
  careerComparisons: number;
}

interface StudentData {
  id: number;
  name: string;
  email: string;
  stream: string;
  cgpa: number;
  topCareer: string;
  matchScore: number;
  registrationDate: string;
  lastActive: string;
  assessmentsTaken: number;
  resumeScore?: number;
}

interface CareerPopularity {
  career: string;
  count: number;
  percentage: number;
  growth: number;
}

interface StreamAnalytics {
  stream: string;
  students: number;
  avgCGPA: number;
  topCareers: string[];
  employmentRate: number;
}

export default function Admin() {
  const { theme, setTheme } = useTheme();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for dashboard
  const stats: DashboardStats = {
    totalStudents: 2847,
    assessmentsCompleted: 2156,
    avgMatchScore: 87.3,
    activeUsers: 1523,
    newRegistrations: 247,
    resumesAnalyzed: 892,
    chatSessions: 1634,
    careerComparisons: 567
  };

  const recentStudents: StudentData[] = [
    { 
      id: 1, 
      name: 'Rahul Sharma', 
      email: 'rahul.s@email.com',
      stream: 'Science (PCM)', 
      cgpa: 8.5, 
      topCareer: 'Data Scientist', 
      matchScore: 95,
      registrationDate: '2024-01-15',
      lastActive: '2024-01-20',
      assessmentsTaken: 2,
      resumeScore: 78
    },
    { 
      id: 2, 
      name: 'Priya Patel', 
      email: 'priya.p@email.com',
      stream: 'Commerce', 
      cgpa: 9.2, 
      topCareer: 'Business Analyst', 
      matchScore: 92,
      registrationDate: '2024-01-14',
      lastActive: '2024-01-19',
      assessmentsTaken: 1,
      resumeScore: 85
    },
    { 
      id: 3, 
      name: 'Arjun Kumar', 
      email: 'arjun.k@email.com',
      stream: 'Engineering', 
      cgpa: 7.8, 
      topCareer: 'Software Engineer', 
      matchScore: 88,
      registrationDate: '2024-01-13',
      lastActive: '2024-01-18',
      assessmentsTaken: 3,
      resumeScore: 72
    },
    { 
      id: 4, 
      name: 'Sneha Reddy', 
      email: 'sneha.r@email.com',
      stream: 'Arts/Humanities', 
      cgpa: 8.9, 
      topCareer: 'UX Designer', 
      matchScore: 91,
      registrationDate: '2024-01-12',
      lastActive: '2024-01-17',
      assessmentsTaken: 2,
      resumeScore: 89
    },
    { 
      id: 5, 
      name: 'Vikram Singh', 
      email: 'vikram.s@email.com',
      stream: 'Science (PCB)', 
      cgpa: 8.1, 
      topCareer: 'Data Scientist', 
      matchScore: 85,
      registrationDate: '2024-01-11',
      lastActive: '2024-01-16',
      assessmentsTaken: 1,
      resumeScore: 81
    }
  ];

  const careerPopularity: CareerPopularity[] = [
    { career: 'Data Scientist', count: 456, percentage: 21.2, growth: 15.3 },
    { career: 'Software Engineer', count: 389, percentage: 18.1, growth: 12.7 },
    { career: 'UX/UI Designer', count: 287, percentage: 13.3, growth: 22.1 },
    { career: 'Product Manager', count: 234, percentage: 10.9, growth: 18.5 },
    { career: 'Business Analyst', count: 198, percentage: 9.2, growth: 8.9 },
    { career: 'Cybersecurity Analyst', count: 156, percentage: 7.2, growth: 31.2 },
    { career: 'Mobile Developer', count: 134, percentage: 6.2, growth: 14.6 },
    { career: 'Digital Marketing', count: 102, percentage: 4.7, growth: 19.8 }
  ];

  const streamAnalytics: StreamAnalytics[] = [
    { 
      stream: 'Engineering', 
      students: 847, 
      avgCGPA: 8.2, 
      topCareers: ['Software Engineer', 'Data Scientist', 'Product Manager'],
      employmentRate: 92.3
    },
    { 
      stream: 'Science (PCM)', 
      students: 623, 
      avgCGPA: 8.7, 
      topCareers: ['Data Scientist', 'Software Engineer', 'Research Scientist'],
      employmentRate: 89.1
    },
    { 
      stream: 'Commerce', 
      students: 512, 
      avgCGPA: 8.4, 
      topCareers: ['Business Analyst', 'Financial Analyst', 'Product Manager'],
      employmentRate: 87.5
    },
    { 
      stream: 'Science (PCB)', 
      students: 389, 
      avgCGPA: 8.9, 
      topCareers: ['Data Scientist', 'Research Scientist', 'Healthcare Analytics'],
      employmentRate: 91.7
    },
    { 
      stream: 'Arts/Humanities', 
      students: 276, 
      avgCGPA: 8.1, 
      topCareers: ['UX Designer', 'Content Creator', 'Digital Marketing'],
      employmentRate: 78.3
    },
    { 
      stream: 'Design', 
      students: 200, 
      avgCGPA: 8.5, 
      topCareers: ['UX Designer', 'Graphic Designer', 'Product Designer'],
      employmentRate: 85.0
    }
  ];

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
                <p className="text-xs text-slate-500">Admin Dashboard</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
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
              <Badge className="bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg">Admin</Badge>
              <Button variant="ghost">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Monitor platform analytics and student progress
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalStudents.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+{stats.newRegistrations} this month</span>
                  </div>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assessments</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.assessmentsCompleted.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{((stats.assessmentsCompleted / stats.totalStudents) * 100).toFixed(1)}% completion</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Match Score</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgMatchScore}%</p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-yellow-600">High accuracy</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeUsers.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <Clock className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">Last 30 days</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Usage Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resumesAnalyzed}</p>
              <p className="text-sm text-gray-600">Resumes Analyzed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.careerComparisons}</p>
              <p className="text-sm text-gray-600">Career Comparisons</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.chatSessions}</p>
              <p className="text-sm text-gray-600">AI Chat Sessions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">94.2%</p>
              <p className="text-sm text-gray-600">Satisfaction Rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="students">Student Analytics</TabsTrigger>
            <TabsTrigger value="careers">Career Trends</TabsTrigger>
            <TabsTrigger value="streams">Stream Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Student Registrations</CardTitle>
                    <CardDescription>Latest students who joined the platform</CardDescription>
                  </div>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Streams</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="commerce">Commerce</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{student.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <Badge variant="outline" className="text-xs">{student.stream}</Badge>
                            <span>CGPA: {student.cgpa}</span>
                            <span>{student.assessmentsTaken} assessments</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">{student.topCareer}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs">
                            {student.matchScore}% Match
                          </Badge>
                          {student.resumeScore && (
                            <Badge variant="secondary" className="text-xs">
                              Resume: {student.resumeScore}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="careers" className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Career Popularity Trends</CardTitle>
                <CardDescription>Most popular career choices among students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {careerPopularity.map((career, index) => (
                    <div key={career.career} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{career.career}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{career.count} students interested</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="font-medium text-gray-900 dark:text-white">{career.percentage}%</p>
                            <div className="flex items-center">
                              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                              <span className="text-xs text-green-600">+{career.growth}%</span>
                            </div>
                          </div>
                          <Progress value={career.percentage} className="w-20 h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="streams" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {streamAnalytics.map((stream) => (
                <Card key={stream.stream} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{stream.stream}</CardTitle>
                    <CardDescription>{stream.students} students enrolled</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Avg CGPA</p>
                        <p className="text-xl font-bold text-blue-900 dark:text-blue-300">{stream.avgCGPA}</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">Employment</p>
                        <p className="text-xl font-bold text-green-900 dark:text-green-300">{stream.employmentRate}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Top Career Choices</p>
                      <div className="space-y-1">
                        {stream.topCareers.map((career, index) => (
                          <div key={career} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{career}</span>
                            <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Platform Performance</CardTitle>
                  <CardDescription>System health and usage metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Assessment Accuracy</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={94.2} className="w-20 h-2" />
                      <span className="text-sm font-medium">94.2%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">User Satisfaction</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={91.8} className="w-20 h-2" />
                      <span className="text-sm font-medium">91.8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={88.5} className="w-20 h-2" />
                      <span className="text-sm font-medium">1.2s avg</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">System Uptime</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={99.9} className="w-20 h-2" />
                      <span className="text-sm font-medium">99.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Recent System Alerts</CardTitle>
                  <CardDescription>Important notifications and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-300">System Update Completed</p>
                        <p className="text-xs text-green-600 dark:text-green-400">AI model updated with latest data</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Maintenance Scheduled</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Database optimization on Jan 25, 2AM-4AM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">High Traffic Alert</p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">Increased usage during assessment period</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
