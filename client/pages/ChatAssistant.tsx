import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Compass, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  MessageSquare,
  Lightbulb,
  BookOpen,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  Target,
  Clock,
  Sun,
  Moon,
  Mic,
  MoreVertical,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share,
  Zap,
  Brain,
  Star,
  ChevronRight,
  Search,
  Filter,
  MessageCircle
} from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
import { useLanguage } from '@/components/ui/language-provider';
import { LanguageSelector } from '@/components/ui/language-selector';
import { authService } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
  type?: 'text' | 'quick_reply' | 'career_card' | 'learning_path';
  metadata?: any;
}

interface CareerRecommendation {
  title: string;
  description: string;
  salary: string;
  growth: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToLearn: string;
}

const QUICK_QUESTIONS = [
  "What career is best for me?",
  "Latest tech job trends 2024",
  "How to switch from non-tech to tech?",
  "Best skills to learn for AI careers",
  "Remote work opportunities",
  "How to negotiate salary?",
  "Career change at 30+",
  "Top paying tech jobs"
];

const CAREER_TOPICS = [
  { 
    icon: Brain, 
    title: "AI & Machine Learning", 
    description: "Future-ready AI careers",
    color: "from-purple-500 to-indigo-600"
  },
  { 
    icon: Briefcase, 
    title: "Tech Leadership", 
    description: "Management & strategy roles",
    color: "from-blue-500 to-cyan-600" 
  },
  { 
    icon: TrendingUp, 
    title: "Data Science", 
    description: "Analytics & insights",
    color: "from-green-500 to-emerald-600"
  },
  { 
    icon: Target, 
    title: "Product Management", 
    description: "Build amazing products",
    color: "from-orange-500 to-red-600"
  }
];

const SAMPLE_CAREERS: { [key: string]: CareerRecommendation } = {
  'software engineer': {
    title: 'Software Engineer',
    description: 'Design, develop, and maintain software applications and systems',
    salary: '₹8-25 LPA',
    growth: '22% (Much faster than average)',
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Git'],
    difficulty: 'Intermediate',
    timeToLearn: '6-12 months'
  },
  'data scientist': {
    title: 'Data Scientist',
    description: 'Extract insights from complex data to drive business decisions',
    salary: '₹12-35 LPA',
    growth: '35% (Much faster than average)',
    skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Tableau'],
    difficulty: 'Advanced',
    timeToLearn: '8-15 months'
  },
  'product manager': {
    title: 'Product Manager',
    description: 'Lead product strategy and development from conception to launch',
    salary: '₹15-40 LPA',
    growth: '19% (Much faster than average)',
    skills: ['Strategy', 'Analytics', 'Communication', 'Leadership', 'Agile'],
    difficulty: 'Intermediate',
    timeToLearn: '4-8 months'
  },
  'ui ux designer': {
    title: 'UI/UX Designer',
    description: 'Create intuitive and engaging user experiences for digital products',
    salary: '₹6-20 LPA',
    growth: '13% (Faster than average)',
    skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'CSS'],
    difficulty: 'Beginner',
    timeToLearn: '3-6 months'
  }
};

export default function ChatAssistant() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi ${user?.firstName || 'there'}! 👋 I'm your AI Career Assistant powered by advanced AI. I can help you with career guidance, skill development, salary insights, learning paths, and much more. 

What would you like to explore today?`,
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Find my ideal career path 🎯",
        "Latest job market trends 📈",
        "Skill development roadmap 🚀",
        "Salary negotiation tips 💰"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAdvancedBotResponse = (userMessage: string): { content: string; suggestions?: string[]; type?: string; metadata?: any } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Career path recommendations
    if (lowerMessage.includes('career') && (lowerMessage.includes('best') || lowerMessage.includes('right') || lowerMessage.includes('choose'))) {
      return {
        content: `🎯 **Finding Your Perfect Career Path**

