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
  MessageCircle,
  Rocket,
  Globe,
  Shield,
  Cpu,
  Heart,
  Coffee,
  Atom,
  Layers
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
  "🎯 What career is perfect for me?",
  "📊 Tech salary trends 2024",
  "🔄 Career transition guide",
  "🤖 AI & ML career roadmap",
  "🏠 Remote work opportunities",
  "💰 Salary negotiation secrets",
  "🚀 Startup vs Big Tech",
  "📈 Future-proof skills"
];

const CAREER_CATEGORIES = [
  { 
    icon: Cpu, 
    title: "AI & Tech", 
    subtitle: "Future of technology",
    gradient: "from-cyan-500 via-blue-500 to-purple-600",
    topics: ["AI Engineer", "ML Scientist", "Data Engineer", "Cloud Architect"]
  },
  { 
    icon: Rocket, 
    title: "Product & Design", 
    subtitle: "Build amazing products",
    gradient: "from-pink-500 via-rose-500 to-orange-500",
    topics: ["Product Manager", "UX Designer", "UI Developer", "Design Systems"]
  },
  { 
    icon: Globe, 
    title: "Business & Strategy", 
    subtitle: "Drive growth & innovation",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    topics: ["Business Analyst", "Strategy Consultant", "Growth Hacker", "Operations"]
  },
  { 
    icon: Shield, 
    title: "Security & Finance", 
    subtitle: "Protect & optimize",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    topics: ["Cybersecurity", "FinTech", "Blockchain", "Risk Analysis"]
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
      content: `Hello ${user?.firstName || 'there'}! 👋 

I'm your **AI Career Strategist** - your personal guide to navigating the future of work. 

✨ **What I can help you with:**
• Discover your ideal career path
• Get real-time salary insights  
• Create personalized learning roadmaps
• Stay ahead of industry trends
• Master interview strategies

Let's unlock your potential together! What career goals are you exploring today?`,
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "🎯 Find my dream career",
        "💰 Show me salary trends",
        "🚀 Build learning roadmap",
        "🔮 Future job predictions"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      });
    }
  };

  useEffect(() => {
    // Only scroll when new messages are added, not on every render
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && (lastMessage.sender === 'bot' || lastMessage.sender === 'user')) {
      scrollToBottom();
    }
  }, [messages.length]); // Only depend on message count, not full messages array

  const generateAdvancedBotResponse = (userMessage: string): { content: string; suggestions?: string[]; type?: string; metadata?: any } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Career path recommendations
    if (lowerMessage.includes('career') && (lowerMessage.includes('best') || lowerMessage.includes('right') || lowerMessage.includes('choose') || lowerMessage.includes('dream') || lowerMessage.includes('find'))) {
      return {
        content: `🎯 **Discovering Your Perfect Career Match**

I'll help you find careers that align with your unique strengths and interests!

**🧠 Let's explore your preferences:**

**Work Style & Environment:**
• Do you thrive in collaborative team settings or prefer independent work?
• Are you energized by fast-paced startups or structured corporate environments?
• Do you enjoy solving complex technical problems or strategic business challenges?

**Skills & Interests:**
• Are you drawn to coding, data analysis, or creative design?
• Do you love teaching, leading teams, or building products?
• Are you passionate about emerging tech like AI, blockchain, or quantum computing?

**Career Values:**
• What motivates you most: high salary, work-life balance, or making an impact?
• Do you prefer job security or the excitement of taking risks?

Based on your answers, I'll recommend specific career paths with detailed roadmaps, earning potential, and growth trajectories!`,
        suggestions: [
          "💻 I love coding & problem-solving",
          "📊 Data & analytics fascinate me", 
          "🎨 I'm creative & design-oriented",
          "👔 I want to lead & strategize",
          "🤖 AI & emerging tech excite me"
        ]
      };
    }

    // Tech career responses
    if (lowerMessage.includes('coding') || lowerMessage.includes('programming') || lowerMessage.includes('software') || lowerMessage.includes('developer')) {
      const career = SAMPLE_CAREERS['software engineer'];
      return {
        content: `💻 **Software Engineering - Your Gateway to Tech!**

Perfect choice! Software engineering offers incredible opportunities and flexibility.

**🌟 Why Software Engineering Rocks:**
• **High Demand:** 1.4M new jobs expected by 2030
• **Versatility:** Work in any industry (fintech, healthcare, gaming, AI)
• **Remote-Friendly:** 85% of companies offer remote/hybrid options
• **Continuous Learning:** Always evolving with new technologies

**💰 Earning Potential:** ${career.salary}
**📈 Job Growth:** ${career.growth}
**⏱️ Learning Timeline:** ${career.timeToLearn}
**🎯 Skill Level:** ${career.difficulty}

**🛣️ Your Learning Roadmap:**

**Phase 1: Foundation (Months 1-3)**
• Programming fundamentals (Python/JavaScript)
• Problem-solving & algorithms
• Version control (Git/GitHub)
• Basic web development (HTML, CSS)

**Phase 2: Specialization (Months 4-6)**
• Choose your path: Frontend, Backend, or Full-Stack
• Learn frameworks (React, Node.js, Django)
• Database management (SQL, MongoDB)
• API development & integration

**Phase 3: Advanced Skills (Months 7-9)**
• System design principles
• Cloud platforms (AWS, Azure, GCP)
• Testing & deployment strategies
• Performance optimization

**Phase 4: Career Preparation (Months 10-12)**
• Build 3-5 portfolio projects
• Open source contributions
• Technical interview preparation
• Networking & job applications

**🔥 Hot Specializations:**
• **Full-Stack Developer** - Frontend + Backend mastery
• **Cloud Engineer** - AWS/Azure expertise, high demand
• **DevOps Engineer** - Automation & deployment pipelines  
• **Mobile Developer** - iOS/Android app development
• **AI/ML Engineer** - The future of software

Ready to start your coding journey?`,
        suggestions: [
          "🗺️ Show detailed learning plan",
          "🐍 Python vs JavaScript - which first?",
          "📁 Help me plan my portfolio",
          "🎯 Interview prep strategies",
          "☁️ Should I learn cloud platforms?"
        ],
        type: 'career_card',
        metadata: career
      };
    }

    // Data analytics interest
    if (lowerMessage.includes('data') || lowerMessage.includes('analytics') || lowerMessage.includes('scientist')) {
      const career = SAMPLE_CAREERS['data scientist'];
      return {
        content: `📊 **Data Science - The Sexiest Job of the 21st Century!**

Excellent choice! Data science is transforming every industry and creating incredible opportunities.

**🌟 Why Data Science is Booming:**
• **Explosive Growth:** 35% job growth (much faster than average)
• **High Impact:** Drive $1M+ business decisions with your insights
• **Versatile Career:** Work in tech, finance, healthcare, retail, sports
• **AI Revolution:** Be at the forefront of machine learning & AI

**💰 Earning Potential:** ${career.salary}
**📈 Job Growth:** ${career.growth}
**⏱️ Learning Timeline:** ${career.timeToLearn}
**🎯 Skill Level:** ${career.difficulty}

**🛠️ Essential Skills Toolkit:**
${career.skills.map(skill => `• **${skill}** - Industry standard tool`).join('\n')}

**🚀 Career Progression Pathway:**
**Level 1:** Data Analyst (₹6-12 LPA) → **Level 2:** Data Scientist (₹12-25 LPA) 
**Level 3:** Senior Data Scientist (₹25-40 LPA) → **Level 4:** Data Science Manager (₹40+ LPA)

**🔥 High-Demand Specializations:**
• **Machine Learning Engineer** - Build & deploy ML models
• **AI Research Scientist** - Cutting-edge algorithm development  
• **Business Intelligence Analyst** - Strategic data storytelling
• **MLOps Engineer** - Scale ML systems in production
• **Data Engineering** - Build data pipelines & infrastructure

**🎯 Learning Roadmap:**

**Foundation (Months 1-3):**
• Python programming mastery
• Statistics & probability theory
• SQL & database fundamentals
• Data visualization (Matplotlib, Seaborn)

**Intermediate (Months 4-6):**
• Machine learning algorithms
• Pandas & NumPy for data manipulation  
• Jupyter notebooks & data exploration
• A/B testing & experimentation

**Advanced (Months 7-12):**
• Deep learning & neural networks
• Cloud platforms (AWS, GCP, Azure)
• Big data tools (Spark, Hadoop)
• MLOps & model deployment

**Portfolio Projects:**
• Predictive modeling project
• Data visualization dashboard
• Machine learning web app
• End-to-end ML pipeline

Ready to dive into the world of data?`,
        suggestions: [
          "🐍 Python roadmap for data science",
          "📚 Best data science courses",
          "🤖 Build my first ML project",
          "📝 Data scientist interview guide",
          "📊 Which visualization tools to learn?"
        ],
        type: 'career_card',
        metadata: career
      };
    }

    // Design and creativity
    if (lowerMessage.includes('design') || lowerMessage.includes('creative') || lowerMessage.includes('ui') || lowerMessage.includes('ux')) {
      const career = SAMPLE_CAREERS['ui ux designer'];
      return {
        content: `🎨 **UI/UX Design - Shape the Digital World!**

Amazing choice! Design is where technology meets human psychology - creating experiences that delight millions.

**🌟 Why UI/UX Design is Incredible:**
• **Human-Centered:** Solve real problems for real people
• **High Impact:** Your designs influence user behavior & business success
• **Creative Freedom:** Blend artistry with analytical thinking
• **Growing Field:** 13% job growth as digital transformation accelerates

**💰 Earning Potential:** ${career.salary}
**📈 Job Growth:** ${career.growth}
**⏱️ Learning Timeline:** ${career.timeToLearn}
**🎯 Skill Level:** ${career.difficulty}

**🛠️ Designer's Arsenal:**
${career.skills.map(skill => `• **${skill}** - Essential design tool`).join('\n')}

**🎯 Design Specializations & Career Paths:**

**UX Designer** (₹6-18 LPA)
• User research & personas
• Information architecture
• Wireframing & prototyping
• Usability testing & optimization

**UI Designer** (₹5-15 LPA)  
• Visual design & branding
• Design systems & style guides
• Interaction design & micro-animations
• Mobile-first responsive design

**Product Designer** (₹10-25 LPA)
• End-to-end product design
• Cross-functional collaboration
• Design strategy & vision
• Business impact measurement

**UX Researcher** (₹8-20 LPA)
• User behavior analysis
• A/B testing & data insights
• Qualitative & quantitative research
• Design validation & optimization

**🚀 Learning Journey:**

**Foundation (Months 1-2):**
• Design thinking principles
• Typography & color theory
• Basic Figma/Sketch skills
• UI pattern libraries

**Build Skills (Months 3-4):**
• User research methods
• Wireframing & prototyping
• Design systems creation
• Accessibility best practices

**Advanced Practice (Months 5-6):**
• Interaction design & animation
• Usability testing & iteration
• Cross-platform design considerations
• Design-to-development handoff

**🏆 Portfolio Strategy:**

**Case Study 1:** App Redesign
• Show your complete design process
• Before/after comparisons
• User research insights

**Case Study 2:** Original Product Concept  
• Demonstrate end-to-end thinking
• Problem identification to solution
• User testing & iteration

**Case Study 3:** Web/Dashboard Design
• Information architecture skills
• Data visualization expertise
• Responsive design principles

**Case Study 4:** Design System
• Show systematic thinking
• Component library creation
• Brand consistency expertise

Want help planning your design portfolio?`,
        suggestions: [
          "📁 Help me plan my portfolio",
          "🛠️ Figma vs Adobe - which to master?",
          "🔍 UX research methods guide",
          "📐 Design system best practices",
          "🎨 Color theory for beginners"
        ],
        type: 'career_card',
        metadata: career
      };
    }

    // Leadership and strategy
    if (lowerMessage.includes('lead') || lowerMessage.includes('strategize') || lowerMessage.includes('manage') || lowerMessage.includes('product manager')) {
      const career = SAMPLE_CAREERS['product manager'];
      return {
        content: `👔 **Product Management - The CEO of the Product!**

Fantastic choice! Product management sits at the intersection of business, technology, and user experience.

**🌟 Why Product Management is Amazing:**
• **Strategic Impact:** Drive product vision & roadmap decisions
• **Cross-Functional Leadership:** Work with engineering, design, marketing, sales
• **High Influence:** Shape products used by millions of users
• **Executive Track:** Clear path to VP/Chief Product Officer roles

**💰 Earning Potential:** ${career.salary}
**📈 Job Growth:** ${career.growth}
**⏱️ Learning Timeline:** ${career.timeToLearn}
**🎯 Skill Level:** ${career.difficulty}

**🎯 Core PM Competencies:**
${career.skills.map(skill => `• **${skill}** - Essential PM skill`).join('\n')}

**🚀 Product Manager Specializations:**

**Technical PM** (₹15-35 LPA)
• Work closely with engineering teams
• API & platform product management
• Technical feasibility assessment
• Developer experience optimization

**Data PM** (₹18-40 LPA)
• Analytics & metrics-driven decisions
• A/B testing & experimentation
• User behavior insights
• Performance optimization

**Growth PM** (₹16-38 LPA)
• User acquisition & retention
• Conversion optimization
• Viral growth mechanics
• Marketing & product synergy

**Platform PM** (₹20-45 LPA)
• Multi-sided marketplace products
• Developer ecosystems
• Infrastructure & scalability
• API product strategy

**🗓️ A Day in the Life of a PM:**

**Morning (9-11 AM):**
• Review key metrics & user feedback
• Prioritize feature requests & bug reports
• Sync with engineering team on sprint progress

**Midday (11 AM-2 PM):**
• Stakeholder meetings & roadmap reviews
• User research sessions & customer calls
• Competitive analysis & market research

**Afternoon (2-5 PM):**
• Work with design team on user flows
• Review engineering estimates & technical specs
• Collaborate on go-to-market strategy

**Evening (5-6 PM):**
• Write product requirements & specs
• Prepare for tomorrow's prioritization
• Industry research & learning

**🛣️ PM Learning Roadmap:**

**Foundation (Months 1-2):**
• Product management fundamentals
• User-centered design thinking
• Basic analytics & data interpretation
• Agile/Scrum methodologies

**Skills Building (Months 3-4):**
• Market research & competitive analysis
• Roadmap planning & prioritization
• Stakeholder management
• Technical concepts for PMs

**Advanced Practice (Months 5-6):**
• A/B testing & experimentation
• Product metrics & KPI definition
• Go-to-market strategy
• Leadership & influence skills

**Portfolio Development (Months 7-8):**
• Case studies of product improvements
• Metrics-driven success stories
• Cross-functional project leadership
• Product strategy presentations

**🎯 Essential PM Tools:**
• **Analytics:** Google Analytics, Mixpanel, Amplitude
• **Research:** Hotjar, Uservoice, Typeform
• **Management:** Jira, Trello, Asana, Notion
• **Design:** Figma, Miro, Whimsical
• **Communication:** Slack, Zoom, Confluence

Ready to shape the future of products?`,
        suggestions: [
          "🔄 How to transition to PM role?",
          "🛠️ Essential PM tools to master",
          "🗺️ Show me product roadmap examples",
          "🤝 Stakeholder management tips",
          "📊 PM metrics that matter most"
        ],
        type: 'career_card',
        metadata: career
      };
    }

    // Salary related queries
    if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('earn') || lowerMessage.includes('money') || lowerMessage.includes('compensation')) {
      return {
        content: `💰 **2024 Tech Salary Guide - Complete Breakdown**

**🇮🇳 India Tech Salary Ranges:**

**🚀 Entry Level (0-2 years):**
• **Software Engineer:** ₹6-12 LPA
• **Data Analyst:** ₹4-8 LPA  
• **UI/UX Designer:** ₹4-9 LPA
• **Digital Marketer:** ₹3-7 LPA
• **Business Analyst:** ₹5-10 LPA

**💪 Mid Level (3-5 years):**
• **Senior Software Engineer:** ₹12-25 LPA
• **Data Scientist:** ₹15-30 LPA
• **Product Manager:** ₹18-35 LPA
• **DevOps Engineer:** ₹15-28 LPA
• **Tech Lead:** ₹20-35 LPA

**🏆 Senior Level (6+ years):**
• **Principal Engineer:** ₹35-60 LPA
• **Engineering Manager:** ₹30-50 LPA
• **Senior Product Manager:** ₹35-65 LPA
• **Director/VP Engineering:** ₹50-80+ LPA
• **Chief Technology Officer:** ₹80+ LPA

**🌟 High-Paying Specializations:**
• **AI/ML Engineer:** ₹20-45 LPA
• **Cloud Architect:** ₹25-50 LPA
• **Cybersecurity Expert:** ₹18-40 LPA
• **Blockchain Developer:** ₹15-35 LPA
• **Product Growth Lead:** ₹22-45 LPA

**💡 Salary Multipliers:**

**🎓 Skills & Certifications:**
• AWS/Azure/GCP certification: +15-25%
• Advanced degree (MS/MBA): +20-30%
• Open source contributions: +10-15%
• Leadership experience: +25-40%

**🏙️ Location Impact:**
• **Bangalore/Mumbai:** +25-35% premium
• **Delhi NCR/Hyderabad:** +15-25% premium  
• **Pune/Chennai:** +10-20% premium
• **Tier 2 cities:** Base salaries
• **Remote work:** Location-independent pay (growing trend)

**🏢 Company Type Variations:**
• **FAANG (Google, Meta, Amazon):** 2-3x market rate
• **Unicorn Startups:** 1.5-2x + equity upside
• **Mid-size Tech:** 1-1.5x market rate
• **Traditional Enterprise:** 0.8-1.2x market rate
• **Early Startups:** Lower cash + high equity

**🚀 Salary Acceleration Strategies:**

**Short-term (6-12 months):**
• Master in-demand skills (AI, cloud, security)
• Build impressive side projects
• Contribute to open source
• Get industry certifications

**Medium-term (1-2 years):**
• Switch companies strategically (20-40% jumps)
• Move to high-paying cities/companies
• Develop leadership & mentoring skills
• Build strong professional network

**Long-term (3-5 years):**
• Transition to management track
• Develop business acumen
• Build personal brand & thought leadership
• Consider entrepreneurship opportunities

**💪 Negotiation Power Boosters:**
• Multiple job offers
• Proven track record of impact
• Rare/specialized skill combinations
• Strong references & recommendations
• Industry conference speaking

Want specific negotiation tactics for your situation?`,
        suggestions: [
          "🎯 Salary negotiation masterclass",
          "📈 How to ask for a 30% raise",
          "💎 Stock options vs cash salary",
          "🌐 Remote work salary strategies",
          "🔄 Job switching for salary growth"
        ]
      };
    }

    // Skills and learning
    if (lowerMessage.includes('skill') || lowerMessage.includes('learn') || lowerMessage.includes('course') || lowerMessage.includes('roadmap')) {
      return {
        content: `🚀 **2024's Most In-Demand Skills - Your Growth Accelerator**

**🔥 Hottest Technical Skills:**

**AI & Machine Learning** 🤖
• **Prompt Engineering** - Master GPT, Claude, Midjourney
• **LLM Fine-tuning** - Customize AI models for business
• **Computer Vision** - Image recognition, autonomous systems
• **Natural Language Processing** - Chatbots, language understanding
• **MLOps** - Deploy & scale machine learning systems

**Cloud & Infrastructure** ☁️
• **AWS Solutions Architect** - 40% salary premium
• **Kubernetes & Docker** - Container orchestration mastery
• **Terraform & Infrastructure as Code** - Automate everything
• **Serverless Computing** - AWS Lambda, Azure Functions
• **DevOps & CI/CD** - Automation & deployment pipelines

**Cybersecurity** 🔒
• **Ethical Hacking** - Penetration testing, bug bounties
• **Zero Trust Architecture** - Modern security frameworks
• **Incident Response** - Handle security breaches
• **Compliance & Risk** - GDPR, SOC 2, regulatory expertise
• **Security Automation** - SOAR platforms, threat detection

**Modern Development** 💻
• **Full-Stack JavaScript** - React, Node.js, TypeScript
• **Python for Everything** - Web, AI, automation, data
• **Go & Rust** - High-performance system programming
• **Web3 & Blockchain** - DeFi, NFTs, smart contracts
• **Mobile Development** - React Native, Flutter, Swift

**💼 Essential Soft Skills:**

**Future-Ready Skills** 🌟
• **AI Collaboration** - Work effectively with AI tools
• **Remote Leadership** - Manage distributed teams
• **Cross-Cultural Communication** - Global team dynamics
• **Continuous Learning** - Adapt to rapid tech changes
• **Systems Thinking** - Understand complex interconnections

**Business Skills** 📊
• **Data-Driven Decision Making** - Analytics interpretation
• **Product Strategy** - Market analysis, user research
• **Growth Hacking** - Viral marketing, conversion optimization
• **Financial Literacy** - Unit economics, P&L understanding
• **Design Thinking** - Human-centered problem solving

**📈 Emerging High-Growth Fields:**

**Quantum Computing** ⚛️
• Quantum algorithm development
• Quantum machine learning
• Cryptography & security applications
• IBM Qiskit, Google Cirq frameworks

**Sustainability Tech** 🌱
• Carbon footprint optimization
• Renewable energy systems
• Circular economy solutions
• ESG reporting & compliance

**Augmented/Virtual Reality** 🥽
• Unity & Unreal Engine development
• Spatial computing interfaces
• Industrial AR applications
• Metaverse platform development

**Biotechnology & HealthTech** 🧬
• Bioinformatics & genomics
• Digital therapeutics
• Telemedicine platforms
• Medical device software

**🎯 Strategic Learning Approach:**

**The T-Shaped Professional:**
• **Deep Expertise:** Master 1-2 core technical skills
• **Broad Knowledge:** Understanding across multiple domains
• **Bridge Skills:** Translate between technical & business teams

**Learning Methodology:**
1. **Learn by Building** - Create projects, not just consume content
2. **Teach Others** - Write blogs, create tutorials, mentor juniors
3. **Join Communities** - GitHub, Discord, local meetups
4. **Stay Current** - Follow industry leaders, read tech news
5. **Get Certified** - Industry-recognized credentials

**🚀 90-Day Skill Sprint Plan:**

**Days 1-30: Foundation**
• Choose your primary skill focus
• Complete beginner course/bootcamp
• Set up development environment
• Start first project

**Days 31-60: Practice & Build**
• Complete 2-3 guided projects
• Join relevant online communities
• Start contributing to open source
• Begin building portfolio

**Days 61-90: Advanced & Network**
• Tackle advanced concepts
• Build original project from scratch
• Write about your learning journey
• Apply for jobs/freelance projects

Which skill area excites you most? I'll create a personalized roadmap!`,
        suggestions: [
          "🤖 AI/ML complete roadmap",
          "☁️ Cloud certification guide",
          "💻 Full-stack development path",
          "🔒 Cybersecurity career track",
          "📊 Data science learning plan",
          "🎨 Design skills roadmap"
        ]
      };
    }

    // Job market trends
    if (lowerMessage.includes('trend') || lowerMessage.includes('market') || lowerMessage.includes('future') || lowerMessage.includes('2024') || lowerMessage.includes('prediction')) {
      return {
        content: `📈 **2024 Job Market Insights & Future Predictions**

**🚀 Fastest Growing Roles (Next 2 Years):**

**AI & Automation** 🤖
• **AI/ML Engineers** (+45% growth, ₹20-60 LPA)
• **Prompt Engineers** (+200% growth, ₹15-40 LPA)
• **AI Ethics Specialists** (+150% growth, ₹18-35 LPA)
• **Computer Vision Engineers** (+60% growth, ₹25-50 LPA)

**Cloud & Infrastructure** ☁️
• **Cloud Architects** (+40% growth, ₹25-55 LPA)
• **DevOps Engineers** (+35% growth, ₹15-40 LPA)
• **Site Reliability Engineers** (+38% growth, ₹20-45 LPA)
• **Kubernetes Specialists** (+55% growth, ₹18-42 LPA)

**Security & Compliance** 🔒
• **Cybersecurity Analysts** (+33% growth, ₹12-35 LPA)
• **Privacy Engineers** (+70% growth, ₹20-45 LPA)
• **Incident Response Specialists** (+42% growth, ₹15-38 LPA)

**Product & Design** 🎨
• **Product Managers** (+25% growth, ₹18-50 LPA)
• **UX Researchers** (+30% growth, ₹12-28 LPA)
• **Growth Product Managers** (+40% growth, ₹22-55 LPA)

**🌊 Major Industry Transformations:**

**🏠 Remote Work Revolution**
• **70% of companies** offer permanent remote options
• **Global talent pools** - compete worldwide, earn globally
• **Async collaboration** becoming the norm
• **Digital nomad visas** in 40+ countries

**🤖 AI Integration Everywhere**
• **100% of roles** will require basic AI literacy by 2026
• **AI pair programming** standard in software development
• **Automated testing & deployment** becoming universal
• **AI-augmented decision making** across all industries

**📱 Skills-Based Hiring**
• **60% of employers** prioritize skills over degrees
• **Portfolio-driven recruiting** replacing traditional resumes
• **Micro-credentials** and certifications gaining value
• **Real-time skill assessment** in interviews

**⚡ Gig Economy Expansion**
• **50% of professionals** will freelance by 2027
• **Platform economy** creating new career models
• **Creator economy** reaching $104B globally
• **Fractional executives** trend growing 300%

**🔥 Industries Experiencing Massive Growth:**

**FinTech & Digital Payments** 💳
• Digital banking infrastructure
• Cryptocurrency & DeFi platforms
• Buy-now-pay-later solutions
• Regulatory technology (RegTech)

**HealthTech & Digital Medicine** 🏥
• Telemedicine platforms scaling rapidly
• AI-powered diagnostic tools
• Mental health apps & platforms
• Personalized medicine & genomics

**EdTech & Upskilling** 📚
• Corporate learning platforms
• Micro-learning & just-in-time training
• VR/AR educational experiences
• AI-powered personalized learning

**CleanTech & Sustainability** 🌱
• Carbon management software
• Renewable energy optimization
• Circular economy platforms
• ESG reporting & analytics

**🌟 Success Strategies for 2024:**

**Build Future-Proof Skills:**
• Master AI tools & prompting
• Develop systems thinking
• Practice remote collaboration
• Learn continuous adaptation

**Create Multiple Income Streams:**
• Freelance/consulting in your expertise
• Build digital products or courses
• Invest in growth stocks/crypto
• Create content & build audience

**Network Strategically:**
• Join professional communities online
• Attend virtual conferences & meetups
• Build relationships across industries
• Mentor others & get mentored

**Stay Ahead of Trends:**
• Follow industry thought leaders
• Read quarterly reports from major tech companies
• Join beta programs for new tools
• Experiment with emerging technologies

**🔮 Bold Predictions for 2025-2030:**

**Work Evolution:**
• 4-day work weeks become standard
• AI assistants handle 40% of knowledge work
• Virtual reality offices mainstream
• Skills-based project teams replace permanent roles

**Technology Breakthroughs:**
• Quantum computing reaches commercial viability
• Brain-computer interfaces for productivity
• Autonomous software development tools
• Real-time language translation in all devices

**Career Implications:**
• Human creativity & emotional intelligence premium
• Meta-skills (learning how to learn) most valuable
• Cross-cultural collaboration essential
• Entrepreneurial mindset becomes baseline

Want deep insights on any specific industry or trend?`,
        suggestions: [
          "🚀 AI revolution career strategies",
          "🏠 Remote work mastery guide",
          "🔮 2030 job market predictions",
          "💡 Build future-proof career",
          "🌐 Global hiring trends analysis"
        ]
      };
    }

    // Career change
    if (lowerMessage.includes('switch') || lowerMessage.includes('change') || lowerMessage.includes('transition') || lowerMessage.includes('pivot')) {
      return {
        content: `🔄 **Master Your Career Transition - Complete Success Guide**

**🎯 Most Popular & Successful Transition Paths:**

**Into Tech from Traditional Industries:**
• **Finance → FinTech Product Manager** (leverage domain knowledge)
• **Marketing → Growth Product Manager** (customer acquisition expertise)
• **Operations → DevOps Engineer** (process optimization skills)
• **Sales → Customer Success Manager** (relationship building skills)
• **Education → EdTech Designer** (learning methodology expertise)

**Within Tech Progressions:**
• **Developer → Engineering Manager** (technical leadership)
• **Analyst → Data Scientist** (analytical skill progression)
• **Designer → Product Manager** (user experience focus)
• **QA → DevOps Engineer** (quality & automation synergy)

**📋 The Ultimate 6-Phase Transition Strategy:**

**Phase 1: Self-Assessment & Research (Weeks 1-2)**

**Skills Inventory:**
• List all transferable skills from current role
• Identify knowledge gaps for target position
• Assess learning timeline & commitment level
• Evaluate financial runway for transition period

**Market Research:**
• Study job descriptions for target roles
• Research salary ranges & growth potential
• Connect with professionals in target field
• Understand industry trends & future outlook

**Phase 2: Strategic Upskilling (Months 1-4)**

**Learning Strategy:**
• **70% hands-on projects** - Build while you learn
• **20% structured courses** - Udemy, Coursera, Pluralsight
• **10% networking & mentorship** - Learn from practitioners

**Skill Development Plan:**
• **Month 1:** Core fundamentals & theory
• **Month 2:** Practical tools & frameworks
• **Month 3:** Advanced concepts & specialization
• **Month 4:** Portfolio projects & real-world application

**Phase 3: Experience Building (Months 3-6)**

**Gain Relevant Experience:**
• **Freelance projects** in target domain
• **Volunteer** for non-profits needing your new skills
• **Internal projects** at current company using new skills
• **Open source contributions** to build credibility
• **Side projects** showcasing your capabilities

**Document Everything:**
• Create case studies of your projects
• Track metrics & business impact
• Build portfolio website
• Start writing/sharing about your learning journey

**Phase 4: Network Building (Months 4-6)**

**Strategic Networking:**
• **LinkedIn optimization** - update profile for target role
• **Industry events** - conferences, meetups, webinars
• **Online communities** - Reddit, Discord, Slack groups
• **Informational interviews** - 2-3 per week with target professionals
• **Mentorship** - find 1-2 mentors in your target field

**Content Creation:**
• Write articles about your transition journey
• Share projects & learning insights
• Comment thoughtfully on industry discussions
• Host virtual coffee chats or AMAs

**Phase 5: Job Search Preparation (Months 6-7)**

**Application Materials:**
• **Transition-focused resume** highlighting transferable skills
• **Portfolio website** with 3-5 strong projects
• **LinkedIn profile** optimized for target role keywords
• **Cover letter template** explaining your career change story

**Interview Preparation:**
• **Behavioral questions** - use STAR method for career change narrative
• **Technical assessments** - practice relevant skills/tools
• **Portfolio presentations** - tell compelling project stories
• **Mock interviews** - practice with professionals in target field

**Phase 6: Strategic Job Search (Months 7-8)**

**Multi-Channel Approach:**
• **Network referrals** (60% of hires come from referrals)
• **Direct applications** to dream companies
• **Recruiting partnerships** with specialized agencies
• **Freelance-to-hire** opportunities
• **Startup job boards** (AngelList, Y Combinator)

**Negotiation Strategy:**
• Accept potentially lower initial salary for experience
• Negotiate for rapid skill development opportunities
• Request mentorship & training budget
• Plan 12-18 month timeline to market-rate compensation

**🎯 Age-Specific Transition Strategies:**

**Early Career (20s):**
• **Experimentation focus** - try multiple paths
• **Risk tolerance** - take bold moves, fail fast
• **Network building** - invest heavily in relationships
• **Skill accumulation** - learn voraciously

**Mid Career (30s):**
• **Leverage existing expertise** - find adjacent opportunities
• **Strategic positioning** - build on proven track record
• **Family considerations** - balance risk with stability
• **Leadership development** - prepare for management roles

**Experienced (40s+):**
• **Wisdom advantage** - strategic thinking & mentorship value
• **Network leverage** - extensive professional relationships
• **Consultant pathway** - expertise-based independent work
• **Executive transition** - C-suite & board opportunities

**💪 Overcoming Common Transition Challenges:**

**Imposter Syndrome:**
• Remember: 70% of people experience this
• Focus on transferable skills & unique perspective
• Celebrate small wins & progress milestones
• Find mentor who's made similar transition

**Financial Concerns:**
• Build 6-12 month emergency fund before transitioning
• Consider part-time transition or consulting bridge
• Negotiate severance or extended benefits at current job
• Explore scholarship/sponsorship opportunities for training

**Time Management:**
• Use early mornings/evenings for skill development
• Batch learning activities efficiently
• Leverage commute time for courses/podcasts
• Take vacation days for intensive learning

**Family/Social Pressure:**
• Educate family about career change benefits
• Show concrete plan with timelines & milestones
• Start with small changes before big announcement
• Find support group of other career changers

Ready to create your personalized transition plan?`,
        suggestions: [
          "📋 Create my 6-month transition plan",
          "🔍 Transferable skills assessment",
          "⏰ Best transition timeline for my age",
          "🤝 Networking strategies that work",
          "💰 Manage finances during transition"
        ]
      };
    }

    // Interview preparation
    if (lowerMessage.includes('interview') || lowerMessage.includes('preparation') || lowerMessage.includes('job search')) {
      return {
        content: `🎯 **Master Your Tech Interviews - Complete Success System**

**📋 The Modern Interview Process:**

**Stage 1: Application & Initial Screening**
• **Resume optimization** for ATS systems
• **Portfolio/GitHub** showcasing your best work
• **LinkedIn profile** aligned with target role
• **Cover letter** telling your unique story

**Stage 2: Phone/Video Screening (30-45 min)**
• **Recruiter call** - culture fit, basic qualifications
• **Hiring manager screen** - role-specific questions
• **Technical phone screen** - basic coding/domain questions

**Stage 3: Technical Assessment**
• **Take-home project** (2-4 hours, realistic work simulation)
• **Live coding session** (45-60 min, problem-solving approach)
• **System design** (senior roles, architectural thinking)
• **Domain-specific assessment** (design portfolio, product case study)

**Stage 4: Onsite/Final Round (3-5 hours)**
• **Technical deep dive** with team members
• **Behavioral interviews** with potential colleagues
• **Culture fit discussion** with leadership
• **Presentation** of take-home project or portfolio

**💻 Technical Interview Mastery:**

**Coding Interview Excellence:**
• **Master these patterns:** Two pointers, sliding window, tree traversal, dynamic programming
• **Platform practice:** LeetCode (medium level), HackerRank, CodeSignal
• **Language choice:** Python for readability, JavaScript for web roles
• **Problem-solving approach:** Clarify → Plan → Code → Test → Optimize

**System Design Strategy (Senior Roles):**
• **Think big picture:** Start with requirements, then architecture
• **Key components:** Load balancers, databases, caching, microservices
• **Trade-offs discussion:** Consistency vs availability, SQL vs NoSQL
• **Real examples:** Design Twitter, Uber, Netflix architecture

**Domain-Specific Preparation:**

**Data Science Interviews:**
• **Statistics fundamentals** - hypothesis testing, p-values, confidence intervals
• **ML algorithm deep dives** - when to use, pros/cons, math behind algorithms
• **Case study walkthroughs** - business problem to ML solution
• **Programming exercises** - pandas, SQL, model implementation

**Product Manager Interviews:**
• **Product sense questions** - "How would you improve Instagram?"
• **Analytical problems** - market sizing, A/B test interpretation
• **Strategic thinking** - prioritization frameworks, roadmap planning
• **Leadership scenarios** - stakeholder management, conflict resolution

**Design Interviews:**
• **Portfolio presentation** - process, not just final designs
• **Design challenges** - whiteboard wireframing, user flow mapping
• **Critique exercises** - analyze existing products, suggest improvements
• **Collaboration simulation** - work with PM/engineer on mock project

**🗣️ Behavioral Interview Mastery:**

**STAR Method Framework:**
• **Situation** - Set context concisely
• **Task** - Explain your responsibility
• **Action** - Detail what YOU did (not your team)
• **Result** - Quantify impact with metrics

**Essential Stories to Prepare:**
• **Leadership example** - Led team through challenging project
• **Problem-solving** - Overcame significant technical/business obstacle
• **Failure/learning** - Failed project, what you learned, how you improved
• **Innovation** - Introduced new idea/process that created value
• **Conflict resolution** - Disagreement with colleague, how you handled it
• **Growth mindset** - Sought feedback, adapted, improved performance

**Company-Specific Research Strategy:**
• **Mission & values** - Understand company culture deeply
• **Recent news** - Product launches, funding, leadership changes
• **Competitors** - Who they compete with, differentiation
• **Challenges** - Industry problems company is solving
• **Growth trajectory** - Revenue, user base, market expansion

**💰 Salary Negotiation Mastery:**

**Pre-Interview Preparation:**
• **Market research** - Use Glassdoor, Levels.fyi, PayScale
• **Know your worth** - Factor in experience, skills, location
• **Total compensation** - Base salary + equity + benefits + bonus
• **Walk-away number** - Minimum acceptable offer

**Negotiation Strategy:**
• **Never accept first offer** - Always negotiate professionally
• **Anchor high** - Start above target, expect counter-offers
• **Multiple variables** - Salary, equity, vacation, learning budget
• **Enthusiasm + leverage** - Show excitement while having alternatives

**Advanced Negotiation Tactics:**
• **Package deal** - "If you can do X salary + Y equity, I'll accept"
• **Future review** - "6-month performance review with salary adjustment"
• **Non-monetary value** - Conference budget, flexible hours, remote work
• **Competing offers** - "I have another offer, but prefer working here"

**🚀 Interview Success Accelerators:**

**Before the Interview:**
• **Mock interviews** - Practice with peers, mentors, or services like Pramp
• **Environment setup** - Test video/audio, backup internet, professional background
• **Questions prepared** - 5-7 thoughtful questions about role, team, challenges
• **Materials ready** - Extra resumes, portfolio prints, notebook, pen

**During the Interview:**
• **Think out loud** - Verbalize your thought process
• **Ask clarifying questions** - Shows analytical thinking
• **Be authentic** - Genuine personality connection matters
• **Show enthusiasm** - Passion for role and company mission

**After the Interview:**
• **Thank you email** within 24 hours to each interviewer
• **Specific mentions** - Reference specific conversation points
• **Reiterate interest** - Confirm enthusiasm for opportunity
• **Address concerns** - Clarify any points that weren't clear

**🎯 Role-Specific Interview Prep:**

**Software Engineer:**
• Practice: Arrays, strings, trees, graphs, dynamic programming
• Study: Big O notation, data structures, algorithms
• Portfolio: 3-5 diverse projects showing different skills

**Data Scientist:**
• Practice: Statistics, machine learning, SQL, Python/R
• Study: Model evaluation, feature engineering, business metrics
• Portfolio: End-to-end projects with business impact

**Product Manager:**
• Practice: Product strategy, prioritization, metrics analysis
• Study: Popular products, growth frameworks, user psychology
• Portfolio: Case studies of product improvements or launches

**Designer:**
• Practice: Design thinking, user research, prototyping
• Study: Current design trends, accessibility, user psychology
• Portfolio: Process-focused case studies with user impact

Want to practice mock interviews for your target role?`,
        suggestions: [
          "💻 Practice coding interview questions",
          "🗣️ Behavioral interview prep session",
          "💰 Salary negotiation simulation",
          "🔍 Company research strategies",
          "📊 Technical assessment prep",
          "🎨 Design interview portfolio tips"
        ]
      };
    }

    // Default enhanced response
    return {
      content: `🤖 **Your AI Career Strategist is Ready!** 

I'm here to supercharge your career journey with personalized, data-driven insights!

**🎯 Career Guidance I Provide:**

**🔍 Career Discovery**
• Personality-based career matching
• Skills gap analysis & roadmaps
• Industry trend insights
• Growth opportunity identification

**📚 Learning & Development**  
• Custom learning pathways
• Skill prioritization strategies
• Certification recommendations
• Portfolio development guidance

**💼 Job Search Mastery**
• Interview preparation & practice
• Resume optimization strategies
• Salary negotiation tactics
• Network building approaches

**📈 Market Intelligence**
• Real-time salary benchmarks
• Emerging role opportunities
• Industry disruption analysis
• Future-proofing strategies

**🔄 Career Transitions**
• Career pivot strategies  
• Skill transfer analysis
• Timeline & milestone planning
• Risk mitigation approaches

**💡 What would you like to explore first?**

I can provide specific, actionable advice tailored to your unique situation and goals. Let's unlock your career potential together!`,
      suggestions: [
        "🎯 Discover my ideal career path",
        "📊 Show me 2024 market trends", 
        "🚀 Build my learning roadmap",
        "💼 Master interview strategies",
        "💰 Optimize my earning potential"
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

    // Focus back to input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Simulate AI thinking time with more realistic delays
    const thinkingTime = Math.random() * 2000 + 1500; // 1.5-3.5 seconds
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
      case 'Beginner': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'Intermediate': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Advanced': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Modern Floating Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 rounded-2xl shadow-lg">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  CareerCompass AI
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your Future Starts Here</p>
              </div>
            </Link>
            
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/careers" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400">
                Explore Careers
              </Link>
              <Link to="/resume-analyzer" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400">
                Resume AI
              </Link>
              <Link to="/tips" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400">
                Daily Tips
              </Link>
              <Link to="/goals" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400">
                Goal Tracker
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-10 h-10 rounded-xl"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              
              {isLoggedIn && user ? (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" asChild className="rounded-xl">
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
                    className="rounded-xl"
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
                  <Button variant="ghost" asChild className="rounded-xl">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:via-purple-700 hover:to-cyan-600 shadow-lg rounded-xl">
                    <Link to="/register">Get Started Free</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-8xl">
        <div className={`grid gap-8 transition-all duration-300 ${showSidebar ? 'lg:grid-cols-4' : 'lg:grid-cols-1'}`}>
          
          {/* Enhanced Sidebar */}
          {showSidebar && (
            <div className="lg:col-span-1 space-y-6">
              {/* AI Assistant Status */}
              <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 rounded-xl shadow-lg">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">AI Career Strategist</CardTitle>
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
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Instant career insights</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Target className="w-4 h-4 text-emerald-500" />
                      <span>Personalized roadmaps</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Rocket className="w-4 h-4 text-indigo-500" />
                      <span>Future-ready guidance</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Questions */}
              <Card className="shadow-xl border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <span>Quick Start Questions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {QUICK_QUESTIONS.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full text-left justify-start h-auto p-3 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all rounded-xl"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      <ChevronRight className="w-3 h-3 mr-2 text-indigo-500" />
                      {question}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Career Categories */}
              <Card className="shadow-xl border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Layers className="h-5 w-5 text-indigo-500" />
                    <span>Career Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {CAREER_CATEGORIES.map((category, index) => (
                    <div 
                      key={index} 
                      className="p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 dark:hover:from-slate-800 dark:hover:to-gray-800"
                      onClick={() => handleQuickQuestion(`Tell me about careers in ${category.title}`)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 bg-gradient-to-r ${category.gradient} rounded-lg shadow-sm group-hover:shadow-md transition-shadow`}>
                          <category.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{category.title}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{category.subtitle}</p>
                          <div className="flex flex-wrap gap-1">
                            {category.topics.slice(0, 2).map((topic, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs px-2 py-0">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Chat Interface */}
          <div className={`${showSidebar ? 'lg:col-span-3' : 'lg:col-span-1'} transition-all duration-300`}>
            <Card className="h-[calc(100vh-140px)] flex flex-col shadow-2xl border-0 overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              
              {/* Modern Chat Header */}
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-indigo-500/20">
                      <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 text-white font-bold text-lg">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                        <span>AI Career Strategist</span>
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
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
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Enhanced Messages Container */}
              <div className="flex-1 relative">
                <ScrollArea className="h-full" ref={messagesContainerRef}>
                  <div className="p-6 space-y-6">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className="flex items-start space-x-3">
                            {message.sender === 'bot' && (
                              <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-indigo-500/20">
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 text-white text-xs font-bold">
                                  AI
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div className={`rounded-2xl p-5 shadow-lg backdrop-blur-sm ${
                              message.sender === 'user' 
                                ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white' 
                                : 'bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50'
                            }`}>
                              <div className="whitespace-pre-line text-sm leading-relaxed">
                                {message.content}
                              </div>
                              
                              {/* Enhanced Career Card */}
                              {message.type === 'career_card' && message.metadata && (
                                <div className="mt-4 p-4 bg-slate-50/80 dark:bg-slate-700/80 rounded-xl border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{message.metadata.title}</h4>
                                    <Badge className={getDifficultyColor(message.metadata.difficulty)}>
                                      {message.metadata.difficulty}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                      <span className="text-emerald-700 dark:text-emerald-300 font-medium">💰 Salary:</span>
                                      <br />
                                      <span className="text-emerald-900 dark:text-emerald-100 font-semibold">{message.metadata.salary}</span>
                                    </div>
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                      <span className="text-blue-700 dark:text-blue-300 font-medium">📈 Growth:</span>
                                      <br />
                                      <span className="text-blue-900 dark:text-blue-100 font-semibold">{message.metadata.growth}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between mt-4">
                                <div className={`text-xs ${
                                  message.sender === 'user' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {message.sender === 'bot' && (
                                  <div className="flex items-center space-x-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-7 w-7 p-0 opacity-60 hover:opacity-100 rounded-lg"
                                      onClick={() => copyMessage(message.content)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-60 hover:opacity-100 rounded-lg">
                                      <ThumbsUp className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {message.sender === 'user' && (
                              <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-slate-200 dark:ring-slate-700">
                                <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                  {user?.firstName?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                          
                          {/* Enhanced Suggestions */}
                          {message.sender === 'bot' && message.suggestions && (
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
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400">AI is analyzing & crafting response...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>

              {/* Enhanced Input Area */}
              <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-xl">
                <div className="flex space-x-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about careers, skills, salaries, or job market trends..."
                      className="bg-white/90 dark:bg-slate-700/90 border-slate-300/50 dark:border-slate-600/50 h-12 text-base rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
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
                      className="h-12 px-6 bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:via-purple-700 hover:to-cyan-600 shadow-lg rounded-xl backdrop-blur-sm"
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
              Developed and Designed by <span className="font-semibold text-indigo-600 dark:text-indigo-400">Sriram</span>
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
              © {new Date().getFullYear()} CareerCompass AI. Empowering careers with artificial intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
