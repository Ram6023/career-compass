import React, { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Camera,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Settings,
  Bell,
  Shield,
  Download,
  Upload,
  Compass,
  Sun,
  Moon,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Lock,
  Building,
  MapPinned,
  Laptop,
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useLanguage } from "@/components/ui/language-provider";
import { LanguageSelector } from "@/components/ui/language-selector";
import { toast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { authService } from "@/lib/auth";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  bio: string;
  profilePicture: string;
  jobTitle: string;
  company: string;
  experience: string;
  education: string;
  skills: string[];
  interests: string[];
  // Education details
  degree: string;
  university: string;
  yearOfStudy: string;
  stream: string;
  // Career preferences
  preferredRoles: string[];
  preferredDomains: string[];
  workType: "remote" | "hybrid" | "onsite" | "";
  preferredLocations: string[];
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
    portfolio: string;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    careerTips: boolean;
    goalReminders: boolean;
    profileVisibility: "public" | "private";
  };
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    type: "goal" | "skill" | "career";
  }>;
  resumeUrl?: string;
  resumeScore?: number;
}

const SAMPLE_USER: UserProfile = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1995-06-15",
  location: "San Francisco, CA",
  bio: "Passionate software developer with 5+ years of experience in full-stack development. Always eager to learn new technologies and solve complex problems.",
  profilePicture: "",
  jobTitle: "Senior Software Engineer",
  company: "TechCorp Inc.",
  experience: "5+ years",
  education: "Bachelor of Science in Computer Science",
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
  interests: ["AI/ML", "Web Development", "Open Source", "Tech Startups"],
  // Education details
  degree: "",
  university: "",
  yearOfStudy: "",
  stream: "",
  // Career preferences
  preferredRoles: [],
  preferredDomains: [],
  workType: "",
  preferredLocations: [],
  socialLinks: {
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    twitter: "https://twitter.com/johndoe",
    portfolio: "https://johndoe.dev",
  },
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    careerTips: true,
    goalReminders: true,
    profileVisibility: "public",
  },
  achievements: [
    {
      title: "React Mastery Goal Completed",
      description:
        "Successfully completed 3-month React learning goal with 95% progress",
      date: "2024-01-15",
      type: "goal",
    },
    {
      title: "Full Stack Certification",
      description: "Earned certification in Full Stack Web Development",
      date: "2023-12-10",
      type: "skill",
    },
    {
      title: "Career Milestone",
      description: "Promoted to Senior Software Engineer position",
      date: "2023-11-01",
      type: "career",
    },
  ],
  resumeUrl: "",
  resumeScore: 0,
};

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<UserProfile>(SAMPLE_USER);
  const [originalProfile, setOriginalProfile] = useState<UserProfile>(SAMPLE_USER);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get active tab from URL query params
  const activeTab = searchParams.get("tab") || "overview";

  // New feature states
  const [resumes, setResumes] = useState<Array<{ id: string; name: string; url: string; uploadedAt: string }>>([]);
  const [savedCareers, setSavedCareers] = useState<string[]>([]);
  const [skillProgress, setSkillProgress] = useState<Record<string, number>>({});
  const [courses, setCourses] = useState<Array<{ title: string; provider: string; completed: boolean; certificateUrl?: string }>>([]);
  const [applications, setApplications] = useState<Array<{ role: string; company: string; status: "applied" | "shortlisted" | "rejected" }>>([]);
  const [mockInterviews, setMockInterviews] = useState<Array<{ id: string; role: string; date: string; transcript?: string; feedback?: string }>>([]);
  const [roadmap, setRoadmap] = useState<Array<{ milestone: string; due: string; completed: boolean }>>([]);
  const [badges, setBadges] = useState<Array<{ id: string; title: string; earnedAt: string }>>([]);
  const resumeUploadRef = useRef<HTMLInputElement>(null);

  // Load profile from database on mount
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const loadedProfile: UserProfile = {
            id: currentUser.id,
            firstName: currentUser.firstName || currentUser.name?.split(" ")[0] || "",
            lastName: currentUser.lastName || currentUser.name?.split(" ").slice(1).join(" ") || "",
            email: currentUser.email,
            phone: currentUser.phone || "",
            dateOfBirth: currentUser.dateOfBirth || "",
            location: currentUser.location || "",
            bio: currentUser.bio || "",
            profilePicture: currentUser.avatar || "",
            jobTitle: currentUser.jobTitle || "",
            company: currentUser.company || "",
            experience: currentUser.experience || "",
            education: currentUser.education || "",
            skills: currentUser.skills || [],
            interests: currentUser.interests || [],
            degree: currentUser.degree || "",
            university: currentUser.university || "",
            yearOfStudy: currentUser.yearOfStudy || "",
            stream: currentUser.stream || "",
            preferredRoles: currentUser.preferredRoles || [],
            preferredDomains: currentUser.preferredDomains || [],
            workType: currentUser.workType || "",
            preferredLocations: currentUser.preferredLocations || [],
            socialLinks: {
              linkedin: currentUser.socialLinks?.linkedin || "",
              github: currentUser.socialLinks?.github || "",
              twitter: currentUser.socialLinks?.twitter || "",
              portfolio: currentUser.socialLinks?.portfolio || "",
            },
            preferences: {
              emailNotifications: currentUser.preferences?.emailNotifications ?? true,
              smsNotifications: currentUser.preferences?.smsNotifications ?? false,
              careerTips: currentUser.preferences?.careerTips ?? true,
              goalReminders: currentUser.preferences?.goalReminders ?? true,
              profileVisibility: currentUser.preferences?.profileVisibility || "public",
            },
            achievements: SAMPLE_USER.achievements, // Achievements are demo data for now
            resumeUrl: currentUser.resumeUrl || "",
            resumeScore: currentUser.resumeScore || 0,
          };
          setProfile(loadedProfile);
          setOriginalProfile(loadedProfile);

          if (currentUser.resumeUrl) {
            setResumes([{
              id: "primary",
              name: "Primary Resume.pdf",
              url: currentUser.resumeUrl,
              uploadedAt: new Date().toISOString()
            }]);
          }
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleProfilePictureUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile((prev) => ({
          ...prev,
          profilePicture: e.target?.result as string,
        }));
        toast({
          title: "Profile Picture Updated! 📸",
          description: "Your profile picture has been successfully updated",
          duration: 3000,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
      toast({
        title: "Skill Added! 🚀",
        description: `${newSkill} has been added to your skills`,
        duration: 2000,
      });
    }
  };

  const removeSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
      toast({
        title: "Interest Added! ⭐",
        description: `${newInterest} has been added to your interests`,
        duration: 2000,
      });
    }
  };

  const removeInterest = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const result = await authService.updateProfile({
        name: `${profile.firstName} ${profile.lastName}`,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        location: profile.location,
        bio: profile.bio,
        avatar: profile.profilePicture,
        jobTitle: profile.jobTitle,
        company: profile.company,
        experience: profile.experience,
        education: profile.education,
        skills: profile.skills,
        interests: profile.interests,
        degree: profile.degree,
        university: profile.university,
        yearOfStudy: profile.yearOfStudy,
        stream: profile.stream,
        preferredRoles: profile.preferredRoles,
        preferredDomains: profile.preferredDomains,
        workType: profile.workType,
        preferredLocations: profile.preferredLocations,
        socialLinks: profile.socialLinks,
        preferences: profile.preferences,
        resumeUrl: profile.resumeUrl,
        resumeScore: profile.resumeScore,
      });

      if (result.success) {
        setOriginalProfile(profile);
        setIsEditing(false);
        setEditingSection(null);
        toast({
          title: "Profile Saved! ✅",
          description: "Your profile changes have been saved successfully",
          duration: 3000,
        });
      } else {
        toast({
          title: "Save Failed",
          description: result.error || "Failed to save profile changes",
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditing = () => {
    setProfile(originalProfile);
    setIsEditing(false);
    setEditingSection(null);
    toast({
      title: "Changes Cancelled",
      description: "Your changes have been discarded",
      duration: 2000,
    });
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    // Mock AI score calculation
    const mockScore = Math.floor(Math.random() * (95 - 70) + 70);

    setResumes((prev) => [
      { id: Math.random().toString(36).slice(2), name: file.name, url, uploadedAt: new Date().toISOString() },
      ...prev,
    ]);

    // Set as primary resume
    setProfile(prev => ({ ...prev, resumeUrl: url, resumeScore: mockScore }));

    toast({
      title: "Resume uploaded",
      description: `${file.name} added. AI Score: ${mockScore}/100`
    });
    e.target.value = "";
  };

  const removeResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const aiPolishResume = (id: string) => {
    const doc = resumes.find((r) => r.id === id);
    toast({ title: "AI Polishing Started", description: doc ? `Improving ${doc.name}…` : "Improving resume…" });
    // Stub: integrate with AI service later
  };

  const exportProfile = () => {
    const profileData = {
      personalInfo: {
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
      },
      professionalInfo: {
        jobTitle: profile.jobTitle,
        company: profile.company,
        experience: profile.experience,
        education: profile.education,
      },
      skills: profile.skills,
      interests: profile.interests,
      socialLinks: profile.socialLinks,
      achievements: profile.achievements,
    };

    const dataStr = JSON.stringify(profileData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "career_profile.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Profile Exported! 📄",
      description: "Your profile data has been exported successfully",
      duration: 3000,
    });
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "goal":
        return <Star className="w-4 h-4 text-yellow-500" />;
      case "skill":
        return <Award className="w-4 h-4 text-blue-500" />;
      case "career":
        return <Briefcase className="w-4 h-4 text-green-500" />;
      default:
        return <Award className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <Header pageSubtitle="My Profile" />

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="overflow-hidden shadow-xl">
            <div className="h-32 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600"></div>
            <CardContent className="relative px-6 pb-6">
              <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full p-2 shadow-xl">
                    {profile.profilePicture ? (
                      <img
                        src={profile.profilePicture}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-rose-600 hover:bg-rose-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 md:mt-16">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {profile.firstName} {profile.lastName}
                      </h1>
                      <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
                        {profile.jobTitle} at {profile.company}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{profile.email}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700"
                      >
                        {profile.experience} Experience
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700"
                      >
                        {profile.skills.length} Skills
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700"
                      >
                        {profile.achievements.length} Achievements
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue={activeTab} className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-6 md:grid-cols-10 mb-8 gap-2">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="professional"
              className="flex items-center space-x-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Professional</span>
            </TabsTrigger>
            <TabsTrigger value="documents">Resumes</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="skills">Skill Tracker</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="flex items-center space-x-2"
            >
              <Award className="w-4 h-4" />
              <span>Achievements</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Your basic personal details
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection("personal")}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingSection === "personal" || isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profile.firstName}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profile.lastName}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-1">
                          Email <Lock className="w-3 h-3 text-slate-400" />
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled
                          className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-500">Email cannot be changed</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={profile.dateOfBirth}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                dateOfBirth: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {!isEditing && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span>{profile.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>
                          {new Date(profile.dateOfBirth).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bio */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>About Me</CardTitle>
                    <CardDescription>
                      Tell others about yourself
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection("bio")}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {editingSection === "bio" || isEditing ? (
                    <div className="space-y-4">
                      <Textarea
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        rows={6}
                        placeholder="Write something about yourself..."
                      />
                      {!isEditing && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Skills and Interests */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Skills */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>
                      Your technical and professional skills
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection("skills")}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {editingSection === "skills" || isEditing ? (
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addSkill()}
                        />
                        <Button onClick={addSkill}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <span>{skill}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-1"
                              onClick={() => removeSkill(skill)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      {!isEditing && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Interests */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Interests</CardTitle>
                    <CardDescription>
                      Your career interests and passions
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection("interests")}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {editingSection === "interests" || isEditing ? (
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add an interest"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addInterest()}
                        />
                        <Button onClick={addInterest}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest) => (
                          <Badge
                            key={interest}
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <span>{interest}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-1"
                              onClick={() => removeInterest(interest)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      {!isEditing && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest) => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents / Resume Management */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader className="flex items-center justify-between flex-row">
                <div>
                  <CardTitle>Resumes & Documents</CardTitle>
                  <CardDescription>Upload, manage, and download your resumes</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Input type="file" accept=".pdf,.doc,.docx" className="hidden" ref={resumeUploadRef} onChange={handleResumeUpload} />
                  <Button variant="outline" onClick={() => resumeUploadRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Upload Resume
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {resumes.length === 0 ? (
                  <p className="text-sm text-slate-500">No resumes uploaded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {resumes.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {doc.name}
                            {profile.resumeScore > 0 && (
                              <Badge variant={profile.resumeScore > 80 ? "default" : "secondary"} className={profile.resumeScore > 80 ? "bg-green-500 hover:bg-green-600" : ""}>
                                Score: {profile.resumeScore}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">Uploaded {new Date(doc.uploadedAt).toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button asChild size="sm" variant="outline">
                            <a href={doc.url} download>
                              <Download className="w-4 h-4 mr-1" /> Download
                            </a>
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => aiPolishResume(doc.id)}>
                            <Sparkles className="w-4 h-4 mr-1" /> AI Polish
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => removeResume(doc.id)}>
                            <Trash2 className="w-4 h-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Career Dashboard</CardTitle>
                <CardDescription>Overview of your recommendations and saved careers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Recommended Paths</Label>
                  <p className="text-sm text-slate-500">Connect to the assessment on Home to populate here.</p>
                </div>
                <div>
                  <Label>Saved Careers</Label>
                  {savedCareers.length === 0 ? (
                    <p className="text-sm text-slate-500">No saved careers yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {savedCareers.map((c) => (
                        <Badge key={c} variant="secondary">{c}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skill Tracker */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Tracker</CardTitle>
                <CardDescription>Track progress towards your target career</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {profile.skills.length === 0 && (
                    <p className="text-sm text-slate-500">Add skills in the Overview tab to begin tracking.</p>
                  )}
                  {profile.skills.map((s) => (
                    <div key={s} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span>{s}</span>
                        <span className="text-xs text-slate-500">{Math.round(skillProgress[s] ?? 0)}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(0, skillProgress[s] ?? 0))}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning & Course History */}
          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader className="flex items-center justify-between flex-row">
                <div>
                  <CardTitle>Learning & Certifications</CardTitle>
                  <CardDescription>Track completed courses and certificates</CardDescription>
                </div>
                <Button size="sm" onClick={() => setCourses((prev) => [{ title: "Course Title", provider: "Udemy", completed: true }, ...prev])}>Add Course</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {courses.length === 0 ? (
                  <p className="text-sm text-slate-500">No courses added yet.</p>
                ) : (
                  courses.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{c.title}</div>
                        <div className="text-xs text-slate-500">{c.provider} • {c.completed ? "Completed" : "In progress"}</div>
                      </div>
                      {c.certificateUrl ? (
                        <Button asChild size="sm" variant="outline"><a href={c.certificateUrl} target="_blank" rel="noreferrer">View Certificate</a></Button>
                      ) : null}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job & Internship Tracker */}
          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader className="flex items-center justify-between flex-row">
                <div>
                  <CardTitle>Job & Internship Tracker</CardTitle>
                  <CardDescription>Track applications and statuses</CardDescription>
                </div>
                <Button size="sm" onClick={() => setApplications((prev) => [{ role: "Software Intern", company: "Acme", status: "applied" }, ...prev])}>Add Application</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {applications.length === 0 ? (
                  <p className="text-sm text-slate-500">No applications added yet.</p>
                ) : (
                  applications.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{a.role} @ {a.company}</div>
                        <div className="text-xs text-slate-500">Status: {a.status}</div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mock Interview & Feedback */}
          <TabsContent value="interviews" className="space-y-6">
            <Card>
              <CardHeader className="flex items-center justify-between flex-row">
                <div>
                  <CardTitle>Mock Interviews</CardTitle>
                  <CardDescription>Review transcripts and AI feedback</CardDescription>
                </div>
                <Button size="sm" onClick={() => setMockInterviews((prev) => [{ id: Math.random().toString(36).slice(2), role: "Frontend Developer", date: new Date().toISOString() }, ...prev])}>Add Interview</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockInterviews.length === 0 ? (
                  <p className="text-sm text-slate-500">No interview history yet.</p>
                ) : (
                  mockInterviews.map((m) => (
                    <div key={m.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{m.role}</div>
                        <div className="text-xs text-slate-500">{new Date(m.date).toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Transcript and feedback appear here.</div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-1" /> Download Transcript</Button>
                        <Button size="sm" variant="secondary">View AI Feedback</Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Roadmap */}
          <TabsContent value="roadmap" className="space-y-6">
            <Card>
              <CardHeader className="flex items-center justify-between flex-row">
                <div>
                  <CardTitle>Career Roadmap</CardTitle>
                  <CardDescription>Plan milestones with deadlines</CardDescription>
                </div>
                <Button size="sm" onClick={() => setRoadmap((prev) => [{ milestone: "Complete React course", due: new Date().toISOString().slice(0, 10), completed: false }, ...prev])}>Add Milestone</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {roadmap.length === 0 ? (
                  <p className="text-sm text-slate-500">No milestones added yet.</p>
                ) : (
                  roadmap.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{r.milestone}</div>
                        <div className="text-xs text-slate-500">Due: {new Date(r.due).toLocaleDateString()}</div>
                      </div>
                      <Badge variant={r.completed ? "secondary" : "outline"}>{r.completed ? "Done" : "Planned"}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Professional Info */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>
                      Your career and work details
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection("professional")}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingSection === "professional" || isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          value={profile.jobTitle}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              jobTitle: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              company: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Select
                          value={profile.experience}
                          onValueChange={(value) =>
                            setProfile((prev) => ({
                              ...prev,
                              experience: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1 years">0-1 years</SelectItem>
                            <SelectItem value="1-3 years">1-3 years</SelectItem>
                            <SelectItem value="3-5 years">3-5 years</SelectItem>
                            <SelectItem value="5+ years">5+ years</SelectItem>
                            <SelectItem value="10+ years">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="education">Education</Label>
                        <Input
                          id="education"
                          value={profile.education}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              education: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {!isEditing && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-slate-500" />
                        <span>{profile.jobTitle}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4" />
                        <span>{profile.company}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-slate-500" />
                        <span>{profile.education}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4" />
                        <span>{profile.experience}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Social Links</CardTitle>
                    <CardDescription>
                      Your professional social media profiles
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection("social")}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingSection === "social" || isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={profile.socialLinks.linkedin}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              socialLinks: {
                                ...prev.socialLinks,
                                linkedin: e.target.value,
                              },
                            }))
                          }
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          value={profile.socialLinks.github}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              socialLinks: {
                                ...prev.socialLinks,
                                github: e.target.value,
                              },
                            }))
                          }
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          value={profile.socialLinks.twitter}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              socialLinks: {
                                ...prev.socialLinks,
                                twitter: e.target.value,
                              },
                            }))
                          }
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio</Label>
                        <Input
                          id="portfolio"
                          value={profile.socialLinks.portfolio}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              socialLinks: {
                                ...prev.socialLinks,
                                portfolio: e.target.value,
                              },
                            }))
                          }
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                      {!isEditing && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(profile.socialLinks).map(
                        ([platform, url]) =>
                          url && (
                            <div
                              key={platform}
                              className="flex items-center space-x-2"
                            >
                              <span className="w-4 h-4 capitalize text-slate-500">
                                {platform}:
                              </span>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {url}
                              </a>
                            </div>
                          ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Education Details and Career Preferences Row */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Education Details */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" /> Education Details
                    </CardTitle>
                    <CardDescription>
                      Your academic background
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection("education")}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingSection === "education" || isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="degree">Degree / Qualification</Label>
                        <Select
                          value={profile.degree}
                          onValueChange={(value) =>
                            setProfile((prev) => ({
                              ...prev,
                              degree: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your degree" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High School">High School</SelectItem>
                            <SelectItem value="Diploma">Diploma</SelectItem>
                            <SelectItem value="Bachelor's">Bachelor's Degree</SelectItem>
                            <SelectItem value="Master's">Master's Degree</SelectItem>
                            <SelectItem value="PhD">PhD / Doctorate</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="university">College / University</Label>
                        <Input
                          id="university"
                          value={profile.university}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              university: e.target.value,
                            }))
                          }
                          placeholder="Enter your institution name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="yearOfStudy">Year of Study</Label>
                          <Select
                            value={profile.yearOfStudy}
                            onValueChange={(value) =>
                              setProfile((prev) => ({
                                ...prev,
                                yearOfStudy: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1st Year">1st Year</SelectItem>
                              <SelectItem value="2nd Year">2nd Year</SelectItem>
                              <SelectItem value="3rd Year">3rd Year</SelectItem>
                              <SelectItem value="4th Year">4th Year</SelectItem>
                              <SelectItem value="Graduate">Graduate</SelectItem>
                              <SelectItem value="Post-Graduate">Post-Graduate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stream">Stream / Branch</Label>
                          <Input
                            id="stream"
                            value={profile.stream}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                stream: e.target.value,
                              }))
                            }
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                      </div>
                      {!isEditing && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-slate-500" />
                        <span>{profile.degree || "Not specified"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-slate-500" />
                        <span>{profile.university || "Not specified"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>{profile.yearOfStudy || "Not specified"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Compass className="w-4 h-4 text-slate-500" />
                        <span>{profile.stream || "Not specified"}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Career Preferences */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" /> Career Preferences
                    </CardTitle>
                    <CardDescription>
                      Your ideal work environment
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection("careerPrefs")}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingSection === "careerPrefs" || isEditing ? (
                    <div className="space-y-4">
                      {/* Preferred Roles */}
                      <div className="space-y-2">
                        <Label>Preferred Job Roles</Label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add a role"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && newRole.trim() && !profile.preferredRoles.includes(newRole.trim())) {
                                setProfile((prev) => ({
                                  ...prev,
                                  preferredRoles: [...prev.preferredRoles, newRole.trim()],
                                }));
                                setNewRole("");
                              }
                            }}
                          />
                          <Button onClick={() => {
                            if (newRole.trim() && !profile.preferredRoles.includes(newRole.trim())) {
                              setProfile((prev) => ({
                                ...prev,
                                preferredRoles: [...prev.preferredRoles, newRole.trim()],
                              }));
                              setNewRole("");
                            }
                          }}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profile.preferredRoles.map((role) => (
                            <Badge key={role} variant="secondary" className="flex items-center space-x-1">
                              <span>{role}</span>
                              <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => setProfile((prev) => ({ ...prev, preferredRoles: prev.preferredRoles.filter((r) => r !== role) }))}>
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Preferred Domains */}
                      <div className="space-y-2">
                        <Label>Preferred Domains</Label>
                        <div className="flex flex-wrap gap-2">
                          {["AI/ML", "Web Development", "Data Science", "Mobile Development", "Cloud", "DevOps", "Cybersecurity", "Blockchain"].map((domain) => (
                            <Badge
                              key={domain}
                              variant={profile.preferredDomains.includes(domain) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                setProfile((prev) => ({
                                  ...prev,
                                  preferredDomains: prev.preferredDomains.includes(domain)
                                    ? prev.preferredDomains.filter((d) => d !== domain)
                                    : [...prev.preferredDomains, domain],
                                }));
                              }}
                            >
                              {domain}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Work Type */}
                      <div className="space-y-2">
                        <Label>Work Type</Label>
                        <div className="flex gap-3">
                          {[
                            { value: "remote", label: "Remote", icon: Laptop },
                            { value: "hybrid", label: "Hybrid", icon: Building },
                            { value: "onsite", label: "On-site", icon: MapPinned },
                          ].map(({ value, label, icon: Icon }) => (
                            <Button
                              key={value}
                              variant={profile.workType === value ? "default" : "outline"}
                              size="sm"
                              onClick={() => setProfile((prev) => ({ ...prev, workType: value as "remote" | "hybrid" | "onsite" }))}
                              className="flex items-center gap-1"
                            >
                              <Icon className="w-4 h-4" />
                              {label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Preferred Locations */}
                      <div className="space-y-2">
                        <Label>Preferred Locations</Label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add a location"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && newLocation.trim() && !profile.preferredLocations.includes(newLocation.trim())) {
                                setProfile((prev) => ({
                                  ...prev,
                                  preferredLocations: [...prev.preferredLocations, newLocation.trim()],
                                }));
                                setNewLocation("");
                              }
                            }}
                          />
                          <Button onClick={() => {
                            if (newLocation.trim() && !profile.preferredLocations.includes(newLocation.trim())) {
                              setProfile((prev) => ({
                                ...prev,
                                preferredLocations: [...prev.preferredLocations, newLocation.trim()],
                              }));
                              setNewLocation("");
                            }
                          }}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profile.preferredLocations.map((loc) => (
                            <Badge key={loc} variant="secondary" className="flex items-center space-x-1">
                              <span>{loc}</span>
                              <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => setProfile((prev) => ({ ...prev, preferredLocations: prev.preferredLocations.filter((l) => l !== loc) }))}>
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {!isEditing && (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => setEditingSection(null)}>
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingSection(null)}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs text-slate-500">Preferred Roles</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.preferredRoles.length > 0 ? (
                            profile.preferredRoles.map((role) => (
                              <Badge key={role} variant="secondary">{role}</Badge>
                            ))
                          ) : (
                            <span className="text-sm text-slate-400">Not specified</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500">Preferred Domains</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.preferredDomains.length > 0 ? (
                            profile.preferredDomains.map((domain) => (
                              <Badge key={domain} variant="outline">{domain}</Badge>
                            ))
                          ) : (
                            <span className="text-sm text-slate-400">Not specified</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Laptop className="w-4 h-4 text-slate-500" />
                        <span className="text-sm">{profile.workType ? profile.workType.charAt(0).toUpperCase() + profile.workType.slice(1) : "Not specified"}</span>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-500">Preferred Locations</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.preferredLocations.length > 0 ? (
                            profile.preferredLocations.map((loc) => (
                              <Badge key={loc} variant="secondary">{loc}</Badge>
                            ))
                          ) : (
                            <span className="text-sm text-slate-400">Not specified</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Track your career milestones and accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 border rounded-lg"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getAchievementIcon(achievement.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {achievement.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                          {achievement.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-slate-500">
                            {new Date(achievement.date).toLocaleDateString()}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {achievement.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-slate-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={profile.preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        setProfile((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            emailNotifications: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-slate-500">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={profile.preferences.smsNotifications}
                      onCheckedChange={(checked) =>
                        setProfile((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            smsNotifications: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="career-tips">Daily Career Tips</Label>
                      <p className="text-sm text-slate-500">
                        Receive daily career tips and motivation
                      </p>
                    </div>
                    <Switch
                      id="career-tips"
                      checked={profile.preferences.careerTips}
                      onCheckedChange={(checked) =>
                        setProfile((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            careerTips: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="goal-reminders">Goal Reminders</Label>
                      <p className="text-sm text-slate-500">
                        Receive reminders for your goals and habits
                      </p>
                    </div>
                    <Switch
                      id="goal-reminders"
                      checked={profile.preferences.goalReminders}
                      onCheckedChange={(checked) =>
                        setProfile((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            goalReminders: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control your profile visibility and data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-visibility">
                      Profile Visibility
                    </Label>
                    <Select
                      value={profile.preferences.profileVisibility}
                      onValueChange={(value: "public" | "private") =>
                        setProfile((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            profileVisibility: value,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          Public - Visible to everyone
                        </SelectItem>
                        <SelectItem value="private">
                          Private - Only visible to you
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                      Data Management
                    </h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportProfile}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Profile Data
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Changes Button (when editing) */}
        {isEditing && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              onClick={saveProfile}
              size="lg"
              className="bg-green-600 hover:bg-green-700 shadow-xl"
            >
              <Save className="w-5 h-5 mr-2" />
              Save All Changes
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Developed and Designed by{" "}
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                Sriram
              </span>
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