To give you personalized recommendations, I'll analyze your:
• **Interests & Passions** - What excites you?
• **Natural Strengths** - What are you naturally good at?
• **Work Style** - Do you prefer teamwork, independent work, or leadership?
• **Learning Preferences** - Hands-on, theoretical, or creative learning?

**Quick Assessment Questions:**
1. Do you enjoy problem-solving and logical thinking?
2. Are you interested in working with data and analytics?
3. Do you like creating visual designs or user experiences?
4. Are you passionate about leading teams and strategy?

Based on your answers, I can recommend specific career paths with detailed roadmaps, salary expectations, and growth opportunities.`,
        suggestions: [
          "I love problem-solving & coding 💻",
          "I'm interested in data & analytics 📊", 
          "I enjoy design & creativity 🎨",
          "I want to lead and strategize 👔"
        ]
      };
    }

    // Tech career responses
    if (lowerMessage.includes('problem') && (lowerMessage.includes('solving') || lowerMessage.includes('coding'))) {
      const career = SAMPLE_CAREERS['software engineer'];
      return {
        content: `🚀 **Perfect! Software Engineering is ideal for you**

${career.description}

**💰 Salary Range:** ${career.salary}
**📈 Job Growth:** ${career.growth}
**⏱️ Time to Learn:** ${career.timeToLearn}
**🎯 Difficulty:** ${career.difficulty}

**Essential Skills to Master:**
${career.skills.map(skill => `• ${skill}`).join('\n')}

**Learning Roadmap:**
1. **Foundation (Month 1-2):** Programming fundamentals (Python/JavaScript)
2. **Development (Month 3-4):** Web development basics, version control
3. **Advanced (Month 5-6):** Frameworks, databases, system design
4. **Portfolio (Month 7-8):** Build 3-5 projects, prepare for interviews

Would you like a detailed learning plan for any specific area?`,
        suggestions: [
          "Show me the detailed roadmap 🗺️",
          "Best programming language to start? 💻",
          "How to build a portfolio? 📁",
          "Interview preparation tips 🎯"
        ],
        type: 'career_card',
        metadata: career
      };
    }

    // Data analytics interest
    if (lowerMessage.includes('data') || lowerMessage.includes('analytics')) {
      const career = SAMPLE_CAREERS['data scientist'];
      return {
        content: `📊 **Excellent Choice! Data Science is booming**

${career.description}

**💰 Salary Range:** ${career.salary}
**📈 Job Growth:** ${career.growth}
**⏱️ Time to Learn:** ${career.timeToLearn}
**🎯 Difficulty:** ${career.difficulty}

**Core Skills You'll Need:**
${career.skills.map(skill => `• ${skill}`).join('\n')}

**Career Progression Path:**
🔹 **Data Analyst** (₹6-12 LPA) → **Data Scientist** (₹12-25 LPA) → **Senior Data Scientist** (₹25-40 LPA) → **Data Science Manager** (₹40+ LPA)

**Hot Specializations:**
• Machine Learning Engineer
• AI Research Scientist  
• Business Intelligence Analyst
• MLOps Engineer

Ready to dive into the world of data?`,
        suggestions: [
          "Python or R for beginners? 🐍",
          "Best data science courses 📚",
          "Build my first ML project 🤖",
          "Data scientist interview prep 📝"
        ],
        type: 'career_card',
        metadata: career
      };
    }

    // Design and creativity
    if (lowerMessage.includes('design') || lowerMessage.includes('creative') || lowerMessage.includes('ui') || lowerMessage.includes('ux')) {
      const career = SAMPLE_CAREERS['ui ux designer'];
      return {
        content: `🎨 **Amazing! UI/UX Design is perfect for creative minds**

${career.description}

**💰 Salary Range:** ${career.salary}
**📈 Job Growth:** ${career.growth}
**⏱️ Time to Learn:** ${career.timeToLearn}
**🎯 Difficulty:** ${career.difficulty}

**Essential Skills:**
${career.skills.map(skill => `• ${skill}`).join('\n')}

