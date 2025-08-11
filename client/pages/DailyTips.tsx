import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Lightbulb,
  TrendingUp,
  BookOpen,
  Star,
  Calendar,
  Clock,
  ArrowRight,
  Bookmark,
  Share2,
  Heart,
  Target,
  Brain,
  Compass,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
import { useLanguage } from '@/components/ui/language-provider';
import { LanguageSelector } from '@/components/ui/language-selector';
import { toast } from '@/components/ui/use-toast';

const DAILY_TIPS = [
  {
    id: 1,
    title: "Master the Art of Networking",
    content: "Building meaningful professional relationships is crucial for career growth. Start by connecting with classmates, professors, and industry professionals on LinkedIn. Quality over quantity matters.",
    category: "Career Development",
    readTime: "3 min read",
    date: "Today",
    image: "💼",
    tags: ["networking", "career", "linkedin"]
  },
  {
    id: 2,
    title: "Stay Updated with Industry Trends",
    content: "Follow industry leaders on social media, subscribe to relevant newsletters, and join professional communities. Being aware of trends helps you stay competitive.",
    category: "Industry Insights",
    readTime: "4 min read",
    date: "Yesterday",
    image: "📈",
    tags: ["trends", "industry", "growth"]
  },
  {
    id: 3,
    title: "Develop Your Personal Brand",
    content: "Your personal brand is how you present yourself professionally. Create a consistent online presence that showcases your skills, values, and career aspirations.",
    category: "Personal Development",
    readTime: "5 min read",
    date: "2 days ago",
    image: "🎯",
    tags: ["branding", "career", "identity"]
  },
  {
    id: 4,
    title: "The Power of Continuous Learning",
    content: "In today's fast-paced world, skills become obsolete quickly. Embrace lifelong learning through online courses, certifications, and hands-on projects.",
    category: "Skill Development",
    readTime: "6 min read",
    date: "3 days ago",
    image: "📚",
    tags: ["learning", "skills", "education"]
  }
];

const MOTIVATIONAL_QUOTES = [
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    quote: "Your career is what you're paid for, your calling is what you're made for.",
    author: "Steve Harvey"
  }
];

const INDUSTRY_NEWS = [
  {
    id: 1,
    title: "AI and Machine Learning Job Market Grows by 35%",
    summary: "The demand for AI professionals continues to surge across industries, with new opportunities emerging daily.",
    source: "Tech Career Weekly",
    time: "2 hours ago",
    category: "Technology"
  },
  {
    id: 2,
    title: "Remote Work Skills in High Demand",
    summary: "Companies are prioritizing candidates with proven remote collaboration and digital communication skills.",
    source: "Future of Work Report",
    time: "5 hours ago",
    category: "Workplace Trends"
  },
  {
    id: 3,
    title: "Green Jobs Market Expected to Double by 2030",
    summary: "Sustainability careers are becoming mainstream as companies prioritize environmental responsibility.",
    source: "Sustainability Today",
    time: "1 day ago",
    category: "Sustainability"
  }
];

export default function DailyTips() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [bookmarkedTips, setBookmarkedTips] = useState<number[]>([]);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleBookmark = (tipId: number) => {
    setBookmarkedTips(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
    toast({
      title: bookmarkedTips.includes(tipId) ? "Bookmark Removed" : "Bookmark Added",
      description: bookmarkedTips.includes(tipId) ? "Tip removed from bookmarks" : "Tip saved to bookmarks",
      duration: 2000,
    });
  };

  const shareTip = (tip: any) => {
    if (navigator.share) {
      navigator.share({
        title: tip.title,
        text: tip.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${tip.title}: ${tip.content}`);
      toast({
        title: "Copied to Clipboard",
        description: "Tip content copied to clipboard",
        duration: 2000,
      });
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
                <p className="text-xs text-slate-500 dark:text-slate-400">Daily Tips & Motivation</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/careers" className="text-slate-600 hover:text-rose-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-rose-400">Explore Careers</Link>
              <Link to="/resume-analyzer" className="text-slate-600 hover:text-rose-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-rose-400">Resume Analyzer</Link>
              <Link to="/goals" className="text-slate-600 hover:text-rose-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-rose-400">Goal Tracker</Link>
              <Link to="/chat" className="text-slate-600 hover:text-rose-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-rose-400">AI Assistant</Link>
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
            <div className="p-4 bg-gradient-to-br from-rose-500/20 to-pink-600/20 rounded-2xl backdrop-blur-sm shadow-xl">
              <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                <Lightbulb className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            Daily Career
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent block">
              Tips & Motivation
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Get AI-curated career tips, industry insights, and daily motivation to accelerate your professional growth.
          </p>
        </div>

        {/* Motivational Quote */}
        <Card className="max-w-4xl mx-auto mb-12 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <Brain className="h-8 w-8 text-rose-600 mx-auto mb-4" />
            <blockquote className="text-2xl font-medium text-slate-700 dark:text-slate-300 mb-4 italic">
              "{MOTIVATIONAL_QUOTES[currentQuote].quote}"
            </blockquote>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              — {MOTIVATIONAL_QUOTES[currentQuote].author}
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="tips" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="tips" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Daily Tips</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Industry News</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Resources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tips" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {DAILY_TIPS.map((tip) => (
                <Card key={tip.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{tip.image}</span>
                        <div>
                          <Badge variant="secondary" className="text-xs mb-2">
                            {tip.category}
                          </Badge>
                          <CardTitle className="text-lg leading-tight">{tip.title}</CardTitle>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(tip.id)}
                          className="p-2"
                        >
                          <Bookmark className={`h-4 w-4 ${bookmarkedTips.includes(tip.id) ? 'fill-current text-rose-600' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareTip(tip)}
                          className="p-2"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      {tip.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{tip.readTime}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{tip.date}</span>
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {tip.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <div className="space-y-4">
              {INDUSTRY_NEWS.map((article) => (
                <Card key={article.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-slate-500">{article.time}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-3">
                        {article.summary}
                      </p>
                      <p className="text-sm text-slate-500">
                        Source: {article.source}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-4">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-rose-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Career Guides</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  Comprehensive guides for different career paths and industries.
                </p>
                <Button variant="outline" size="sm">
                  Explore Guides
                </Button>
              </Card>
              
              <Card className="p-6 text-center">
                <Star className="w-12 h-12 text-rose-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Skill Assessments</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  Evaluate your current skills and identify areas for improvement.
                </p>
                <Button variant="outline" size="sm">
                  Take Assessment
                </Button>
              </Card>
              
              <Card className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-rose-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Market Insights</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  Latest trends and salary data for your target career.
                </p>
                <Button variant="outline" size="sm">
                  View Insights
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Developed and Designed by <span className="font-semibold text-rose-600 dark:text-rose-400">Sriram</span>
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
              © {new Date().getFullYear()} CareerCompass. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
