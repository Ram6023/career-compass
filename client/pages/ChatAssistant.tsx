import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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
  MessageCircle,
  Rocket,
  Globe,
  Shield,
  Cpu,
  Heart,
  Coffee,
  Atom,
  Layers,
  PlusCircle,
  Paperclip,
  Smile,
  Home,
  BarChart3,
  FileText,
  Calendar,
  Settings,
  Menu,
  X,
  Maximize2,
  Minimize2,
  Navigation,
  Gamepad2
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useLanguage } from "@/components/ui/language-provider";
import { LanguageSelector } from "@/components/ui/language-selector";
import { authService } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
  type?: "text" | "quick_reply" | "career_card" | "learning_path";
  metadata?: any;
}

interface CareerRecommendation {
  title: string;
  description: string;
  salary: string;
  growth: string;
  skills: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeToLearn: string;
}

const QUICK_STARTERS = [
  {
    icon: Target,
    text: "🎯 Find my dream career",
    category: "Discovery",
    color: "from-violet-500 to-purple-600"
  },
  {
    icon: TrendingUp,
    text: "📊 2024 salary trends",
    category: "Market",
    color: "from-emerald-500 to-teal-600"
  },
  {
    icon: Rocket,
    text: "🚀 Create learning path",
    category: "Growth",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: Brain,
    text: "🤖 AI career opportunities",
    category: "Tech",
    color: "from-cyan-500 to-blue-600"
  },
  {
    icon: Globe,
    text: "🌍 Remote work guide",
    category: "Lifestyle",
    color: "from-pink-500 to-rose-600"
  },
  {
    icon: Briefcase,
    text: "💼 Interview mastery",
    category: "Preparation",
    color: "from-indigo-500 to-purple-600"
  }
];

const EXPERTISE_AREAS = [
  {
    icon: Cpu,
    title: "AI & Technology",
    description: "Machine Learning, Software Engineering, Cloud Computing",
    gradient: "from-blue-600 via-purple-600 to-cyan-500",
    topics: ["AI Engineer", "Full-Stack Developer", "Cloud Architect", "DevOps Engineer"],
    bgPattern: "tech"
  },
  {
    icon: Rocket,
    title: "Product & Design",
    description: "Product Management, UI/UX Design, Growth Strategy",
    gradient: "from-pink-600 via-rose-500 to-orange-500",
    topics: ["Product Manager", "UX Designer", "Growth Lead", "Design Systems"],
    bgPattern: "creative"
  },
  {
    icon: Shield,
    title: "Finance & Security",
    description: "FinTech, Cybersecurity, Blockchain, Risk Management",
    gradient: "from-emerald-600 via-teal-500 to-green-500",
    topics: ["Security Analyst", "FinTech PM", "Blockchain Dev", "Risk Manager"],
    bgPattern: "finance"
  },
  {
    icon: Users,
    title: "Business & Strategy",
    description: "Consulting, Operations, Marketing, Leadership",
    gradient: "from-amber-600 via-orange-500 to-red-500",
    topics: ["Business Analyst", "Strategy Consultant", "Marketing Lead", "Operations"],
    bgPattern: "business"
  }
];

const SAMPLE_CAREERS: { [key: string]: CareerRecommendation } = {
  "software engineer": {
    title: "Software Engineer",
    description: "Design, develop, and maintain software applications and systems",
    salary: "₹8-25 LPA",
    growth: "22% (Much faster than average)",
    skills: ["JavaScript", "Python", "React", "Node.js", "Git"],
    difficulty: "Intermediate",
    timeToLearn: "6-12 months",
  },
  "data scientist": {
    title: "Data Scientist",
    description: "Extract insights from complex data to drive business decisions",
    salary: "₹12-35 LPA",
    growth: "35% (Much faster than average)",
    skills: ["Python", "SQL", "Machine Learning", "Statistics", "Tableau"],
    difficulty: "Advanced",
    timeToLearn: "8-15 months",
  },
  "product manager": {
    title: "Product Manager",
    description: "Lead product strategy and development from conception to launch",
    salary: "₹15-40 LPA",
    growth: "19% (Much faster than average)",
    skills: ["Strategy", "Analytics", "Communication", "Leadership", "Agile"],
    difficulty: "Intermediate",
    timeToLearn: "4-8 months",
  },
  "ui ux designer": {
    title: "UI/UX Designer",
    description: "Create intuitive and engaging user experiences for digital products",
    salary: "₹6-20 LPA",
    growth: "13% (Faster than average)",
    skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "CSS"],
    difficulty: "Beginner",
    timeToLearn: "3-6 months",
  },
};