**Design Specializations:**
🎯 **UX Designer** - User research, wireframing, prototyping
🎨 **UI Designer** - Visual design, design systems, branding
📱 **Product Designer** - End-to-end product design
🌐 **Web Designer** - Website design and frontend basics

**Portfolio Building Strategy:**
1. **Case Study 1:** Redesign a popular app (show your process)
2. **Case Study 2:** Create an original app concept
3. **Case Study 3:** Website or dashboard design
4. **Case Study 4:** Mobile app design

Want help creating your first design project?`,
        suggestions: [
          "Help me start my portfolio 📁",
          "Figma vs Adobe - which to learn? 🛠️",
          "UX research methods 🔍",
          "Design system best practices 📐"
        ],
        type: 'career_card',
        metadata: career
      };
    }

    // Leadership and strategy
    if (lowerMessage.includes('lead') || lowerMessage.includes('strategize') || lowerMessage.includes('manage')) {
      const career = SAMPLE_CAREERS['product manager'];
      return {
        content: `👔 **Excellent! Product Management combines strategy with execution**

${career.description}

**💰 Salary Range:** ${career.salary}
**📈 Job Growth:** ${career.growth}
**⏱️ Time to Learn:** ${career.timeToLearn}
**🎯 Difficulty:** ${career.difficulty}

**Key Skills:**
${career.skills.map(skill => `• ${skill}`).join('\n')}

**Product Manager Types:**
🚀 **Technical PM** - Work closely with engineering teams
📊 **Data PM** - Analytics and metrics-driven decisions
🎨 **Design PM** - User experience focused
🌟 **Growth PM** - User acquisition and retention

**Day in the Life:**
• Morning: Review metrics and user feedback
• Midday: Stakeholder meetings and roadmap planning
• Afternoon: Work with design and engineering teams
• Evening: Market research and competitive analysis

Ready to shape the future of products?`,
        suggestions: [
          "How to transition to PM role? 🔄",
          "Essential PM tools to learn 🛠️",
          "Product roadmap examples 🗺️",
          "Stakeholder management tips 🤝"
        ],
        type: 'career_card',
        metadata: career
      };
    }

    // Salary related queries
    if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('earn') || lowerMessage.includes('money')) {
      return {
        content: `💰 **2024 Tech Salary Guide - India**

**Entry Level (0-2 years):**
• Software Engineer: ₹6-12 LPA
• Data Analyst: ₹4-8 LPA  
• UI/UX Designer: ₹4-9 LPA
• Digital Marketer: ₹3-7 LPA

**Mid Level (3-5 years):**
• Senior Software Engineer: ₹12-25 LPA
• Data Scientist: ₹15-30 LPA
• Product Manager: ₹18-35 LPA
• DevOps Engineer: ₹15-28 LPA

**Senior Level (6+ years):**
• Tech Lead: ₹25-45 LPA
• Principal Engineer: ₹35-60 LPA
• Director/VP: ₹50-80+ LPA

**💡 Salary Boosters:**
• Certifications from top platforms
• Contributions to open source
• Building side projects
• Strong LinkedIn presence
• Negotiation skills

**Location Impact:**
🏙️ Bangalore/Mumbai: +20-30% premium
🌆 Pune/Hyderabad: +10-15% premium  
🏘️ Tier 2 cities: Base salaries
🌐 Remote work: Location-independent pay

Want specific salary negotiation strategies?`,
        suggestions: [
          "Salary negotiation tactics 🎯",
          "How to ask for a raise 📈",
          "Stock options vs cash 💎",
          "Remote work salary impact 🌐"
        ]
      };
    }

    // Skills and learning
    if (lowerMessage.includes('skill') || lowerMessage.includes('learn') || lowerMessage.includes('course')) {
      return {
        content: `🚀 **Most In-Demand Skills for 2024**

