import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, Users, TrendingUp, BarChart3, Settings } from 'lucide-react';

export default function Admin() {
  // Mock data for admin dashboard
  const stats = {
    totalStudents: 1247,
    assessmentsCompleted: 892,
    avgMatchScore: 87,
    topCareer: 'Data Scientist'
  };

  const recentAssessments = [
    { id: 1, name: 'John Doe', stream: 'Science', cgpa: 8.5, topCareer: 'Data Scientist', matchScore: 95 },
    { id: 2, name: 'Jane Smith', stream: 'Commerce', cgpa: 9.2, topCareer: 'Business Analyst', matchScore: 92 },
    { id: 3, name: 'Mike Johnson', stream: 'Arts', cgpa: 7.8, topCareer: 'UX Designer', matchScore: 88 },
    { id: 4, name: 'Sarah Wilson', stream: 'Science', cgpa: 8.9, topCareer: 'Software Engineer', matchScore: 91 },
    { id: 5, name: 'David Brown', stream: 'Commerce', cgpa: 8.1, topCareer: 'Financial Analyst', matchScore: 85 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Compass className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CareerCompass</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Admin</Badge>
              <Button variant="ghost">Settings</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor student assessments and career recommendations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assessments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.assessmentsCompleted}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Match Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgMatchScore}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Career</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.topCareer}</p>
                </div>
                <Settings className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>
              Latest student career assessments and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{assessment.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Badge variant="outline" className="text-xs">{assessment.stream}</Badge>
                        <span>CGPA: {assessment.cgpa}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{assessment.topCareer}</p>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {assessment.matchScore}% Match
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Placeholder Notice */}
        <Card className="mt-8 border-dashed">
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Admin Panel Under Development
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Advanced admin features like detailed analytics, user management, and system configuration will be available soon.
            </p>
            <Button variant="outline">Request Feature</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
