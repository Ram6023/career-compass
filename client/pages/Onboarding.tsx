import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { User, Upload, X, Check, ArrowRight, GraduationCap, Briefcase, Sparkles } from "lucide-react";

interface OnboardingData {
  firstName: string;
  lastName: string;
  education: string;
  college: string;
  yearOfStudy: string;
  careerInterests: string[];
  skills: string[];
  profileImageUrl: string | null;
}

const CAREER_INTERESTS = [
  "Software Engineering",
  "Data Science",
  "Product Management",
  "Design",
  "Marketing",
  "Finance",
  "Sales",
  "Operations",
  "Human Resources",
  "Consulting",
  "Entrepreneurship",
  "Research",
  "Content Creation",
  "Cybersecurity",
  "DevOps",
  "AI/Machine Learning",
  "Blockchain",
  "UX/UI",
  "Business Analytics",
  "Project Management"
];

const SKILLS_OPTIONS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "React", "Vue.js", "Angular",
  "Node.js", "Express", "Django", "Flask", "SQL", "MongoDB", "PostgreSQL", "AWS",
  "Docker", "Kubernetes", "Git", "Agile", "Scrum", "Figma", "Adobe Creative Suite",
  "Excel", "Tableau", "Power BI", "Communication", "Leadership", "Problem Solving",
  "Critical Thinking", "Teamwork", "Time Management", "Adaptability"
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    education: "",
    college: "",
    yearOfStudy: "",
    careerInterests: [],
    skills: [],
    profileImageUrl: null
  });
  const [newInterest, setNewInterest] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate("/login");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          navigate("/login");
          return;
        }

        setUserData(profile);

        // Pre-fill first name from Google display name
        if (profile.name) {
          const firstName = profile.name.split(" ")[0];
          setOnboardingData(prev => ({
            ...prev,
            firstName,
            profileImageUrl: profile.avatar_url || null
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCareerInterest = (interest: string) => {
    if (interest && !onboardingData.careerInterests.includes(interest)) {
      setOnboardingData(prev => ({
        ...prev,
        careerInterests: [...prev.careerInterests, interest]
      }));
    }
  };

  const removeCareerInterest = (interest: string) => {
    setOnboardingData(prev => ({
      ...prev,
      careerInterests: prev.careerInterests.filter(i => i !== interest)
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !onboardingData.skills.includes(skill)) {
      setOnboardingData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setOnboardingData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For now, we'll just show a preview - in a real app, you'd upload to storage
    const reader = new FileReader();
    reader.onload = (e) => {
      setOnboardingData(prev => ({
        ...prev,
        profileImageUrl: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setOnboardingData(prev => ({
      ...prev,
      profileImageUrl: null
    }));
  };

  const saveProfile = async () => {
    if (!userData) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: onboardingData.firstName,
          last_name: onboardingData.lastName,
          education: onboardingData.education,
          college: onboardingData.college,
          skills: onboardingData.skills,
          interests: onboardingData.careerInterests,
          updated_at: new Date().toISOString()
        })
        .eq("id", userData.id);

      if (error) throw error;

      toast({
        title: "Profile Updated!",
        description: "Your profile has been successfully set up.",
      });

      // Redirect to dashboard
      navigate("/home");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 4) * 100;

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Welcome to CareerCompass, {onboardingData.firstName || userData.email.split("@")[0]}!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Let's set up your profile to get personalized career recommendations
            </p>
          </div>

          <Card className="shadow-xl border-indigo-200/50 dark:border-indigo-700/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg">
            <CardHeader>
              <div className="mb-4">
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-2">
                  <span>Step {step} of 4</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {step === 1 && "Personal Information"}
                {step === 2 && "Education Details"}
                {step === 3 && "Career Interests"}
                {step === 4 && "Skills & Expertise"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Tell us about yourself"}
                {step === 2 && "Share your educational background"}
                {step === 3 && "What career paths interest you?"}
                {step === 4 && "What skills do you have?"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
                        {onboardingData.profileImageUrl ? (
                          <img 
                            src={onboardingData.profileImageUrl} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-white" />
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full w-8 h-8 p-0"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-3 h-3" />
                      </Button>
                      {onboardingData.profileImageUrl && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                          onClick={removeProfileImage}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      Profile picture (optional)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={onboardingData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={onboardingData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="education">Degree / Education *</Label>
                    <Input
                      id="education"
                      value={onboardingData.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      placeholder="e.g., Bachelor of Science in Computer Science"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="college">College / University *</Label>
                    <Input
                      id="college"
                      value={onboardingData.college}
                      onChange={(e) => handleInputChange("college", e.target.value)}
                      placeholder="e.g., Stanford University"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="yearOfStudy">Year of Study *</Label>
                    <Select 
                      value={onboardingData.yearOfStudy} 
                      onValueChange={(value) => handleInputChange("yearOfStudy", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your year of study" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                        <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Add Career Interests</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {CAREER_INTERESTS.slice(0, 10).map((interest) => (
                        <Badge
                          key={interest}
                          variant={onboardingData.careerInterests.includes(interest) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900"
                          onClick={() => {
                            if (onboardingData.careerInterests.includes(interest)) {
                              removeCareerInterest(interest);
                            } else {
                              addCareerInterest(interest);
                            }
                          }}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add your own interest"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && newInterest.trim()) {
                            addCareerInterest(newInterest.trim());
                            setNewInterest("");
                          }
                        }}
                      />
                      <Button 
                        onClick={() => {
                          if (newInterest.trim()) {
                            addCareerInterest(newInterest.trim());
                            setNewInterest("");
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  {onboardingData.careerInterests.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Interests</Label>
                      <div className="flex flex-wrap gap-2">
                        {onboardingData.careerInterests.map((interest) => (
                          <Badge key={interest} variant="default" className="pr-1">
                            {interest}
                            <button
                              onClick={() => removeCareerInterest(interest)}
                              className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Add Your Skills</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {SKILLS_OPTIONS.slice(0, 12).map((skill) => (
                        <Badge
                          key={skill}
                          variant={onboardingData.skills.includes(skill) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900"
                          onClick={() => {
                            if (onboardingData.skills.includes(skill)) {
                              removeSkill(skill);
                            } else {
                              addSkill(skill);
                            }
                          }}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add your own skill"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && newSkill.trim()) {
                            addSkill(newSkill.trim());
                            setNewSkill("");
                          }
                        }}
                      />
                      <Button 
                        onClick={() => {
                          if (newSkill.trim()) {
                            addSkill(newSkill.trim());
                            setNewSkill("");
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  {onboardingData.skills.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {onboardingData.skills.map((skill) => (
                          <Badge key={skill} variant="default" className="pr-1">
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  Back
                </Button>
                
                {step < 4 ? (
                  <Button onClick={handleNext}>
                    Next <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={saveProfile} 
                    disabled={
                      loading || 
                      !onboardingData.firstName || 
                      !onboardingData.lastName ||
                      !onboardingData.education ||
                      !onboardingData.college ||
                      !onboardingData.yearOfStudy
                    }
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 w-4 h-4" /> Complete Setup
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            <p>We'll use this information to provide personalized career recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}