**🔥 Hot Technical Skills:**
• **AI/ML Engineering** - GPT, LLMs, neural networks
• **Cloud Computing** - AWS, Azure, GCP certifications  
• **Cybersecurity** - Ethical hacking, security analysis
• **Full-Stack Development** - React, Node.js, Python
• **Data Engineering** - Apache Spark, Kafka, Snowflake

**💼 Essential Soft Skills:**
• **Prompt Engineering** - AI communication
• **Cross-functional Collaboration** 
• **Data-driven Decision Making**
• **Remote Team Management**
• **Continuous Learning Mindset**

**📈 Emerging Fields:**
• **Web3 & Blockchain** - Smart contracts, DeFi
• **AR/VR Development** - Metaverse applications
• **IoT Engineering** - Connected devices
• **Quantum Computing** - Next-gen computing
• **Sustainability Tech** - Green technology solutions

**🎯 Learning Strategy:**
1. **Pick 2-3 complementary skills** (don't spread too thin)
2. **Project-based learning** (build while you learn)
3. **Community engagement** (GitHub, Discord, LinkedIn)
4. **Certification paths** (industry-recognized credentials)

Which skill area interests you most?`,
        suggestions: [
          "AI/ML learning roadmap 🤖",
          "Cloud certification guide ☁️",
          "Full-stack development path 💻",
          "Cybersecurity career track 🔒"
        ]
      };
    }

    // Job market trends
    if (lowerMessage.includes('trend') || lowerMessage.includes('market') || lowerMessage.includes('future') || lowerMessage.includes('2024')) {
      return {
        content: `📈 **2024 Job Market Trends & Insights**

**🚀 Fastest Growing Roles:**
• **AI/ML Engineers** (+40% growth, ₹15-50 LPA)
• **Cloud Architects** (+35% growth, ₹20-45 LPA)  
• **DevOps Engineers** (+30% growth, ₹12-35 LPA)
• **Product Managers** (+25% growth, ₹15-40 LPA)
• **Data Scientists** (+28% growth, ₹12-35 LPA)

**🌊 Major Industry Shifts:**
• **Remote-First Culture** - 70% companies offer remote work
• **AI Integration** - Every role needs basic AI literacy
• **Gig Economy Growth** - 40% professionals freelancing  
• **Skills-Based Hiring** - Focus on abilities over degrees
• **Continuous Upskilling** - Learning never stops

**🔥 Hot Industries:**
• **FinTech** - Digital payments, crypto, lending
• **HealthTech** - Telemedicine, health AI
• **EdTech** - Online learning, skill platforms
• **CleanTech** - Renewable energy, sustainability
• **Gaming** - Mobile games, esports, streaming

**💡 Success Strategies:**
• Build T-shaped skills (deep expertise + broad knowledge)
• Create strong personal brand online
• Network actively in your field
• Stay updated with industry news
• Contribute to open source projects

Want insights on any specific industry?`,
        suggestions: [
          "FinTech career opportunities 💳",
          "Remote work best practices 🏠",
          "Personal branding tips 📱",
          "Industry networking strategies 🤝"
        ]
      };
    }

    // Career change
    if (lowerMessage.includes('switch') || lowerMessage.includes('change') || lowerMessage.includes('transition')) {
      return {
        content: `🔄 **Career Transition Success Guide**

**🎯 Popular Transition Paths:**
• **Non-Tech → Tech:** Business Analyst → Product Manager
• **Finance → Data:** Financial Analyst → Data Scientist  
• **Marketing → UX:** Digital Marketer → UX Designer
• **Operations → Tech:** Operations Manager → Project Manager

**📋 Transition Strategy (4-Step Process):**

**1. Skill Gap Analysis (Week 1-2)**
• Identify transferable skills from current role
• Research target role requirements
• List skills you need to develop

**2. Upskilling Phase (3-6 months)**
• Online courses and certifications
• Hands-on projects and portfolio building
• Industry networking and mentorship

**3. Experience Building (2-3 months)**
• Freelance projects in target field
• Volunteer for relevant initiatives  
• Cross-functional projects at current job

**4. Job Search & Interview Prep (1-2 months)**
• Tailor resume for target roles
• Practice behavioral and technical interviews
• Leverage network for referrals

**💪 Age-Specific Advice:**
• **20s:** Experiment freely, take calculated risks
• **30s:** Leverage existing network and experience
• **40s+:** Focus on leadership and strategic roles

Ready to plan your transition?`,
        suggestions: [
          "Create my transition plan 📋",
          "Transferable skills assessment 🔍",
          "Best transition timelines ⏰",
          "Networking for career change 🤝"
        ]
      };
    }

    // Interview preparation
    if (lowerMessage.includes('interview') || lowerMessage.includes('preparation') || lowerMessage.includes('job search')) {
      return {
        content: `🎯 **Master Your Tech Interviews - Complete Guide**

**📋 Interview Types & Preparation:**

**1. Technical Rounds**
• **Coding:** Practice on LeetCode, HackerRank (2-3 problems daily)
• **System Design:** Study scalable architectures  
• **Domain Knowledge:** Deep dive into your field

**2. Behavioral Rounds**
• **STAR Method:** Situation, Task, Action, Result
• **Leadership Stories:** Times you led or influenced others
• **Problem-Solving:** Challenges you overcame

**3. Case Study/Portfolio Review**
• **Walk through your projects** with clear problem-solution narrative
• **Explain your decision-making process**
• **Demonstrate impact and results**

**🚀 Pro Interview Tips:**

**Before Interview:**
• Research company culture, recent news, competitors
• Prepare 5-6 thoughtful questions about the role
• Practice with mock interviews (Pramp, InterviewBit)

**During Interview:**  
• Think out loud during technical problems
• Ask clarifying questions before diving in
• Show enthusiasm and genuine interest

**After Interview:**
• Send thank-you email within 24 hours
• Mention specific conversation points
• Reiterate your interest and fit

**🎪 Common Interview Questions:**
• "Tell me about yourself" (2-minute career story)
• "Why this company/role?" (research + personal motivation)
• "Biggest challenges/failures?" (growth mindset)
• "Where do you see yourself in 5 years?" (career vision)

Want to practice any specific interview type?`,
        suggestions: [
          "Mock technical interview 💻",
          "Behavioral question practice 🗣️",
          "Salary negotiation prep 💰",
          "Company research strategies 🔍"
        ]
      };
    }

    // Default enhanced response
    return {
      content: `🤖 **I'm here to help with your career journey!** 

I can assist you with:

**🎯 Career Planning**
• Personalized career recommendations
• Industry insights and trends
• Skill gap analysis

**📚 Learning & Development**  
• Custom learning roadmaps
• Course and certification recommendations
�� Project ideas for portfolio building

**💼 Job Search Support**
• Interview preparation strategies
• Resume optimization tips
• Salary negotiation guidance

**📈 Market Intelligence**
• Latest job market trends
• Salary benchmarks
• Growth opportunities

**🔄 Career Transitions**
• Career change strategies  
• Skill transfer analysis
• Transition timelines

What specific aspect of your career would you like to explore? I can provide detailed, actionable advice tailored to your goals.`,
      suggestions: [
        "Find my ideal career 🎯",
        "Current job market trends 📈", 
        "Build learning roadmap 📚",
        "Interview preparation 💼"
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time with more realistic delays
    const thinkingTime = Math.random() * 2000 + 1000; // 1-3 seconds
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    const response = generateAdvancedBotResponse(inputMessage);
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: response.content,
      sender: 'bot',
      timestamp: new Date(),
      suggestions: response.suggestions,
      type: response.type || 'text',
      metadata: response.metadata
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied! 📋",
      description: "Message copied to clipboard",
      duration: 2000,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      {/* Modern Header */}
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
                <p className="text-xs text-slate-500 dark:text-slate-400">AI Career Assistant</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/careers" className="text-slate-600 hover:text-rose-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-rose-400">Explore Careers</Link>
              <Link to="/resume-analyzer" className="text-slate-600 hover:text-rose-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-rose-400">Resume Analyzer</Link>
              <Link to="/tips" className="text-slate-600 hover:text-rose-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-rose-400">Daily Tips</Link>
              <Link to="/goals" className="text-slate-600 hover:text-rose-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-rose-400">Goal Tracker</Link>
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
              {isLoggedIn && user ? (
                <>
                  <Button variant="ghost" asChild>
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
                    onClick={() => {
                      authService.signOut();
                      setUser(null);
                      setIsLoggedIn(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg">
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Assistant Info */}
            <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Assistant</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Powered by Advanced AI</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Instant career guidance</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Personalized recommendations</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <Target className="w-4 h-4 text-yellow-500" />
                    <span>Latest market insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Questions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span>Popular Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {QUICK_QUESTIONS.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full text-left justify-start h-auto p-3 text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    <ChevronRight className="w-3 h-3 mr-2 text-rose-500" />
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Career Topics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <BookOpen className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                  <span>Trending Topics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {CAREER_TOPICS.map((topic, index) => (
                  <div 
                    key={index} 
                    className="p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer group bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 dark:hover:from-slate-800 dark:hover:to-gray-800"
                    onClick={() => handleQuickQuestion(`Tell me about ${topic.title}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-gradient-to-r ${topic.color} rounded-lg shadow-sm group-hover:shadow-md transition-shadow`}>
                        <topic.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{topic.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{topic.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[700px] flex flex-col shadow-2xl border-0 overflow-hidden">
              {/* Modern Chat Header */}
              <CardHeader className="bg-gradient-to-r from-rose-500/5 via-pink-500/5 to-purple-600/5 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
                      <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Career AI Assistant</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Online • Typically replies instantly</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Enhanced Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className="flex items-start space-x-3">
                          {message.sender === 'bot' && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white text-xs font-bold">
                                AI
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={`rounded-2xl p-4 shadow-lg ${
                            message.sender === 'user' 
                              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white' 
                              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                          }`}>
                            <div className="whitespace-pre-line text-sm leading-relaxed">
                              {message.content}
                            </div>
                            
                            {/* Career Card for enhanced responses */}
                            {message.type === 'career_card' && message.metadata && (
                              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{message.metadata.title}</h4>
                                  <Badge className={getDifficultyColor(message.metadata.difficulty)}>
                                    {message.metadata.difficulty}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
                                    <span className="text-green-700 dark:text-green-300 font-medium">💰 Salary:</span>
                                    <br />
                                    <span className="text-green-900 dark:text-green-100">{message.metadata.salary}</span>
                                  </div>
                                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                                    <span className="text-blue-700 dark:text-blue-300 font-medium">📈 Growth:</span>
                                    <br />
                                    <span className="text-blue-900 dark:text-blue-100">{message.metadata.growth}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className={`text-xs ${
                                message.sender === 'user' ? 'text-rose-100' : 'text-slate-500 dark:text-slate-400'
                              }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              {message.sender === 'bot' && (
                                <div className="flex items-center space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                                    onClick={() => copyMessage(message.content)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-50 hover:opacity-100">
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {message.sender === 'user' && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {user?.firstName?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        
                        {/* Enhanced Suggestions */}
                        {message.sender === 'bot' && message.suggestions && (
                          <div className="mt-4 ml-11 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-8 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-rose-200 dark:border-rose-800 hover:border-rose-300 dark:hover:border-rose-700"
                                onClick={() => handleSuggestion(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Enhanced Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white text-xs font-bold">
                            AI
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Enhanced Input */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex space-x-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about careers, skills, salaries, or job market trends..."
                      className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 h-12 text-base rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      disabled={isTyping}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-12 w-12 p-0 border-slate-300 dark:border-slate-600"
                      disabled={isTyping}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="h-12 px-6 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg rounded-xl"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>Press Enter to send • Shift + Enter for new line</span>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Powered by Advanced AI</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

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
