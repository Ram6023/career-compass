import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Home, Brain, Trophy, AlertTriangle, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const InterviewResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, config } = location.state || {}; // Add sessionData usage if needed later

    useEffect(() => {
        if (!result) {
            navigate("/assessment");
        }
    }, [result, navigate]);

    if (!result) return null;

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getProgressColor = (score: number) => {
        if (score >= 80) return "bg-emerald-500";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 print:bg-white">
            <div className="print:hidden">
                <Header />
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex justify-between items-center mb-8 print:hidden">
                    <div>
                        <h1 className="text-3xl font-bold font-orbitron text-gray-900 dark:text-gray-100">Performance Report</h1>
                        <p className="text-gray-500">Interview Session Analysis</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handlePrint} className="gap-2">
                            <Download className="w-4 h-4" /> Download PDF
                        </Button>
                        <Button onClick={() => navigate("/assessment")} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                            <RefreshCw className="w-4 h-4" /> Retake
                        </Button>
                    </div>
                </div>

                {/* Printable Header */}
                <div className="hidden print:block mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-2">Career Compass</h1>
                    <h2 className="text-2xl text-gray-600">Interview Performance Report</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Main Score Card */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="text-center shadow-lg border-emerald-100 dark:border-emerald-900">
                            <CardHeader>
                                <CardTitle className="text-xl">Overall Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative flex items-center justify-center">
                                    <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
                                        {result.overallScore}
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-gray-500 font-medium">{result.summary}</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" /> Topic Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Communication</span>
                                        <span className="font-bold">{result.communicationScore}%</span>
                                    </div>
                                    <Progress value={result.communicationScore} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Technical</span>
                                        <span className="font-bold">{result.technicalScore}%</span>
                                    </div>
                                    <Progress value={result.technicalScore} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Confidence</span>
                                        <span className="font-bold">{result.confidenceScore}%</span>
                                    </div>
                                    <Progress value={result.confidenceScore} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Feedback */}
                    <div className="md:col-span-2 space-y-6">

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-emerald-600" /> Key Strengths
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {result.strengths.map((str: string, index: number) => (
                                        <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 px-3 py-1 text-sm">
                                            {str}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <AlertTriangle className="w-5 h-5" /> Areas for Improvement
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                    {result.areasForImprovement.map((area: string, index: number) => (
                                        <li key={index}>{area}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-600">
                                    <BookOpen className="w-5 h-5" /> Recommended Resources
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {result.suggestedResources.map((res: string, index: number) => (
                                        <div key={index} className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                            <div className="mt-1 bg-blue-500 rounded-full w-2 h-2"></div>
                                            <p className="text-sm">{res}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end pt-4 print:hidden">
                            <Button variant="ghost" className="gap-2" onClick={() => navigate("/")}>
                                <Home className="w-4 h-4" /> Back to Dashboard
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewResult;
