import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { extractTextFromPDF } from "@/lib/utils";
import { Brain, Mic, MessageSquare, Briefcase, Code, Award, Sliders, Upload, Loader2 } from "lucide-react";

const AssessmentSetup = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState({
        experienceLevel: "fresher",
        interviewTypes: [] as string[],
        topics: [] as string[],
        difficulty: "medium",
        questionCount: "5",
        mode: "text",
        useResume: false,
        resumeText: "",
    });
    const [isProcessingResume, setIsProcessingResume] = useState(false);

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsProcessingResume(true);
            try {
                const text = await extractTextFromPDF(file);
                setConfig(prev => ({ ...prev, resumeText: text }));
            } catch (error) {
                console.error("Failed to parse PDF", error);
                alert("Failed to read PDF. Please try another file.");
            } finally {
                setIsProcessingResume(false);
            }
        }
    };

    const handleTypeChange = (type: string) => {
        setConfig((prev) => {
            const types = prev.interviewTypes.includes(type)
                ? prev.interviewTypes.filter((t) => t !== type)
                : [...prev.interviewTypes, type];
            return { ...prev, interviewTypes: types };
        });
    };

    const handleTopicChange = (topic: string) => {
        setConfig((prev) => {
            const topics = prev.topics.includes(topic)
                ? prev.topics.filter((t) => t !== topic)
                : [...prev.topics, topic];
            return { ...prev, topics };
        });
    };

    const handleStart = () => {
        if (config.interviewTypes.length === 0) {
            alert("Please select at least one interview type.");
            return;
        }
        if (config.topics.length === 0) {
            alert("Please select at least one topic.");
            return;
        }
        navigate("/interview/session", { state: { config } });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            Mock Interview Setup
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Customize your AI interview session to match your career goals.
                        </p>
                    </div>

                    <Card className="border-emerald-100 dark:border-emerald-900 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sliders className="w-5 h-5 text-emerald-600" />
                                Configuration
                            </CardTitle>
                            <CardDescription>
                                Select your preferences for the interview simulation.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">

                            {/* Experience Level */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">1. Experience Level</Label>
                                <RadioGroup
                                    defaultValue="fresher"
                                    value={config.experienceLevel}
                                    onValueChange={(val) => setConfig({ ...config, experienceLevel: val })}
                                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                >
                                    {["fresher", "0-2 years", "2-5 years", "5+ years"].map((level) => (
                                        <div key={level}>
                                            <RadioGroupItem value={level} id={level} className="peer sr-only" />
                                            <Label
                                                htmlFor={level}
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500 cursor-pointer text-center capitalize"
                                            >
                                                <Award className="mb-2 h-6 w-6 text-gray-500 peer-data-[state=checked]:text-emerald-500" />
                                                {level}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <Separator />

                            {/* Interview Type */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">2. Interview Type (Select multiple)</Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {["Technical", "HR", "Behavioral"].map((type) => (
                                        <div key={type} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <Checkbox
                                                id={`type-${type}`}
                                                checked={config.interviewTypes.includes(type)}
                                                onCheckedChange={() => handleTypeChange(type)}
                                            />
                                            <Label htmlFor={`type-${type}`} className="flex-1 cursor-pointer font-medium">
                                                {type} Interview
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Topics */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">3. Topics / Domain</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {[
                                        "Data Structures & Algo",
                                        "Web Development",
                                        "AI / Machine Learning",
                                        "Data Science",
                                        "Cloud / DevOps",
                                        "System Design",
                                        "General Aptitude",
                                        "Cybersecurity",
                                        "Mobile Development",
                                        "Blockchain",
                                        "Project Management",
                                        "Quality Assurance",
                                        "Database Management",
                                        "Network Engineering",
                                        "UI/UX Design"
                                    ].map((topic) => (
                                        <div key={topic} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`topic-${topic}`}
                                                checked={config.topics.includes(topic)}
                                                onCheckedChange={() => handleTopicChange(topic)}
                                            />
                                            <Label htmlFor={`topic-${topic}`} className="cursor-pointer text-sm">
                                                {topic}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Difficulty & Count */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">4. Difficulty Level</Label>
                                    <Select
                                        value={config.difficulty}
                                        onValueChange={(val) => setConfig({ ...config, difficulty: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                            <SelectItem value="auto">Auto (Adaptive)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">5. Question Count</Label>
                                    <Select
                                        value={config.questionCount}
                                        onValueChange={(val) => setConfig({ ...config, questionCount: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select count" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5 Questions</SelectItem>
                                            <SelectItem value="10">10 Questions</SelectItem>
                                            <SelectItem value="15">15 Questions</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            {/* Mode & Context */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">6. Interview Mode</Label>
                                    <RadioGroup
                                        value={config.mode}
                                        onValueChange={(val) => setConfig({ ...config, mode: val })}
                                        className="flex space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="text" id="mode-text" />
                                            <Label htmlFor="mode-text" className="flex items-center gap-2 cursor-pointer">
                                                <MessageSquare className="w-4 h-4" /> Text
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="voice" id="mode-voice" />
                                            <Label htmlFor="mode-voice" className="flex items-center gap-2 cursor-pointer">
                                                <Mic className="w-4 h-4" /> Voice
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base font-semibold">7. Resume Context</Label>
                                            <p className="text-xs text-gray-500">Use your profile resume for personalized Q&A</p>
                                        </div>
                                        <Switch
                                            checked={config.useResume}
                                            onCheckedChange={(checked) => setConfig({ ...config, useResume: checked })}
                                        />
                                    </div>
                                    {config.useResume && (
                                        <div className="mt-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <label className="flex flex-col items-center justify-center cursor-pointer w-full">
                                                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">Click to upload resume</span> (PDF)
                                                    </p>
                                                    {config.resumeText && (
                                                        <div className="flex items-center text-xs text-emerald-600 font-medium mt-2 bg-emerald-50 px-2 py-1 rounded">
                                                            <Award className="w-3 h-3 mr-1" /> Resume Processed
                                                        </div>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf"
                                                    onChange={handleResumeUpload}
                                                    disabled={isProcessingResume}
                                                />
                                            </label>
                                            {isProcessingResume && (
                                                <div className="text-center text-sm text-blue-500 flex items-center justify-center mt-2">
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    Processing...
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>


                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleStart}
                                className="w-full h-12 text-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg text-white font-bold"
                            >
                                <Brain className="mr-2 h-5 w-5" />
                                Start AI Assessment
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AssessmentSetup;