// Enhanced AI Response System
const generateAIResponse = (
  userMessage: string,
): { content: string; suggestions?: string[]; type?: string; metadata?: any } => {
  const message = userMessage.toLowerCase();

  if (message.includes("career") || message.includes("job") || message.includes("work")) {
    if (message.includes("ai") || message.includes("artificial intelligence") || message.includes("machine learning")) {
      return {
        content: `🤖 **AI & Machine Learning Career Revolution**

The AI field is experiencing unprecedented growth! Here's your pathway to success:

**🚀 High-Impact AI Roles (2024):**
• **AI Engineer** (₹15-45 LPA) - Build intelligent systems
• **ML Engineer** (₹18-50 LPA) - Scale ML models in production
• **Data Scientist** (₹12-35 LPA) - Extract actionable insights
• **AI Research Scientist** (₹25-60 LPA) - Push the boundaries
• **Prompt Engineer** (₹10-30 LPA) - Master AI communication

**🎯 Skills Roadmap (8-12 months):**
**Foundation (Months 1-3):**
• Python programming mastery
• Statistics & probability theory
• Linear algebra fundamentals
• Data structures & algorithms

**Core ML (Months 4-6):**
• Supervised/unsupervised learning
• TensorFlow & PyTorch frameworks
• Neural networks & deep learning
• Model evaluation & optimization

**Specialization (Months 7-9):**
• Computer Vision or NLP focus
• Large Language Models (LLMs)
• MLOps & model deployment
• Cloud platforms (AWS, GCP, Azure)

**Advanced (Months 10-12):**
• Research paper implementation
• Open source contributions
• Portfolio project development
• Interview preparation

**🔥 2024 Hot Technologies:**
• **Generative AI** - GPT, DALL-E, Midjourney
• **Large Language Models** - Fine-tuning, RAG systems
• **Computer Vision** - Object detection, image generation
• **Edge AI** - Mobile and IoT deployment
• **AI Ethics** - Responsible AI development

**💼 Top Hiring Companies:**
**Global Giants:** Google, Microsoft, OpenAI, Meta, Amazon
**Indian Leaders:** Jio, TCS, Infosys, Wipro, Flipkart
**Hot Startups:** Anthropic, Hugging Face, Scale AI, Runway

**💡 Pro Tips for Success:**
• Build a strong GitHub portfolio with AI projects
• Contribute to open-source ML libraries
• Write technical blogs about your learnings
• Participate in Kaggle competitions
• Network with AI researchers and practitioners

Ready to start your AI journey? I can create a personalized learning plan!`,
        suggestions: [
          "📚 Create my AI learning roadmap",
          "💻 Best programming languages for AI",
          "🎯 AI portfolio project ideas",
          "💰 AI job market analysis",
          "🏢 Top AI companies hiring",
          "🤝 AI networking strategies"
        ],
        type: "career_card",
        metadata: {
          title: "AI/ML Engineer",
          salary: "₹15-50 LPA",
          growth: "45% (Extremely high growth)",
          difficulty: "Advanced",
          skills: ["Python", "TensorFlow", "PyTorch", "Statistics", "ML Algorithms"],
        },
      };
    }

    if (message.includes("software") || message.includes("developer") || message.includes("programming")) {
      return {
        content: `💻 **Software Development Career Mastery**

Software engineering offers infinite possibilities and amazing growth potential!

**🎯 Development Career Paths:**
• **Frontend Developer** (₹6-20 LPA) - User interfaces & experiences
• **Backend Developer** (₹8-25 LPA) - Server-side architecture
• **Full-Stack Developer** (₹10-30 LPA) - End-to-end development
• **Mobile Developer** (₹8-22 LPA) - iOS/Android applications
• **DevOps Engineer** (₹12-35 LPA) - Infrastructure & deployment

**🛠️ Technology Ecosystem:**

**Frontend Mastery:**
• **Frameworks:** React, Vue.js, Angular, Svelte
• **Languages:** JavaScript, TypeScript, CSS3, HTML5
• **Tools:** Webpack, Vite, Tailwind CSS, Styled Components

**Backend Excellence:**
• **Languages:** Node.js, Python, Java, Go, Rust
• **Frameworks:** Express, Django, Spring Boot, FastAPI
• **Databases:** PostgreSQL, MongoDB, Redis, Elasticsearch

**Mobile Development:**
• **Cross-Platform:** React Native, Flutter, Ionic
• **Native:** Swift (iOS), Kotlin (Android)
• **Tools:** Expo, Firebase, App Store Connect

**DevOps & Cloud:**
• **Containers:** Docker, Kubernetes, Podman
• **Cloud:** AWS, Azure, Google Cloud Platform
• **CI/CD:** GitHub Actions, Jenkins, GitLab CI

**📈 Career Progression Journey:**
**Year 1-2:** Junior Developer → Learn fundamentals
**Year 3-4:** Mid-Level → Master frameworks & tools
**Year 5-6:** Senior Developer → Architecture & mentoring
**Year 7+:** Tech Lead/Manager → Strategy & leadership

**🌟 Why Choose Software Development:**
• **High Demand:** 1.4M new jobs by 2030
• **Remote Opportunities:** 85% companies offer flexibility
• **Continuous Innovation:** Always learning new technologies
• **Creative Problem Solving:** Build solutions that impact millions
• **Strong Compensation:** Competitive salaries worldwide

**🚀 Getting Started Guide:**
**Step 1:** Choose specialization (Frontend/Backend/Mobile)
**Step 2:** Master one programming language deeply
**Step 3:** Build 5+ portfolio projects
**Step 4:** Contribute to open source projects
**Step 5:** Network with developers & apply for roles

**📁 Portfolio Project Ideas:**
• **E-commerce Platform** - Full-stack application
• **Social Media App** - Real-time features
• **API Service** - RESTful backend with documentation
• **Mobile App** - Cross-platform solution
• **DevOps Pipeline** - Automated deployment system

Ready to build your development career?`,
        suggestions: [
          "🎨 Frontend development roadmap",
          "⚙️ Backend architecture guide",
          "📱 Mobile app development path",
          "☁️ Cloud & DevOps career",
          "📁 Portfolio building strategy",
          "🔍 Job search strategies"
        ],
      };
    }
  }

  if (message.includes("salary") || message.includes("pay") || message.includes("earn")) {
    return {
      content: `💰 **2024 Tech Salary Intelligence Report**

**🇮🇳 India Tech Compensation Breakdown:**

**🌱 Entry Level (0-2 years):**
• **Software Engineer:** ₹6-12 LPA
• **Data Analyst:** ₹4-8 LPA
• **UI/UX Designer:** ₹4-9 LPA
• **Product Associate:** ₹5-10 LPA
• **QA Engineer:** ₹4-8 LPA
• **Digital Marketer:** ₹3-7 LPA

**💪 Mid Level (3-5 years):**
• **Senior Software Engineer:** ₹12-25 LPA
• **Data Scientist:** ₹15-30 LPA
• **Product Manager:** ₹18-35 LPA
• **DevOps Engineer:** ���15-28 LPA
• **Tech Lead:** ₹20-35 LPA
• **Senior Designer:** ₹12-22 LPA

**🏆 Senior Level (6+ years):**
• **Principal Engineer:** ₹35-60 LPA
• **Engineering Manager:** ₹30-50 LPA
• **Senior Product Manager:** ₹35-65 LPA
• **Director of Engineering:** ₹50-80+ LPA
• **VP Product:** ₹60-100+ LPA
• **CTO:** ₹80+ LPA

**🔥 Highest Paying Specializations 2024:**
• **AI/ML Engineer:** ₹20-50 LPA
• **Cloud Solutions Architect:** ₹25-55 LPA
• **Cybersecurity Expert:** ₹18-40 LPA
• **Blockchain Developer:** ₹15-35 LPA
• **Growth Product Manager:** ₹25-50 LPA
• **Staff Engineer:** ₹40-70 LPA

**🏙️ Location Impact on Compensation:**
• **Bangalore/Mumbai:** +25-35% premium over national average
• **Delhi NCR/Hyderabad:** +15-25% premium
• **Pune/Chennai:** +10-20% premium
• **Tier 2 Cities:** Base salary ranges
• **Remote Work:** Increasingly location-independent

**🏢 Company Type Salary Multipliers:**
• **FAANG (Google, Meta, Amazon):** 2-3x market rate + equity
• **Unicorn Startups:** 1.5-2x market + significant equity upside
• **Series A-C Startups:** 1.2-1.8x + equity potential
• **Traditional Enterprise:** 0.8-1.2x market rate
• **Government/PSU:** Lower cash but job security

**🚀 Salary Acceleration Strategies:**

**Short-term (6-12 months):**
• Master high-demand skills (AI, Cloud, Security)
• Earn industry certifications (AWS, Google Cloud, etc.)
• Build impressive side projects
• Contribute to popular open source projects
• Optimize LinkedIn profile for recruiters

**Medium-term (1-2 years):**
• Strategic company switches (20-40% salary jumps)
• Move to higher-paying cities/companies
• Develop leadership & mentoring skills
• Build strong professional network
• Create technical content (blogs, videos)

**Long-term (3-5 years):**
• Transition to management or staff+ track
• Develop deep business acumen
• Build personal brand & thought leadership
• Consider entrepreneurship opportunities
• Mentor others and give back to community

**💪 Negotiation Power Boosters:**
• Multiple competing job offers
• Proven track record with quantified impact
• Rare skill combinations in high demand
• Strong references from industry leaders
• Active participation in tech community

**🎯 Negotiation Framework:**
**Research Phase:** Use Glassdoor, Levels.fyi, AmbitionBox
**Preparation:** Document achievements with metrics
**Strategy:** Negotiate total package (salary + equity + benefits)
**Execution:** Show enthusiasm while maintaining leverage

Want specific negotiation tactics for your situation?`,
      suggestions: [
        "🎯 Salary negotiation masterclass",
        "📈 How to get 40% raise",
        "🏢 Best paying companies 2024",
        "🌐 Remote salary strategies",
        "📊 Salary by experience level",
        "💎 Equity vs cash analysis"
      ],
    };
  }

  // Default comprehensive response
  return {
    content: `🚀 **Welcome to FutureForge AI - Your Career Intelligence Platform**

I'm your advanced AI Career Strategist, powered by cutting-edge technology to accelerate your professional journey!

**🎯 How I Transform Careers:**

**🔍 Intelligent Career Discovery**
• AI-powered personality & skills assessment
• Market opportunity analysis & trend forecasting
• Personalized career path recommendations
• Skills gap identification & prioritization

**📚 Accelerated Learning Systems**
• Custom learning roadmaps with milestone tracking
• Industry-specific skill development paths
• Certification & course recommendations
• Portfolio project guidance & review

**💼 Strategic Job Search Mastery**
• Resume optimization with ATS scoring
• Interview preparation with mock sessions
• Salary negotiation strategies & market data
• Network building & personal branding

**📈 Real-Time Market Intelligence**
• Live salary benchmarks & compensation trends
• Emerging role opportunities & growth areas
• Industry disruption analysis & future-proofing
• Company culture insights & hiring patterns

**🔄 Seamless Career Transitions**
• Strategic pivot planning with risk assessment
• Transferable skills analysis & positioning
• Timeline optimization & milestone setting
• Financial planning during transition periods

**🌟 Advanced Features:**
• **Conversational AI** - Natural language career coaching
• **Predictive Analytics** - Future job market forecasting
• **Personalization Engine** - Tailored advice based on your profile
• **Success Tracking** - Progress monitoring & goal achievement
• **Community Connect** - Network with like-minded professionals

**💡 Just ask me anything!** I provide:
• Specific, actionable career advice
• Data-driven insights & recommendations
• Personalized strategies for your unique goals
• Real-time industry intelligence
• Comprehensive growth planning

Ready to forge your future? What career challenge shall we tackle first?`,
    suggestions: [
      "🎯 Discover my ideal career path",
      "📊 Show me 2024 market trends",
      "🚀 Create my learning roadmap",
      "💼 Master interview strategies",
      "🔄 Plan career transition",
      "💰 Optimize my compensation"
    ],
  };
};

