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
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useLanguage } from "@/components/ui/language-provider";
import { LanguageSelector } from "@/components/ui/language-selector";
import { authService } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";

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

const QUICK_QUESTIONS = [
  "🎯 What career is perfect for me?",
  "📊 Tech salary trends 2024",
  "🔄 Career transition guide",
  "🤖 AI & ML career roadmap",
  "🏠 Remote work opportunities",
  "💰 Salary negotiation secrets",
  "🚀 Startup vs Big Tech",
  "📈 Future-proof skills",
];

const CAREER_CATEGORIES = [
  {
    icon: Cpu,
    title: "AI & Tech",
    subtitle: "Future of technology",
    gradient: "from-cyan-500 via-blue-500 to-purple-600",
    topics: ["AI Engineer", "ML Scientist", "Data Engineer", "Cloud Architect"],
  },
  {
    icon: Rocket,
    title: "Product & Design",
    subtitle: "Build amazing products",
    gradient: "from-pink-500 via-rose-500 to-orange-500",
    topics: [
      "Product Manager",
      "UX Designer",
      "UI Developer",
      "Design Systems",
    ],
  },
  {
    icon: Globe,
    title: "Business & Strategy",
    subtitle: "Drive growth & innovation",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    topics: [
      "Business Analyst",
      "Strategy Consultant",
      "Growth Hacker",
      "Operations",
    ],
  },
  {
    icon: Shield,
    title: "Security & Finance",
    subtitle: "Protect & optimize",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    topics: ["Cybersecurity", "FinTech", "Blockchain", "Risk Analysis"],
  },
];

const SAMPLE_CAREERS: { [key: string]: CareerRecommendation } = {
  "software engineer": {
    title: "Software Engineer",
    description:
      "Design, develop, and maintain software applications and systems",
    salary: "₹8-25 LPA",
    growth: "22% (Much faster than average)",
    skills: ["JavaScript", "Python", "React", "Node.js", "Git"],
    difficulty: "Intermediate",
    timeToLearn: "6-12 months",
  },
  "data scientist": {
    title: "Data Scientist",
    description:
      "Extract insights from complex data to drive business decisions",
    salary: "₹12-35 LPA",
    growth: "35% (Much faster than average)",
    skills: ["Python", "SQL", "Machine Learning", "Statistics", "Tableau"],
    difficulty: "Advanced",
    timeToLearn: "8-15 months",
  },
  "product manager": {
    title: "Product Manager",
    description:
      "Lead product strategy and development from conception to launch",
    salary: "₹15-40 LPA",
    growth: "19% (Much faster than average)",
    skills: ["Strategy", "Analytics", "Communication", "Leadership", "Agile"],
    difficulty: "Intermediate",
    timeToLearn: "4-8 months",
  },
  "ui ux designer": {
    title: "UI/UX Designer",
    description:
      "Create intuitive and engaging user experiences for digital products",
    salary: "₹6-20 LPA",
    growth: "13% (Faster than average)",
    skills: [
      "Figma",
      "Adobe Creative Suite",
      "User Research",
      "Prototyping",
      "CSS",
    ],
    difficulty: "Beginner",
    timeToLearn: "3-6 months",
  },
};

