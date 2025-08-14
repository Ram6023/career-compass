import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Compass,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  Target,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  MapPin,
  ExternalLink,
  BookOpen,
  Award,
  Calendar,
  BarChart3,
  Zap,
  Sparkles,
  Heart,
  Sun,
  Moon,
  User,
  Play,
  ChevronRight,
  Globe,
  Building,
  Code,
  Palette,
  BarChart,
  Shield,
  Smartphone,
  MessageSquare,
  School,
  Percent,
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useLanguage } from "@/components/ui/language-provider";
import { LanguageSelector } from "@/components/ui/language-selector";
import { authService } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";

interface CareerRecommendation {
  title: string;
  description: string;
  requiredSkills: string[];
  averageSalary: string;
  jobGrowth: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeToStart: string;
  learningPath: string[];
  topCompanies: string[];
  matchScore: number;
  courses: Array<{
    title: string;
    provider: string;
    duration: string;
    url: string;
    type: "free" | "paid";
  }>;
  certifications: Array<{
    name: string;
    provider: string;
    difficulty: string;
    url: string;
  }>;
  roadmap: Array<{
    level: string;
    skills: string[];
    duration: string;
    projects: string[];
  }>;
  locations: Array<{
    city: string;
    demand: "High" | "Medium" | "Low";
    avgSalary: string;
  }>;
}

const careerIcons: {
  [key: string]: React.ComponentType<{ className?: string }>;
} = {
  "Data Scientist": BarChart,
  "Full Stack Developer": Code,
  "UX/UI Designer": Palette,
  "Product Manager": Target,
  "DevOps Engineer": Shield,
  "Mobile Developer": Smartphone,
  Default: Briefcase,
};