export default function ChatAssistant() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Welcome to **FutureForge AI** ${user?.firstName || "there"}! 🚀

I'm your **Advanced Career Intelligence System** - a next-generation AI strategist designed to accelerate your professional journey.

✨ **What makes me different:**
• **Predictive Analytics** - Forecast career opportunities before they trend
• **Personalized Intelligence** - Tailored strategies based on your unique profile
• **Real-Time Market Data** - Live insights from the latest industry trends
• **Strategic Planning** - Comprehensive roadmaps for career success

🎯 **Ready to transform your career?** 
Ask me anything about career paths, skills, salaries, market trends, or strategic planning!

Let's forge your future together! 🌟`,
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "🎯 Discover my ideal career",
        "📊 Show market trends 2024",
        "🚀 Build learning strategy",
        "💼 Interview mastery guide"
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const processingTime = Math.random() * 2000 + 1500;
    await new Promise((resolve) => setTimeout(resolve, processingTime));

    const aiResponse = generateAIResponse(inputMessage);
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponse.content,
      sender: "bot",
      timestamp: new Date(),
      suggestions: aiResponse.suggestions,
      type: aiResponse.type || "text",
      metadata: aiResponse.metadata,
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleQuickStarter = (text: string) => {
    setInputMessage(text);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
      case "Beginner":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
      case "Intermediate":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
      case "Advanced":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      {/* Revolutionary Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-900/80 border-b border-purple-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand Identity */}
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl shadow-2xl">
                  <Gamepad2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  FutureForge AI
                </h1>
                <p className="text-xs text-slate-400">Career Intelligence Platform</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                to="/"
                className="flex items-center space-x-2 text-slate-300 hover:text-purple-400 transition-all duration-300 font-medium group"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </Link>
              <Link
                to="/careers"
                className="flex items-center space-x-2 text-slate-300 hover:text-purple-400 transition-all duration-300 font-medium group"
              >
                <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Careers</span>
              </Link>
              <Link
                to="/resume-analyzer"
                className="flex items-center space-x-2 text-slate-300 hover:text-purple-400 transition-all duration-300 font-medium group"
              >
                <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Resume AI</span>
              </Link>
              <Link
                to="/tips"
                className="flex items-center space-x-2 text-slate-300 hover:text-purple-400 transition-all duration-300 font-medium group"
              >
                <Lightbulb className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Tips</span>
              </Link>
              <Link
                to="/goals"
                className="flex items-center space-x-2 text-slate-300 hover:text-purple-400 transition-all duration-300 font-medium group"
              >
                <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Goals</span>
              </Link>
            </nav>

            {/* User Controls */}
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="w-10 h-10 rounded-xl border border-purple-500/20 hover:border-purple-400/40 hover:bg-purple-500/10"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {isLoggedIn && user ? (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    asChild
                    className="rounded-xl border border-purple-500/20 hover:border-purple-400/40"
                  >
                    <Link to="/profile" className="flex items-center space-x-2">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span>Profile</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl border-purple-500/20 hover:border-purple-400/40"
                    onClick={() => {
                      authService.signOut();
                      setUser(null);
                      setIsLoggedIn(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    asChild
                    className="rounded-xl border border-purple-500/20 hover:border-purple-400/40"
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-2xl rounded-xl border-0"
                  >
                    <Link to="/register">Join FutureForge</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Interface */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Dynamic Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-96 border-r border-purple-500/20 bg-slate-900/50 backdrop-blur-xl">
            <div className="p-6 space-y-6 h-full overflow-y-auto">
              {/* AI Status Panel */}
              <Card className="border-purple-500/20 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-md opacity-75"></div>
                      <div className="relative p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">
                        AI Career Strategist
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-purple-300">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span>Advanced Intelligence Active</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>Real-time career insights</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <span>Predictive analytics</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <Rocket className="w-4 h-4 text-purple-400" />
                      <span>Future-ready strategies</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Starters */}
              <Card className="border-purple-500/20 bg-slate-800/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg text-white">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    <span>Quick Starters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {QUICK_STARTERS.map((starter, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full text-left justify-start h-auto p-4 text-sm hover:bg-purple-500/10 transition-all rounded-xl border border-transparent hover:border-purple-500/30 group"
                      onClick={() => handleQuickStarter(starter.text)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className={`p-2 bg-gradient-to-r ${starter.color} rounded-lg shadow-lg group-hover:scale-110 transition-transform`}>
                          <starter.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">
                            {starter.text}
                          </div>
                          <div className="text-xs text-slate-400">
                            {starter.category}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Expertise Areas */}
              <Card className="border-purple-500/20 bg-slate-800/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg text-white">
                    <Layers className="h-5 w-5 text-purple-400" />
                    <span>Expertise Areas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {EXPERTISE_AREAS.map((area, index) => (
                    <div
                      key={index}
                      className="p-4 border border-purple-500/20 rounded-xl hover:border-purple-400/40 transition-all cursor-pointer group bg-gradient-to-r hover:from-slate-800/50 hover:to-purple-900/30"
                      onClick={() =>
                        handleQuickStarter(`Tell me about careers in ${area.title}`)
                      }
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 bg-gradient-to-r ${area.gradient} rounded-lg shadow-lg group-hover:scale-110 transition-transform`}>
                          <area.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-white">
                            {area.title}
                          </h4>
                          <p className="text-xs text-slate-400 mb-2">
                            {area.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {area.topics.slice(0, 2).map((topic, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs px-2 py-0 border-purple-500/30 text-purple-300"
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 ring-2 ring-purple-500/50">
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-lg">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <span>FutureForge AI Assistant</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      ✨ Advanced Intelligence
                    </Badge>
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span>Online • Ready to transform your career</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-xl border border-purple-500/20 hover:border-purple-400/40"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-xl border border-purple-500/20 hover:border-purple-400/40"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-xl border border-purple-500/20 hover:border-purple-400/40"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-xl border border-purple-500/20 hover:border-purple-400/40"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 relative overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        message.sender === "user" ? "order-2" : "order-1"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {message.sender === "bot" && (
                          <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-purple-500/50">
                            <AvatarFallback className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white text-xs font-bold">
                              AI
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`rounded-2xl p-5 shadow-2xl backdrop-blur-xl ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white"
                              : "bg-slate-800/80 text-white border border-purple-500/20"
                          }`}
                        >
                          <div className="whitespace-pre-line text-sm leading-relaxed">
                            {message.content}
                          </div>

                          {/* Enhanced Career Card */}
                          {message.type === "career_card" && message.metadata && (
                            <div className="mt-4 p-4 bg-slate-700/50 rounded-xl border border-purple-500/20">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-white">
                                  {message.metadata.title}
                                </h4>
                                <Badge className={getDifficultyColor(message.metadata.difficulty)}>
                                  {message.metadata.difficulty}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="p-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                                  <span className="text-emerald-300 font-medium">
                                    💰 Salary:
                                  </span>
                                  <br />
                                  <span className="text-emerald-100 font-semibold">
                                    {message.metadata.salary}
                                  </span>
                                </div>
                                <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                                  <span className="text-blue-300 font-medium">
                                    📈 Growth:
                                  </span>
                                  <br />
                                  <span className="text-blue-100 font-semibold">
                                    {message.metadata.growth}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-4">
                            <div
                              className={`text-xs ${
                                message.sender === "user"
                                  ? "text-purple-100"
                                  : "text-slate-400"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            {message.sender === "bot" && (
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 opacity-60 hover:opacity-100 rounded-lg hover:bg-purple-500/20"
                                  onClick={() => copyMessage(message.content)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 opacity-60 hover:opacity-100 rounded-lg hover:bg-purple-500/20"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {message.sender === "user" && (
                          <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-slate-600">
                            <AvatarFallback className="bg-slate-700 text-slate-300">
                              {user?.firstName?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      {/* Enhanced Suggestions */}
                      {message.sender === "bot" && message.suggestions && (
                        <div className="mt-4 ml-12 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-9 bg-slate-800/50 hover:bg-purple-500/20 border-purple-500/30 hover:border-purple-400/50 rounded-xl text-purple-300 hover:text-purple-200"
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
                      <Avatar className="h-9 w-9 ring-2 ring-purple-500/50">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white text-xs font-bold">
                          AI
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-slate-800/80 rounded-2xl p-4 shadow-2xl border border-purple-500/20 backdrop-blur-xl">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-400">
                            AI is analyzing and crafting intelligent response...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Advanced Input Area */}
          <div className="border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-xl">
            <div className="p-4">
              <div className="flex space-x-3 items-end">
                <div className="flex-1">
                  <Textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about careers, skills, market trends, or strategic planning..."
                    className="min-h-[60px] max-h-[120px] resize-none bg-slate-800/50 border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-xl"
                    disabled={isTyping}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-12 w-12 p-0 border-purple-500/30 hover:border-purple-400/50 rounded-xl bg-slate-800/50 hover:bg-purple-500/20"
                    disabled={isTyping}
                  >
                    <Paperclip className="h-4 w-4 text-purple-300" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-12 w-12 p-0 border-purple-500/30 hover:border-purple-400/50 rounded-xl bg-slate-800/50 hover:bg-purple-500/20"
                    disabled={isTyping}
                  >
                    <Mic className="h-4 w-4 text-purple-300" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="h-12 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 shadow-2xl rounded-xl border-0"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                <span>Press Enter to send • Shift + Enter for new line</span>
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  <span>Powered by FutureForge AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