// Integrated AI Response System
const generateAIResponse = (
  userMessage: string,
): {
  content: string;
  suggestions?: string[];
  type?: string;
  metadata?: any;
} => {
  const message = userMessage.toLowerCase().trim();

  // Handle greetings and casual conversations
  if (
    message === "hi" ||
    message === "hello" ||
    message === "hey" ||
    message === "hii" ||
    message.includes("good morning") ||
    message.includes("good afternoon") ||
    message.includes("good evening")
  ) {
    const greetings = [
      "👋 Hello there! Welcome to CareerCompass AI! I'm your personal career strategist, ready to help you navigate your professional journey. What can I help you explore today?",
      "🌟 Hi! Great to see you here! I'm your AI career advisor, and I'm excited to help you discover amazing career opportunities. What's on your mind?",
      "✨ Hey! Welcome to your personal career guidance session! I'm here to help you with career advice, job market insights, salary information, and much more. How can I assist you?"
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    return {
      content: randomGreeting,
      suggestions: [
        "🎯 Find my ideal career",
        "💰 Show salary trends 2024",
        "📚 Create learning roadmap",
        "💼 Interview preparation tips",
        "🔄 Plan career transition"
      ]
    };
  }

  // Handle "how are you" type questions
  if (
    message.includes("how are you") ||
    message.includes("how do you do") ||
    message.includes("what's up") ||
    message.includes("whats up")
  ) {
    return {
      content: "🤖 I'm doing great, thank you for asking! I'm here and ready to help you with all your career-related questions. I'm constantly learning and updating my knowledge about the job market, industry trends, and career opportunities.\n\nHow are you doing? What career goals are you working towards today? 🚀",
      suggestions: [
        "🎯 Help me choose a career",
        "📈 Show me job market trends",
        "💡 I need career advice",
        "🎓 Help with skill development"
      ]
    };
  }

  // Handle thank you messages
  if (
    message.includes("thank you") ||
    message.includes("thanks") ||
    message.includes("appreciate")
  ) {
    return {
      content: "🙏 You're very welcome! I'm so glad I could help you with your career journey. Remember, I'm always here whenever you need guidance, advice, or just want to explore new opportunities.\n\nFeel free to ask me anything about careers, skills, salaries, or job market trends anytime! 😊",
      suggestions: [
        "🔮 What's next for my career?",
        "📊 Industry insights",
        "🎯 Set career goals",
        "💪 Skill development tips"
      ]
    };
  }

  // Handle general questions about the AI
  if (
    message.includes("who are you") ||
    message.includes("what are you") ||
    message.includes("tell me about yourself") ||
    message.includes("introduce yourself")
  ) {
    return {
      content: "🤖 **I'm your AI Career Strategist!**\n\nI'm an advanced artificial intelligence designed specifically to help you navigate your career journey. Here's what I can do for you:\n\n**🎯 Career Guidance:**\n• Help you discover ideal career paths\n• Provide personalized career recommendations\n• Analyze your skills and interests\n\n**💼 Job Market Intelligence:**\n• Real-time salary benchmarks\n• Industry trends and insights\n• Future job predictions\n\n**📚 Learning & Development:**\n• Custom learning roadmaps\n• Skill gap analysis\n• Course recommendations\n\n**💡 Professional Support:**\n• Interview preparation\n• Resume optimization tips\n• Career transition planning\n\nI'm here 24/7 to help you make informed career decisions and achieve your professional goals! What would you like to explore first?",
      suggestions: [
        "🎯 Find careers that match me",
        "💰 Show current salary trends",
        "📚 Create my learning plan",
        "🚀 Help me change careers"
      ]
    };
  }

  // Handle basic questions
  if (
    message.includes("help") ||
    message.includes("what can you do") ||
    message.includes("how can you help")
  ) {
    return {
      content: "💡 **I'm here to supercharge your career journey!**\n\nHere are the main ways I can help you:\n\n**🔍 Career Discovery**\n• Find careers that match your personality\n• Explore new and emerging fields\n• Get industry-specific insights\n\n**📊 Market Intelligence**\n• Current salary data and trends\n• Job demand forecasting\n• Skills gap analysis\n\n**🎓 Learning Guidance**\n• Personalized learning roadmaps\n• Course and certification recommendations\n• Skill development strategies\n\n**💼 Job Search Support**\n• Interview preparation and tips\n• Resume optimization advice\n• Networking strategies\n\n**🔄 Career Transitions**\n• Career change planning\n• Skill transfer analysis\n• Timeline and milestone setting\n\nJust ask me anything about careers, and I'll provide detailed, actionable advice! What specific area would you like to explore?",
      suggestions: [
        "🎯 Discover my ideal career",
        "💰 Check salary information",
        "📚 Plan my learning journey",
        "🔄 Help me switch careers",
        "💼 Interview preparation"
      ]
    };
  }

  // Advanced AI pattern matching for career guidance
  if (
    message.includes("career") ||
    message.includes("job") ||
    message.includes("work")
  ) {
    if (
      message.includes("ai") ||
      message.includes("artificial intelligence") ||
      message.includes("machine learning")
    ) {
      return {
        content: `🤖 **AI & Machine Learning Career Path**

The AI field is exploding with opportunities! Here's your complete roadmap:

**🚀 High-Demand AI Roles:**
• **AI Engineer** (₹15-45 LPA) - Build AI systems & models
• **ML Engineer** (₹18-50 LPA) - Deploy ML models at scale  
• **Data Scientist** (₹12-35 LPA) - Extract insights from data
• **AI Research Scientist** (₹25-60 LPA) - Cutting-edge research
• **Prompt Engineer** (₹10-30 LPA) - Optimize AI interactions

**📚 Learning Path (8-12 months):**
**Phase 1:** Python programming + Statistics fundamentals
**Phase 2:** Machine Learning algorithms + TensorFlow/PyTorch
**Phase 3:** Deep Learning + Neural Networks
**Phase 4:** Specialized areas (NLP, Computer Vision, etc.)

**🔥 Hot Skills for 2024:**
• Prompt Engineering (ChatGPT, Claude, etc.)
• Large Language Models (LLMs)
• Computer Vision & Image Recognition
• Natural Language Processing
• MLOps & Model Deployment

**💼 Top Companies Hiring:**
• Google, Microsoft, OpenAI
• Meta, Amazon, Apple
• Startups: Anthropic, Hugging Face, Scale AI
• Indian: Jio, TCS, Infosys, Flipkart

Ready to dive into AI? I can create your personalized learning plan!`,
        suggestions: [
          "📚 Create my AI learning roadmap",
          "💻 Best AI programming languages",
          "🎯 AI portfolio project ideas",
          "💰 AI job market & salaries",
          "🏢 Top AI companies to work for",
        ],
        type: "career_card",
        metadata: {
          title: "AI/ML Engineer",
          salary: "₹15-50 LPA",
          growth: "45% (Extremely high growth)",
          difficulty: "Advanced",
          skills: [
            "Python",
            "TensorFlow",
            "PyTorch",
            "Statistics",
            "ML Algorithms",
          ],
        },
      };
    }

    if (
      message.includes("software") ||
      message.includes("developer") ||
      message.includes("programming")
    ) {
      return {
        content: `💻 **Software Development Career Guide**

Software engineering offers amazing opportunities with flexibility and growth!

**🎯 Popular Development Paths:**
• **Frontend Developer** (₹6-20 LPA) - User interfaces & experiences
• **Backend Developer** (₹8-25 LPA) - Server-side logic & APIs
• **Full-Stack Developer** (₹10-30 LPA) - Complete web applications
• **Mobile Developer** (₹8-22 LPA) - iOS/Android applications
• **DevOps Engineer** (₹12-35 LPA) - Infrastructure & deployment

**🛠️ Essential Technology Stack:**
**Frontend:** React, Vue.js, Angular, TypeScript
**Backend:** Node.js, Python Django, Java Spring, .NET
**Mobile:** React Native, Flutter, Swift, Kotlin
**Database:** PostgreSQL, MongoDB, Redis
**Cloud:** AWS, Azure, Google Cloud Platform

**📈 Career Progression:**
Junior Developer → Senior Developer → Tech Lead → Engineering Manager → CTO

**🌟 Why Choose Software Development:**
• High demand across all industries
• Remote work opportunities
• Continuous learning & innovation
• Strong earning potential
• Creative problem-solving

**🚀 Getting Started:**
1. Choose your specialization (Frontend/Backend/Mobile)
2. Master one programming language deeply
3. Build 3-5 portfolio projects
4. Contribute to open source
5. Apply for internships/junior roles

Want me to create a detailed roadmap for your chosen specialization?`,
        suggestions: [
          "🎨 Frontend development path",
          "⚙️ Backend development guide",
          "📱 Mobile app development",
          "☁️ Cloud & DevOps career",
          "📁 Portfolio project ideas",
        ],
      };
    }

    if (
      message.includes("design") ||
      message.includes("ui") ||
      message.includes("ux")
    ) {
      return {
        content: `��� **UI/UX Design Career Roadmap**

Design is where creativity meets technology - shape digital experiences!

**🎯 Design Career Paths:**
• **UX Designer** (₹6-18 LPA) - User research & experience design
• **UI Designer** (���5-15 LPA) - Visual design & interfaces
• **Product Designer** (₹10-25 LPA) - End-to-end product design
• **UX Researcher** (₹8-20 LPA) - User behavior & insights
• **Design Systems Lead** (₹15-30 LPA) - Scalable design frameworks

**🛠️ Designer's Toolkit:**
**Design:** Figma, Sketch, Adobe Creative Suite
**Prototyping:** InVision, Principle, Framer
**Research:** Hotjar, Maze, UserTesting
**Collaboration:** Miro, FigJam, Notion

**📚 Learning Journey (4-6 months):**
**Month 1-2:** Design fundamentals + Figma mastery
**Month 3-4:** User research + prototyping
**Month 5-6:** Portfolio building + job applications

**🎨 Portfolio Strategy:**
• 3-4 case studies showing your process
• Mix of redesigns and original concepts
��� Include user research and testing
• Show before/after comparisons

**🌟 Design Trends 2024:**
• AI-powered design tools
• Voice & conversational interfaces
• Sustainable & inclusive design
• AR/VR experiences
• Micro-interactions & animations

Ready to start your design journey?`,
        suggestions: [
          "🎨 Build my design portfolio",
          "🔍 UX research methods",
          "🛠️ Best design tools to learn",
          "📐 Design system creation",
          "💼 Design job interview prep",
        ],
      };
    }
  }

  if (
    message.includes("salary") ||
    message.includes("pay") ||
    message.includes("earn")
  ) {
    return {
      content: `💰 **2024 Tech Salary Guide - Complete Breakdown**

**🇮🇳 India Tech Salary Ranges:**

**🌱 Entry Level (0-2 years):**
• Software Engineer: ₹6-12 LPA
• Data Analyst: ₹4-8 LPA
• UI/UX Designer: ₹4-9 LPA
• Digital Marketer: ₹3-7 LPA
• QA Engineer: ₹4-8 LPA

**💪 Mid Level (3-5 years):**
• Senior Software Engineer: ₹12-25 LPA
• Data Scientist: ₹15-30 LPA
• Product Manager: ₹18-35 LPA
• DevOps Engineer: ₹15-28 LPA
• Tech Lead: ₹20-35 LPA

**🏆 Senior Level (6+ years):**
• Principal Engineer: ₹35-60 LPA
• Engineering Manager: ₹30-50 LPA
• Senior Product Manager: ₹35-65 LPA
• Director/VP Engineering: ₹50-80+ LPA

**🔥 Highest Paying Specializations:**
• AI/ML Engineer: ₹20-50 LPA
• Cloud Architect: ₹25-55 LPA
• Cybersecurity Expert: ₹18-40 LPA
• Blockchain Developer: ₹15-35 LPA
• Growth Product Manager: ₹25-50 LPA

**🏙️ Location Impact:**
• Bangalore/Mumbai: +25-35% premium
• Delhi NCR/Hyderabad: +15-25% premium
• Pune/Chennai: +10-20% premium
• Remote work: Location-independent pay

**🚀 Salary Boosters:**
• Master in-demand skills (AI, Cloud, Security)
• Get industry certifications
• Build strong portfolio & personal brand
• Switch companies strategically
• Negotiate effectively

Want specific salary negotiation strategies?`,
      suggestions: [
        "🎯 Salary negotiation tips",
        "📈 How to get a 30% raise",
        "🏢 Best paying companies",
        "🌐 Remote salary trends",
        "📊 Salary by city comparison",
      ],
    };
  }

  if (message.includes("interview") || message.includes("job search")) {
    return {
      content: `🎯 **Master Tech Interviews - Complete Guide**

**📋 Interview Process Stages:**

**1. Application Screening (1-2 days)**
• Resume/Portfolio review
• Initial recruiter call
• Basic qualification check

**2. Technical Assessment (3-5 days)**
• Coding challenges (LeetCode style)
• Take-home projects
• System design (for senior roles)

**3. Final Interviews (1 day)**
• Technical deep-dive with team
• Behavioral questions (STAR method)
• Culture fit assessment
• Salary negotiation

**💻 Technical Prep Strategy:**
**Coding Interviews:**
• Practice 2-3 LeetCode problems daily
• Master: Arrays, Trees, Graphs, Dynamic Programming
• Language: Python (readability) or Java (performance)

**System Design:**
• Study: Load balancers, Databases, Caching
• Practice: Design Twitter, Uber, Netflix
• Focus: Scalability, Reliability, Trade-offs

**🗣️ Behavioral Interview Mastery:**
• Prepare 5-7 STAR stories
• Leadership, Problem-solving, Failure/Learning
• Research company culture & values
• Prepare thoughtful questions

**💰 Negotiation Tips:**
• Never accept first offer
• Research market rates (Glassdoor, Levels.fyi)
• Negotiate total package (salary + equity + benefits)
• Show enthusiasm while having leverage

**🚀 Success Timeline:**
**Week 1-2:** Resume optimization + company research
**Week 3-6:** Technical skill practice
**Week 7-8:** Mock interviews + applications
**Week 9-12:** Active interviewing + negotiation

Ready to crush your next interview?`,
      suggestions: [
        "💻 Coding interview practice",
        "🗣️ Behavioral questions prep",
        "💰 Salary negotiation guide",
        "🏢 Company research tips",
        "📝 Resume optimization",
      ],
    };
  }

  if (
    message.includes("learn") ||
    message.includes("skill") ||
    message.includes("course")
  ) {
    return {
      content: `🚀 **2024's Most In-Demand Skills & Learning Strategy**

**🔥 Top Technical Skills:**

**AI & Machine Learning** 🤖
• Python for AI/ML
• TensorFlow, PyTorch
• Prompt Engineering
• Computer Vision, NLP
• MLOps & Model Deployment

**Cloud Computing** ☁️
• AWS, Azure, Google Cloud
• Kubernetes, Docker
• Infrastructure as Code
• Serverless Computing
• DevOps & CI/CD

**Programming Languages** 💻
• Python (AI, Web, Automation)
• JavaScript/TypeScript (Web Development)
• Go (Backend, Microservices)
• Rust (System Programming)
• Swift/Kotlin (Mobile Development)

**💼 Essential Soft Skills:**
• AI Collaboration & Prompt Engineering
• Remote Team Leadership
• Data-Driven Decision Making
• Cross-Cultural Communication
• Continuous Learning Mindset

**📚 Effective Learning Strategy:**

**The 70-20-10 Rule:**
• 70% Hands-on Projects
• 20% Structured Courses
• 10% Networking & Mentorship

**Learning Timeline (3 months):**
**Month 1:** Foundation through courses
**Month 2:** Build practice projects
**Month 3:** Real-world application

**🎯 Best Learning Platforms:**
• **Free:** freeCodeCamp, YouTube, GitHub
• **Paid:** Udemy, Coursera, Pluralsight
• **Interactive:** Codewars, HackerRank
• **Projects:** GitHub, CodePen, Kaggle

**🏆 Learning Accelerators:**
• Join developer communities
• Contribute to open source
• Build projects, not just tutorials
• Teach others (blog, YouTube)
• Get mentorship

Which skill would you like to master first?`,
      suggestions: [
        "🤖 AI/ML learning path",
        "☁️ Cloud certification guide",
        "💻 Programming roadmap",
        "📊 Data science track",
        "🎨 Design skills development",
      ],
    };
  }

  // Default intelligent response
  return {
    content: `🤖 **Your AI Career Strategist is Ready!**

I'm powered by advanced AI to provide personalized career guidance!

**🎯 How I Can Help You:**

**🔍 Career Discovery**
• Personality-based career matching
• Skills assessment & gap analysis
• Industry insights & trends
• Growth opportunity identification

**📚 Learning & Development**
• Custom learning roadmaps
• Skill prioritization strategies
• Course & certification recommendations
• Portfolio development guidance

**💼 Job Search Support**
• Interview preparation & practice
• Resume optimization tips
• Salary negotiation strategies
• Network building approaches

**📈 Market Intelligence**
• Real-time salary benchmarks
• Emerging role opportunities
• Industry disruption analysis
• Future-proofing strategies

**🔄 Career Transitions**
• Career pivot planning
• Skill transfer analysis
• Timeline & milestone setting
• Risk mitigation strategies

💡 **Just ask me anything!** I can provide specific, actionable advice tailored to your unique goals and situation.

What would you like to explore first?`,
    suggestions: [
      "🎯 Find my ideal career",
      "📊 Show salary trends 2024",
      "🚀 Create learning roadmap",
      "💼 Interview preparation",
      "🔄 Plan career transition",
    ],
  };
};

export default function ChatAssistant() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(
    authService.isAuthenticatedSync(),
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello ${user?.firstName || "there"}! 👋 

I'm your **AI Career Strategist** - your personal guide to navigating the future of work. 

✨ **What I can help you with:**
• Discover your ideal career path
• Get real-time salary insights  
• Create personalized learning roadmaps
• Stay ahead of industry trends
• Master interview strategies

Let's unlock your potential together! What career goals are you exploring today?`,
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "🎯 Find my dream career",
        "💰 Show me salary trends",
        "🚀 Build learning roadmap",
        "🔮 Future job predictions",
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Multiple fallback methods for scrolling
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        try {
          // Method 1: scrollIntoView
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        } catch (e) {
          // Method 2: direct scroll on container
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        }
      });
    }
  };

  useEffect(() => {
    // Scroll when messages change
    if (messages.length > 0) {
      // Use a longer timeout to ensure content is rendered
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages]); // Depend on full messages array for better scrolling

  // Additional useEffect for scrolling after typing indicator changes
  useEffect(() => {
    if (!isTyping && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    }
  }, [isTyping]);

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

    // Focus back to input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Simulate AI thinking time with more realistic delays
    const thinkingTime = Math.random() * 2000 + 1500; // 1.5-3.5 seconds
    await new Promise((resolve) => setTimeout(resolve, thinkingTime));

    const response = generateAIResponse(inputMessage);
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: response.content,
      sender: "bot",
      timestamp: new Date(),
      suggestions: response.suggestions,
      type: response.type || "text",
      metadata: response.metadata,
    };

    setMessages((prev) => [...prev, botResponse]);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-teal-50/20 to-blue-50/30 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-blue-950/30">
      <Header pageSubtitle="AI Career Strategist" />

      <div className="container mx-auto px-4 lg:px-8 py-6 max-w-8xl">
        <div
          className={`grid gap-6 lg:gap-8 transition-all duration-300 ${
            showSidebar ? "lg:grid-cols-5" : "lg:grid-cols-1"
          }`}
        >
          {/* Enhanced Sidebar */}
          {showSidebar && (
            <div className="lg:col-span-1 space-y-4 lg:space-y-6">
              {/* AI Assistant Status */}
              <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-blue-500/10 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 rounded-xl shadow-lg">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        AI Career Strategist
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span>Powered by Advanced AI</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Zap className="w-4 h-4 text-emerald-500" />
                      <span>Instant career insights</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Target className="w-4 h-4 text-teal-500" />
                      <span>Personalized roadmaps</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Rocket className="w-4 h-4 text-blue-500" />
                      <span>Future-ready guidance</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Questions */}
              <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-emerald-100/50 dark:border-emerald-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-emerald-500" />
                    <span>Quick Start Questions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {QUICK_QUESTIONS.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full text-left justify-start h-auto p-3 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all rounded-xl border-0"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      <ChevronRight className="w-3 h-3 mr-2 text-emerald-500" />
                      {question}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Career Categories */}
              <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-emerald-100/50 dark:border-emerald-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Layers className="h-5 w-5 text-emerald-500" />
                    <span>Career Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {CAREER_CATEGORIES.map((category, index) => (
                    <div
                      key={index}
                      className="p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 dark:hover:from-slate-800 dark:hover:to-gray-800"
                      onClick={() =>
                        handleQuickQuestion(
                          `Tell me about careers in ${category.title}`,
                        )
                      }
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 bg-gradient-to-r ${category.gradient} rounded-lg shadow-sm group-hover:shadow-md transition-shadow`}
                        >
                          <category.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            {category.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                            {category.subtitle}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {category.topics.slice(0, 2).map((topic, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs px-2 py-0"
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Chat Interface */}
          <div
            className={`${
              showSidebar ? "lg:col-span-4" : "lg:col-span-1"
            } transition-all duration-300`}
          >
            <Card className="h-[calc(100vh-140px)] flex flex-col shadow-2xl border-0 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-emerald-100/30 dark:border-emerald-800/30">
              {/* Modern Chat Header */}
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-b border-emerald-200/30 dark:border-emerald-700/30 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-emerald-500/30">
                      <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 text-white font-bold text-lg">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                        <span>AI Career Strategist</span>
                        <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600">
                          ✨ GPT-4 Powered
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span>Online • Responds instantly</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 rounded-xl"
                      onClick={() => setShowSidebar(!showSidebar)}
                    >
                      <Layers className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 rounded-xl"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 rounded-xl"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Enhanced Messages Container */}
              <div className="flex-1 relative overflow-hidden">
                <div
                  className="h-full overflow-y-auto scroll-smooth"
                  ref={messagesContainerRef}
                  style={{ maxHeight: 'calc(100vh - 280px)' }}
                >
                  <div className="p-6 space-y-6 min-h-full">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] ${
                            message.sender === "user" ? "order-2" : "order-1"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {message.sender === "bot" && (
                              <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-indigo-500/20">
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 text-white text-xs font-bold">
                                  AI
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div
                              className={`rounded-2xl p-5 shadow-lg backdrop-blur-sm ${
                                message.sender === "user"
                                  ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white"
                                  : "bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50"
                              }`}
                            >
                              <div className="whitespace-pre-line text-sm leading-relaxed">
                                {message.content}
                              </div>

                              {/* Enhanced Career Card */}
                              {message.type === "career_card" &&
                                message.metadata && (
                                  <div className="mt-4 p-4 bg-slate-50/80 dark:bg-slate-700/80 rounded-xl border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                        {message.metadata.title}
                                      </h4>
                                      <Badge
                                        className={getDifficultyColor(
                                          message.metadata.difficulty,
                                        )}
                                      >
                                        {message.metadata.difficulty}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                        <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                                          💰 Salary:
                                        </span>
                                        <br />
                                        <span className="text-emerald-900 dark:text-emerald-100 font-semibold">
                                          {message.metadata.salary}
                                        </span>
                                      </div>
                                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                                          📈 Growth:
                                        </span>
                                        <br />
                                        <span className="text-blue-900 dark:text-blue-100 font-semibold">
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
                                      ? "text-indigo-100"
                                      : "text-slate-500 dark:text-slate-400"
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
                                      className="h-7 w-7 p-0 opacity-60 hover:opacity-100 rounded-lg"
                                      onClick={() =>
                                        copyMessage(message.content)
                                      }
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 opacity-60 hover:opacity-100 rounded-lg"
                                    >
                                      <ThumbsUp className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {message.sender === "user" && (
                              <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-slate-200 dark:ring-slate-700">
                                <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
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
                                  className="text-xs h-9 bg-white/90 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-xl backdrop-blur-sm"
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
                          <Avatar className="h-9 w-9 ring-2 ring-indigo-500/20">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 text-white text-xs font-bold">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-white/90 dark:bg-slate-800/90 rounded-2xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                AI is analyzing & crafting response...
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* Enhanced Input Area */}
              <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-xl">
                <div className="flex space-x-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about careers, skills, salaries, or job market trends..."
                      className="min-h-[60px] max-h-[120px] resize-none bg-white/90 dark:bg-slate-700/90 border-emerald-300/50 dark:border-emerald-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm"
                      disabled={isTyping}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-12 w-12 p-0 border-slate-300/50 dark:border-slate-600/50 rounded-xl backdrop-blur-sm"
                      disabled={isTyping}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="h-12 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-700 shadow-lg rounded-xl backdrop-blur-sm transition-all duration-300"
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
                    <span>Powered by GPT-4 & Advanced AI</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="bg-slate-100/70 dark:bg-slate-800/70 border-t border-slate-200/50 dark:border-slate-700/50 mt-16 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Developed and Designed by{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                Sriram
              </span>
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
              © {new Date().getFullYear()} CareerCompass AI. Empowering careers
              with artificial intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