export default function Index() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(
    authService.isAuthenticatedSync(),
  );

  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [qualification, setQualification] = useState("");
  const [customQualification, setCustomQualification] = useState("");
  const [showCustomQualification, setShowCustomQualification] = useState(false);

  const qualificationOptions = [
    "High School Diploma",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD/Doctorate",
    "Professional Certificate",
    "Trade School Certificate",
    "Bootcamp Graduate",
    "Self-Taught",
    "Currently Studying",
    "Other"
  ];

  const handleQualificationChange = (value: string) => {
    setQualification(value);
    setShowCustomQualification(value === "Other");
    if (value !== "Other") {
      setCustomQualification("");
    }
  };
  const [recommendations, setRecommendations] = useState<
    CareerRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  const availableInterests = [
    // Technology & IT
    "Technology",
    "AI/ML",
    "Cybersecurity",
    "Cloud Computing",
    "Mobile Development",
    "Web Development",
    "Blockchain",
    "IoT",
    "Robotics",
    "VR/AR",

    // Creative & Design
    "Design",
    "Graphic Design",
    "Photography",
    "Video Editing",
    "Animation",
    "Digital Art",
    "Fashion Design",
    "Interior Design",
    "Architecture",

    // Business & Finance
    "Business",
    "Finance",
    "Entrepreneurship",
    "Investment",
    "Cryptocurrency",
    "E-commerce",
    "Digital Marketing",
    "Sales",
    "Consulting",
    "Real Estate",

    // Science & Analysis
    "Data",
    "Data Science",
    "Research",
    "Analytics",
    "Statistics",
    "Machine Learning",
    "Scientific Research",
    "Biotechnology",
    "Chemistry",
    "Physics",

    // Healthcare & Life Sciences
    "Healthcare",
    "Medicine",
    "Nursing",
    "Mental Health",
    "Fitness",
    "Nutrition",
    "Pharmacy",
    "Medical Research",
    "Public Health",

    // Education & Training
    "Education",
    "Teaching",
    "Training & Development",
    "Online Learning",
    "Academic Research",
    "Corporate Training",

    // Media & Communication
    "Marketing",
    "Content Creation",
    "Social Media",
    "Journalism",
    "Public Relations",
    "Broadcasting",
    "Podcasting",
    "Writing",
    "Blogging",

    // Entertainment & Gaming
    "Gaming",
    "Game Development",
    "Entertainment",
    "Music",
    "Film Making",
    "Sports",
    "Event Management",

    // Social Impact & Environment
    "Social Impact",
    "Non-profit",
    "Environmental Science",
    "Sustainability",
    "Social Work",
    "Community Development",
    "Human Rights",

    // Specialized Fields
    "Law",
    "Psychology",
    "Travel & Tourism",
    "Agriculture",
    "Manufacturing",
    "Logistics",
    "Aviation",
    "Automotive",
    "Energy",
  ];

  const availableSkills = [
    // Technical Skills
    "Programming",
    "Software Development",
    "Web Development",
    "Mobile Development",
    "Database Management",
    "Cloud Computing",
    "DevOps",
    "Cybersecurity",
    "Network Administration",
    "System Administration",
    "IT Support",
    "Quality Assurance",
    "Software Testing",

    // Data & Analytics
    "Data Analysis",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Statistical Analysis",
    "Data Visualization",
    "Business Intelligence",
    "Big Data",
    "Predictive Modeling",
    "SQL",
    "Python",
    "R Programming",

    // Design & Creative
    "Design",
    "UI/UX Design",
    "Graphic Design",
    "Visual Design",
    "User Research",
    "Prototyping",
    "Adobe Creative Suite",
    "Figma",
    "Photography",
    "Video Editing",
    "Animation",
    "Digital Art",
    "3D Modeling",
    "Illustration",

    // Business & Management
    "Leadership",
    "Project Management",
    "Product Management",
    "Business Analysis",
    "Strategic Planning",
    "Operations Management",
    "Financial Analysis",
    "Budget Management",
    "Risk Management",
    "Change Management",
    "Process Improvement",

    // Marketing & Sales
    "Digital Marketing",
    "Content Marketing",
    "Social Media Marketing",
    "SEO/SEM",
    "Email Marketing",
    "Sales",
    "Customer Service",
    "Brand Management",
    "Market Research",
    "Public Relations",
    "Advertising",
    "Copywriting",

    // Communication & Soft Skills
    "Communication",
    "Public Speaking",
    "Writing",
    "Technical Writing",
    "Presentation Skills",
    "Interpersonal Skills",
    "Teamwork",
    "Collaboration",
    "Negotiation",
    "Conflict Resolution",
    "Customer Relations",

    // Problem Solving & Analysis
    "Problem Solving",
    "Critical Thinking",
    "Analytical Thinking",
    "Research",
    "Investigation",
    "Decision Making",
    "Attention to Detail",
    "Organization",
    "Time Management",
    "Multitasking",

    // Creative & Innovation
    "Creativity",
    "Innovation",
    "Brainstorming",
    "Ideation",
    "Design Thinking",
    "Creative Problem Solving",

    // Languages & Cultural
    "Multilingual",
    "Translation",
    "Cross-cultural Communication",
    "International Business",

    // Specialized Skills
    "Teaching",
    "Training",
    "Mentoring",
    "Consulting",
    "Healthcare",
    "Legal Knowledge",
    "Compliance",
    "Engineering",
    "Manufacturing",
    "Quality Control",
    "Supply Chain",
    "Logistics",
  ];

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleSkillToggle = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const generateRecommendations = async () => {
    if (interests.length === 0 || skills.length === 0) {
      toast({
        title: "Missing Information",
        description:
          "Please select at least one interest and one skill to get recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);

    // Simulate AI processing with progress updates
    const progressSteps = [
      { progress: 20, message: "Analyzing your interests..." },
      { progress: 40, message: "Evaluating your skills..." },
      { progress: 60, message: "Considering your CGPA and experience..." },
      { progress: 80, message: "Matching with career opportunities..." },
      { progress: 100, message: "Generating personalized recommendations..." },
    ];

    for (const step of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoadingProgress(step.progress);
    }

    // Mock recommendations with real course URLs
    const mockRecommendations: CareerRecommendation[] = [
      {
        title: "Data Scientist",
        description:
          "Analyze complex datasets to extract insights and drive business decisions using statistical methods and machine learning.",
        requiredSkills: [
          "Python",
          "Statistics",
          "Machine Learning",
          "SQL",
          "Data Visualization",
          "Critical Thinking",
        ],
        averageSalary: "₹8-25 LPA ($60k-150k)",
        jobGrowth: "+35% (Next 5 years)",
        difficulty: "Hard",
        timeToStart: "6-12 months",
        learningPath: [
          "Python Programming",
          "Statistics & Probability",
          "Machine Learning",
          "Data Visualization",
          "SQL",
          "Deep Learning",
        ],
        topCompanies: [
          "Google",
          "Meta",
          "Microsoft",
          "Amazon",
          "Netflix",
          "Flipkart",
          "Zomato",
        ],
        matchScore: 95,
        courses: [
          {
            title: "Python for Data Science",
            provider: "freeCodeCamp",
            duration: "12 hours",
            url: "https://www.freecodecamp.org/learn/data-analysis-with-python/",
            type: "free",
          },
          {
            title: "Machine Learning Course",
            provider: "Andrew Ng - Coursera",
            duration: "11 weeks",
            url: "https://www.coursera.org/learn/machine-learning",
            type: "free",
          },
          {
            title: "Data Science Fundamentals",
            provider: "Khan Academy",
            duration: "40 hours",
            url: "https://www.khanacademy.org/computing/intro-to-programming",
            type: "free",
          },
        ],
        certifications: [
          {
            name: "Google Data Analytics Certificate",
            provider: "Google",
            difficulty: "Beginner",
            url: "https://www.coursera.org/professional-certificates/google-data-analytics",
          },
          {
            name: "IBM Data Science Certificate",
            provider: "IBM",
            difficulty: "Intermediate",
            url: "https://www.coursera.org/professional-certificates/ibm-data-science",
          },
          {
            name: "Microsoft Azure Data Scientist",
            provider: "Microsoft",
            difficulty: "Advanced",
            url: "https://docs.microsoft.com/en-us/learn/certifications/azure-data-scientist/",
          },
        ],
        roadmap: [
          {
            level: "Beginner (0-3 months)",
            skills: ["Python", "SQL", "Statistics"],
            duration: "3 months",
            projects: ["Exploratory Data Analysis", "Basic Visualization"],
          },
          {
            level: "Intermediate (3-8 months)",
            skills: ["Machine Learning", "Pandas", "Scikit-learn"],
            duration: "5 months",
            projects: ["Prediction Models", "Classification Projects"],
          },
          {
            level: "Advanced (8-12 months)",
            skills: ["Deep Learning", "TensorFlow", "Big Data"],
            duration: "4 months",
            projects: ["Neural Networks", "Real-time Analytics"],
          },
        ],
        locations: [
          { city: "Bangalore", demand: "High", avgSalary: "₹15-30 LPA" },
          { city: "Hyderabad", demand: "High", avgSalary: "₹12-25 LPA" },
          { city: "Mumbai", demand: "Medium", avgSalary: "₹10-22 LPA" },
        ],
      },
      {
        title: "Full Stack Developer",
        description:
          "Build complete web applications from frontend user interfaces to backend servers and databases.",
        requiredSkills: [
          "JavaScript",
          "React",
          "Node.js",
          "Databases",
          "Problem Solving",
          "Git",
        ],
        averageSalary: "₹5-20 LPA ($50k-120k)",
        jobGrowth: "+25% (Next 5 years)",
        difficulty: "Medium",
        timeToStart: "4-8 months",
        learningPath: [
          "HTML/CSS",
          "JavaScript",
          "React",
          "Node.js",
          "Databases",
          "Cloud Deployment",
        ],
        topCompanies: [
          "Swiggy",
          "Paytm",
          "Razorpay",
          "Freshworks",
          "Zoho",
          "Byju's",
          "Unacademy",
        ],
        matchScore: 88,
        courses: [
          {
            title: "The Complete Web Developer Bootcamp",
            provider: "freeCodeCamp",
            duration: "300 hours",
            url: "https://www.freecodecamp.org/learn/responsive-web-design/",
            type: "free",
          },
          {
            title: "Full Stack Open",
            provider: "University of Helsinki",
            duration: "13 parts",
            url: "https://fullstackopen.com/en/",
            type: "free",
          },
          {
            title: "React Complete Guide",
            provider: "React.dev",
            duration: "20 hours",
            url: "https://react.dev/learn",
            type: "free",
          },
        ],
        certifications: [
          {
            name: "freeCodeCamp Full Stack",
            provider: "freeCodeCamp",
            difficulty: "Beginner",
            url: "https://www.freecodecamp.org/learn/",
          },
          {
            name: "Meta Front-End Developer",
            provider: "Meta",
            difficulty: "Intermediate",
            url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
          },
          {
            name: "AWS Developer Associate",
            provider: "Amazon",
            difficulty: "Advanced",
            url: "https://aws.amazon.com/certification/certified-developer-associate/",
          },
        ],
        roadmap: [
          {
            level: "Beginner (0-2 months)",
            skills: ["HTML", "CSS", "JavaScript"],
            duration: "2 months",
            projects: ["Static Websites", "DOM Manipulation"],
          },
          {
            level: "Intermediate (2-6 months)",
            skills: ["React", "Node.js", "Express"],
            duration: "4 months",
            projects: ["Todo App", "Blog Platform"],
          },
          {
            level: "Advanced (6-8 months)",
            skills: ["Database Design", "APIs", "Cloud Deployment"],
            duration: "2 months",
            projects: ["E-commerce Site", "Social Media App"],
          },
        ],
        locations: [
          { city: "Pune", demand: "High", avgSalary: "₹8-18 LPA" },
          { city: "Chennai", demand: "High", avgSalary: "₹7-16 LPA" },
          { city: "Delhi", demand: "Medium", avgSalary: "₹9-20 LPA" },
        ],
      },
      {
        title: "UX/UI Designer",
        description:
          "Create user-centered designs for digital products, focusing on user experience and beautiful, functional interfaces.",
        requiredSkills: [
          "Design",
          "Creativity",
          "User Research",
          "Prototyping",
          "Figma",
          "Adobe Creative Suite",
        ],
        averageSalary: "₹4-15 LPA ($45k-100k)",
        jobGrowth: "+20% (Next 5 years)",
        difficulty: "Medium",
        timeToStart: "3-6 months",
        learningPath: [
          "Design Principles",
          "User Research",
          "Wireframing",
          "Prototyping",
          "Visual Design",
          "Usability Testing",
        ],
        topCompanies: [
          "Adobe",
          "Figma",
          "Airbnb",
          "Uber",
          "Spotify",
          "Ola",
          "PhonePe",
        ],
        matchScore: 82,
        courses: [
          {
            title: "Google UX Design Certificate",
            provider: "Coursera",
            duration: "6 months",
            url: "https://www.coursera.org/professional-certificates/google-ux-design",
            type: "free",
          },
          {
            title: "UI/UX Design Specialization",
            provider: "California Institute of Arts",
            duration: "8 months",
            url: "https://www.coursera.org/specializations/ui-ux-design",
            type: "free",
          },
          {
            title: "Design Thinking Process",
            provider: "MIT OpenCourseWare",
            duration: "6 weeks",
            url: "https://ocw.mit.edu/courses/15-390-new-enterprises-spring-2013/",
            type: "free",
          },
        ],
        certifications: [
          {
            name: "Google UX Design Certificate",
            provider: "Google",
            difficulty: "Beginner",
            url: "https://www.coursera.org/professional-certificates/google-ux-design",
          },
          {
            name: "Adobe Certified Expert",
            provider: "Adobe",
            difficulty: "Intermediate",
            url: "https://www.adobe.com/training/certification.html",
          },
          {
            name: "Interaction Design Foundation",
            provider: "IxDF",
            difficulty: "Advanced",
            url: "https://www.interaction-design.org/courses",
          },
        ],
        roadmap: [
          {
            level: "Beginner (0-2 months)",
            skills: ["Design Principles", "Figma", "User Research"],
            duration: "2 months",
            projects: ["App Redesign", "User Journey Maps"],
          },
          {
            level: "Intermediate (2-5 months)",
            skills: ["Prototyping", "Interaction Design", "Design Systems"],
            duration: "3 months",
            projects: ["Mobile App Design", "Web Platform Design"],
          },
          {
            level: "Advanced (5-6 months)",
            skills: ["Advanced Prototyping", "Design Leadership", "Strategy"],
            duration: "1 month",
            projects: ["Complete Product Design", "Design System Creation"],
          },
        ],
        locations: [
          { city: "Bangalore", demand: "High", avgSalary: "₹6-15 LPA" },
          { city: "Mumbai", demand: "High", avgSalary: "₹7-14 LPA" },
          { city: "Gurgaon", demand: "Medium", avgSalary: "₹8-16 LPA" },
        ],
      },
    ];

    setRecommendations(mockRecommendations);
    setIsLoading(false);
    setLoadingProgress(100);

    // Show success notification
    toast({
      title: "Assessment Complete! 🎉",
      description: `Your personalized career recommendations are ready. CGPA: ${cgpa || "Not specified"}, Qualification: ${qualification || "Not specified"} considered in the analysis.`,
      duration: 5000,
    });
  };

  const filteredRecommendations = recommendations.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "" || rec.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 75) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCareerIcon = (title: string) => {
    const IconComponent = careerIcons[title] || careerIcons["Default"];
    return IconComponent;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/50 to-blue-50 dark:from-gray-950 dark:via-emerald-950/20 dark:to-blue-950 relative overflow-hidden">
      {/* Modern Background Design Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric Patterns */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-emerald-400/15 to-teal-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-64 h-64 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-gradient-to-br from-blue-400/15 to-emerald-500/15 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-gradient-to-br from-teal-400/10 to-blue-600/10 rounded-full blur-2xl animate-pulse delay-500"></div>

        {/* Modern Mesh Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_90%_30%,rgba(20,184,166,0.1),transparent_50%)]"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-emerald-400/60 rounded-full animate-ping"></div>
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-teal-400/60 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-ping delay-1500"></div>
        <div className="absolute top-2/3 right-1/2 w-1 h-1 bg-emerald-500/50 rounded-full animate-ping delay-2000"></div>
      </div>
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-8">
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                Perfect Career Path
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Powered by advanced AI, we analyze your interests, skills, and academic background to recommend careers that perfectly match your unique profile. Start your journey towards a fulfilling and successful career today.
            </p>
          </div>

          {!isLoggedIn && (
            <div className="mb-12">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-700 shadow-2xl rounded-2xl text-lg px-10 py-7 transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"
              >
                <Link to="/register">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started Free
                </Link>
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                No credit card required • 100% free to start
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Career Assessment Form */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto max-w-5xl">
          <Card className="shadow-2xl border border-emerald-200/30 dark:border-emerald-700/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-600/10 px-8 py-10 text-center">
              <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                AI-Powered Career Assessment
              </CardTitle>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Answer a few questions to get personalized career recommendations powered by advanced artificial intelligence
              </p>
            </div>
            <CardContent className="p-10 space-y-10">
              {/* Interests Selection */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-6 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Heart className="h-6 w-6 mr-3 text-emerald-500" />
                  What are your interests?
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">(Select 3-8 that resonate with you)</span>
                </h3>
                <div className="flex flex-wrap gap-3 max-h-64 overflow-y-auto p-4 bg-white/80 dark:bg-gray-800/50 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30">
                  {availableInterests.map((interest) => (
                    <Button
                      key={interest}
                      variant={
                        interests.includes(interest) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleInterestToggle(interest)}
                      className={`rounded-full transition-all duration-300 text-sm font-medium ${
                        interests.includes(interest)
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg text-white hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105"
                          : "border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transform hover:scale-105"
                      }`}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selected: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{interests.length}</span> interests
                  </p>
                  {interests.length >= 3 && (
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Great selection!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Selection */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30 p-6 rounded-2xl border border-teal-200/50 dark:border-teal-700/50">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Zap className="h-6 w-6 mr-3 text-teal-500" />
                  What are your top skills?
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">(Select 5-10 skills you're confident in)</span>
                </h3>
                <div className="flex flex-wrap gap-3 max-h-64 overflow-y-auto p-4 bg-white/80 dark:bg-gray-800/50 rounded-xl border border-teal-200/30 dark:border-teal-700/30">
                  {availableSkills.map((skill) => (
                    <Button
                      key={skill}
                      variant={skills.includes(skill) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSkillToggle(skill)}
                      className={`rounded-full transition-all duration-300 text-sm font-medium ${
                        skills.includes(skill)
                          ? "bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg text-white hover:from-teal-600 hover:to-blue-700 transform hover:scale-105"
                          : "border-teal-300 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-300 transform hover:scale-105"
                      }`}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selected: <span className="font-semibold text-teal-600 dark:text-teal-400">{skills.length}</span> skills
                  </p>
                  {skills.length >= 5 && (
                    <div className="flex items-center text-teal-600 dark:text-teal-400">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Excellent range!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience Level, CGPA, and Qualification Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Experience Level */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-blue-500" />
                    Experience Level
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Beginner",
                      "Some Experience",
                      "Experienced",
                      "Expert",
                    ].map((level) => (
                      <Button
                        key={level}
                        variant={experience === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExperience(level)}
                        className={`w-full justify-start rounded-xl transition-all duration-300 ${
                          experience === level
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg text-white transform scale-105"
                            : "border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300"
                        }`}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* CGPA Input */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-6 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                  <Label
                    htmlFor="cgpa"
                    className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                  >
                    <Percent className="h-5 w-5 mr-2 text-emerald-500" />
                    CGPA / Percentage
                  </Label>
                  <div className="space-y-3">
                    <Input
                      id="cgpa"
                      type="number"
                      placeholder="e.g., 8.5 (CGPA) or 85 (Percentage)"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      className="rounded-xl border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Enter CGPA (0-10) or percentage (0-100)
                    </p>
                  </div>
                </div>

                {/* Qualification Dropdown */}
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30 p-6 rounded-2xl border border-teal-200/50 dark:border-teal-700/50">
                  <Label
                    htmlFor="qualification"
                    className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                  >
                    <School className="h-5 w-5 mr-2 text-teal-500" />
                    Qualification
                  </Label>
                  <div className="space-y-3">
                    <Select value={qualification} onValueChange={handleQualificationChange}>
                      <SelectTrigger className="rounded-xl border-teal-300 focus:ring-teal-500 focus:border-teal-500">
                        <SelectValue placeholder="Select your qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualificationOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {showCustomQualification && (
                      <Input
                        type="text"
                        placeholder="Please specify your qualification"
                        value={customQualification}
                        onChange={(e) => setCustomQualification(e.target.value)}
                        className="rounded-xl border-teal-300 focus:ring-teal-500 focus:border-teal-500"
                      />
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Select your highest qualification or current education
                    </p>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center pt-6">
                <Button
                  onClick={generateRecommendations}
                  disabled={
                    isLoading || interests.length === 0 || skills.length === 0
                  }
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-700 shadow-2xl rounded-2xl px-16 py-8 text-xl font-bold transition-all duration-300 hover:shadow-emerald-500/25 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get My Career Recommendations
                    </>
                  )}
                </Button>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  AI will analyze your profile and suggest the best career
                  matches
                </p>
              </div>

              {/* Progress Bar */}
              {isLoading && (
                <div className="space-y-2">
                  <Progress value={loadingProgress} className="w-full" />
                  <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    {loadingProgress < 20 && "Analyzing your interests..."}
                    {loadingProgress >= 20 &&
                      loadingProgress < 40 &&
                      "Evaluating your skills..."}
                    {loadingProgress >= 40 &&
                      loadingProgress < 60 &&
                      "Considering your CGPA and experience..."}
                    {loadingProgress >= 60 &&
                      loadingProgress < 80 &&
                      "Matching with career opportunities..."}
                    {loadingProgress >= 80 &&
                      "Generating personalized recommendations..."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Career Recommendations */}
      {recommendations.length > 0 && (
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Your Personalized Career Recommendations
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Based on your interests, skills, and academic performance, here
                are the careers that match your profile best.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search career recommendations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedDifficulty === "" ? "default" : "outline"}
                  onClick={() => setSelectedDifficulty("")}
                  className="rounded-xl"
                >
                  All Levels
                </Button>
                <Button
                  variant={
                    selectedDifficulty === "Easy" ? "default" : "outline"
                  }
                  onClick={() => setSelectedDifficulty("Easy")}
                  className="rounded-xl"
                >
                  Easy
                </Button>
                <Button
                  variant={
                    selectedDifficulty === "Medium" ? "default" : "outline"
                  }
                  onClick={() => setSelectedDifficulty("Medium")}
                  className="rounded-xl"
                >
                  Medium
                </Button>
                <Button
                  variant={
                    selectedDifficulty === "Hard" ? "default" : "outline"
                  }
                  onClick={() => setSelectedDifficulty("Hard")}
                  className="rounded-xl"
                >
                  Hard
                </Button>
              </div>
            </div>

            {/* Recommendation Cards */}
            <div className="space-y-8">
              {filteredRecommendations.map((career, index) => {
                const IconComponent = getCareerIcon(career.title);
                return (
                  <Card
                    key={index}
                    className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden"
                  >
                    <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 rounded-2xl shadow-lg">
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                              {career.title}
                            </CardTitle>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                              {career.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-3xl font-bold ${getMatchScoreColor(career.matchScore)}`}
                          >
                            {career.matchScore}%
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Match Score
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                          <div className="flex items-center text-green-700 dark:text-green-300 mb-1">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">
                              Salary Range
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                            {career.averageSalary}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <div className="flex items-center text-blue-700 dark:text-blue-300 mb-1">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">
                              Job Growth
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                            {career.jobGrowth}
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                          <div className="flex items-center text-purple-700 dark:text-purple-300 mb-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">
                              Time to Start
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                            {career.timeToStart}
                          </p>
                        </div>
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                          <div className="flex items-center text-orange-700 dark:text-orange-300 mb-1">
                            <Target className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">
                              Difficulty
                            </span>
                          </div>
                          <Badge
                            className={getDifficultyColor(career.difficulty)}
                          >
                            {career.difficulty}
                          </Badge>
                        </div>
                      </div>

                      {/* Detailed Information Tabs */}
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 rounded-xl">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="skills">Skills</TabsTrigger>
                          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                          <TabsTrigger value="courses">Courses</TabsTrigger>
                          <TabsTrigger value="jobs">Jobs</TabsTrigger>
                        </TabsList>

                        <TabsContent
                          value="overview"
                          className="space-y-4 mt-4"
                        >
                          {/* Required Skills */}
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                              Required Skills
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.requiredSkills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Learning Path */}
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                              Learning Path
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.learningPath.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Top Companies */}
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                              Top Hiring Companies
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.topCompanies
                                .slice(0, 4)
                                .map((company) => (
                                  <Badge
                                    key={company}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {company}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="skills" className="space-y-4 mt-4">
                          {/* Required Skills */}
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                              Required Skills
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.requiredSkills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Top Companies */}
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                              Top Hiring Companies
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.topCompanies
                                .slice(0, 4)
                                .map((company) => (
                                  <Badge
                                    key={company}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {company}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="roadmap" className="space-y-4 mt-4">
                          {career.roadmap.map((level, i) => (
                            <div
                              key={i}
                              className="border-l-2 border-indigo-200 pl-4"
                            >
                              <div className="flex items-center mb-2">
                                <div className="w-3 h-3 bg-rose-500 dark:bg-rose-400 rounded-full -ml-6 mr-3"></div>
                                <h5 className="font-medium text-sm">
                                  {level.level}
                                </h5>
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                Duration: {level.duration}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {level.skills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="courses" className="space-y-3 mt-4">
                          {career.courses.map((course, i) => (
                            <div
                              key={i}
                              className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-sm">
                                  {course.title}
                                </h5>
                                <Badge
                                  variant={
                                    course.type === "free"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {course.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {course.provider} • {course.duration}
                              </p>
                              <Button
                                variant="link"
                                className="p-0 h-auto text-xs text-rose-600 dark:text-rose-400"
                                asChild
                              >
                                <a
                                  href={course.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View Course{" "}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </Button>
                            </div>
                          ))}
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <h5 className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-2">
                              Certifications
                            </h5>
                            {career.certifications.map((cert, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between py-1"
                              >
                                <div>
                                  <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                                    {cert.name}
                                  </p>
                                  <p className="text-xs text-blue-600 dark:text-blue-300">
                                    {cert.provider} • {cert.difficulty}
                                  </p>
                                </div>
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-xs text-blue-600 dark:text-blue-400"
                                  asChild
                                >
                                  <a
                                    href={cert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="jobs" className="space-y-3 mt-4">
                          {career.locations.map((location, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">
                                  {location.city}
                                </span>
                              </div>
                              <div className="text-right">
                                <Badge
                                  variant={
                                    location.demand === "High"
                                      ? "default"
                                      : location.demand === "Medium"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="text-xs mb-1"
                                >
                                  {location.demand} Demand
                                </Badge>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                  {location.avgSalary}
                                </p>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Ready to Start Your Career Journey?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect career
            path with CareerCompass AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:via-purple-700 hover:to-cyan-600 shadow-xl rounded-xl"
            >
              <Link to="/chat">
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat with AI Assistant
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link to="/resume-analyzer">
                <BookOpen className="mr-2 h-5 w-5" />
                Analyze Your Resume
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100/70 dark:bg-slate-800/70 border-t border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
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
