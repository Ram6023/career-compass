import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Compass, 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Star,
  TrendingUp,
  Target,
  Award,
  Eye,
  BarChart3,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface ResumeAnalysis {
  overallScore: number;
  sections: {
    contactInfo: { score: number; feedback: string[]; present: boolean };
    summary: { score: number; feedback: string[]; present: boolean };
    experience: { score: number; feedback: string[]; present: boolean };
    education: { score: number; feedback: string[]; present: boolean };
    skills: { score: number; feedback: string[]; present: boolean };
    projects: { score: number; feedback: string[]; present: boolean };
  };
  keywordMatching: {
    matched: string[];
    missing: string[];
    suggestions: string[];
  };
  improvements: {
    critical: string[];
    important: string[];
    minor: string[];
  };
  atsCompatibility: number;
  readabilityScore: number;
  industryFit: {
    score: number;
    industry: string;
    matchedKeywords: string[];
  };
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.pdf')) {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeResume = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results
    const mockAnalysis: ResumeAnalysis = {
      overallScore: 78,
      sections: {
        contactInfo: { 
          score: 95, 
          feedback: ['✓ Complete contact information provided', '✓ Professional email address', '✓ LinkedIn profile included'],
          present: true 
        },
        summary: { 
          score: 70, 
          feedback: ['✓ Professional summary present', '⚠ Could be more specific about achievements', '⚠ Add 1-2 key metrics'],
          present: true 
        },
        experience: { 
          score: 85, 
          feedback: ['✓ Good use of action verbs', '✓ Quantified achievements', '⚠ Add more recent experience details'],
          present: true 
        },
        education: { 
          score: 90, 
          feedback: ['✓ Education section complete', '✓ Relevant coursework mentioned', '✓ GPA included'],
          present: true 
        },
        skills: { 
          score: 65, 
          feedback: ['✓ Technical skills listed', '⚠ Add more industry-specific skills', '⚠ Include skill proficiency levels'],
          present: true 
        },
        projects: { 
          score: 60, 
          feedback: ['✓ Projects section present', '⚠ Add more project details', '⚠ Include technologies used'],
          present: true 
        }
      },
      keywordMatching: {
        matched: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'Agile'],
        missing: ['AWS', 'Docker', 'Kubernetes', 'TypeScript', 'MongoDB'],
        suggestions: ['Add cloud platform experience (AWS/Azure)', 'Include containerization skills', 'Mention API development']
      },
      improvements: {
        critical: [
          'Add missing industry-relevant keywords',
          'Quantify more achievements with specific metrics',
          'Ensure ATS-friendly formatting'
        ],
        important: [
          'Expand project descriptions with technical details',
          'Add more recent work experience',
          'Include relevant certifications'
        ],
        minor: [
          'Optimize spacing and layout',
          'Use consistent bullet point formatting',
          'Add portfolio or GitHub links'
        ]
      },
      atsCompatibility: 82,
      readabilityScore: 88,
      industryFit: {
        score: 75,
        industry: 'Software Development',
        matchedKeywords: ['JavaScript', 'React', 'Python', 'SQL', 'Git']
      }
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md dark:bg-gray-900/90 sticky top-0 z-50">
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
                <p className="text-xs text-gray-500">Resume Analyzer</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-600 hover:text-rose-600 transition-colors font-medium">Home</Link>
              <Link to="/careers" className="text-slate-600 hover:text-rose-600 transition-colors font-medium">Explore Careers</Link>
              <Link to="/roadmaps" className="text-slate-600 hover:text-rose-600 transition-colors font-medium">Career Roadmaps</Link>
              <Link to="/chat" className="text-slate-600 hover:text-rose-600 transition-colors font-medium">AI Assistant</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg">
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
              <div className="p-4 bg-gradient-to-br from-rose-500/20 to-pink-600/20 rounded-2xl backdrop-blur-sm shadow-xl">
                <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                  <FileText className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            AI Resume
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent block">
              Analyzer
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Get instant feedback on your resume with AI-powered analysis. Improve your chances of landing interviews with actionable insights.
          </p>
        </div>

        {!analysis ? (
          <div className="max-w-2xl mx-auto">
            {/* File Upload Section */}
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <Upload className="h-6 w-6" />
                  <span>Upload Your Resume</span>
                </CardTitle>
                <CardDescription>
                  Upload your resume in PDF format for comprehensive AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-rose-100 dark:bg-rose-900/20 rounded-full">
                      <Upload className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drag and drop your resume here
                      </p>
                      <p className="text-gray-600">or click to browse files</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                  </div>
                </div>

                {file && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">{file.name}</p>
                          <p className="text-sm text-green-700">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={analyzeResume}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg"
                      >
                        {isAnalyzing ? (
                          <div className="flex items-center space-x-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Analyzing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Sparkles className="h-4 w-4" />
                            <span>Analyze Resume</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="mt-6 p-6 bg-indigo-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      <p className="font-medium text-indigo-900">Analyzing your resume...</p>
                    </div>
                    <div className="space-y-2 text-sm text-indigo-700">
                      <p>• Extracting text and formatting information</p>
                      <p>• Analyzing section completeness and quality</p>
                      <p>• Checking ATS compatibility</p>
                      <p>• Generating improvement recommendations</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features Section */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="p-3 bg-indigo-100 rounded-full w-fit mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Comprehensive Scoring</h3>
                  <p className="text-gray-600 text-sm">
                    Get detailed scores for each section of your resume with specific feedback
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">ATS Optimization</h3>
                  <p className="text-gray-600 text-sm">
                    Ensure your resume passes Applicant Tracking Systems used by employers
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="p-3 bg-cyan-100 rounded-full w-fit mx-auto mb-4">
                    <Award className="h-8 w-8 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Industry Matching</h3>
                  <p className="text-gray-600 text-sm">
                    Check how well your resume matches specific industry requirements
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Overall Score */}
            <Card className="shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Resume Analysis Complete</h2>
                    <p className="text-gray-600">Here's your comprehensive resume analysis</p>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => setAnalysis(null)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Analyze Another
                    </Button>
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)} mb-2`}>
                      {analysis.overallScore}
                    </div>
                    <p className="text-gray-600 font-medium">Overall Score</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(analysis.atsCompatibility)} mb-2`}>
                      {analysis.atsCompatibility}%
                    </div>
                    <p className="text-gray-600 font-medium">ATS Compatible</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(analysis.readabilityScore)} mb-2`}>
                      {analysis.readabilityScore}%
                    </div>
                    <p className="text-gray-600 font-medium">Readability</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(analysis.industryFit.score)} mb-2`}>
                      {analysis.industryFit.score}%
                    </div>
                    <p className="text-gray-600 font-medium">Industry Fit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="sections" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sections">Section Analysis</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="improvements">Improvements</TabsTrigger>
                <TabsTrigger value="industry">Industry Fit</TabsTrigger>
              </TabsList>

              <TabsContent value="sections" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(analysis.sections).map(([section, data]) => (
                    <Card key={section}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="capitalize flex items-center space-x-2">
                            {data.present ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span>{section.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </CardTitle>
                          <Badge className={`${getScoreBgColor(data.score)} ${getScoreColor(data.score)} border-0`}>
                            {data.score}%
                          </Badge>
                        </div>
                        <Progress value={data.score} className="h-2" />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {data.feedback.map((feedback, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              {feedback.startsWith('✓') ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              )}
                              <p className="text-sm text-gray-600">{feedback.substring(2)}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="keywords" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-700 flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Matched Keywords</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywordMatching.matched.map((keyword) => (
                          <Badge key={keyword} className="bg-green-100 text-green-700">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-700 flex items-center space-x-2">
                        <XCircle className="h-5 w-5" />
                        <span>Missing Keywords</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywordMatching.missing.map((keyword) => (
                          <Badge key={keyword} variant="outline" className="border-red-200 text-red-700">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>Keyword Suggestions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.keywordMatching.suggestions.map((suggestion, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <Star className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="improvements" className="space-y-6">
                <div className="space-y-6">
                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="text-red-700 flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>Critical Improvements</span>
                      </CardTitle>
                      <CardDescription>High priority changes that will significantly impact your resume</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.improvements.critical.map((improvement, i) => (
                          <Alert key={i} className="border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription>{improvement}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-200">
                    <CardHeader>
                      <CardTitle className="text-yellow-700 flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Important Improvements</span>
                      </CardTitle>
                      <CardDescription>Medium priority changes that will enhance your resume</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.improvements.important.map((improvement, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-700 flex items-center space-x-2">
                        <Eye className="h-5 w-5" />
                        <span>Minor Improvements</span>
                      </CardTitle>
                      <CardDescription>Low priority polish changes for a better presentation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.improvements.minor.map((improvement, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <Eye className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="industry" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-indigo-600" />
                      <span>Industry Analysis: {analysis.industryFit.industry}</span>
                    </CardTitle>
                    <CardDescription>
                      How well your resume matches the {analysis.industryFit.industry} industry
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl font-bold text-indigo-600">
                          {analysis.industryFit.score}%
                        </div>
                        <div className="flex-1">
                          <Progress value={analysis.industryFit.score} className="h-3" />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Industry-Relevant Keywords Found</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.industryFit.matchedKeywords.map((keyword) => (
                            <Badge key={keyword} className="bg-indigo-100 text-indigo-700">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
