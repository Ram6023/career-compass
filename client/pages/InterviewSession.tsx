import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Send, Bot, User, Loader2, StopCircle } from "lucide-react";
import { geminiService } from "@/lib/gemini";
import { useToast } from "@/components/ui/use-toast";

const InterviewSession = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const config = location.state?.config;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [userAnswer, setUserAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Redirect if no config
    useEffect(() => {
        if (!config) {
            navigate("/assessment");
        }
    }, [config, navigate]);

    // Initial Question Load
    useEffect(() => {
        if (config && questions.length === 0) {
            loadNextQuestion([]);
        }
    }, [config]);

    const loadNextQuestion = async (history: { question: string; answer: string }[]) => {
        setIsLoading(true);
        try {
            const question = await geminiService.generateInterviewQuestion(config, history);
            setQuestions((prev) => [...prev, question]);
        } catch (error) {
            toast({
                title: "Error generating question",
                description: "Please try refreshing the page.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = async () => {
        if (!userAnswer.trim()) return;

        const newAnswers = [...answers, userAnswer];
        setAnswers(newAnswers);
        setUserAnswer("");

        const totalQuestions = parseInt(config.questionCount);

        // Check if interview is complete
        if (currentQuestionIndex + 1 >= totalQuestions) {
            finishInterview(newAnswers);
        } else {
            // Prepare history for next question
            const history = questions.map((q, i) => ({
                question: q,
                answer: newAnswers[i] || "" // Should be newAnswers[i] but strictly it's the current one we just added
            }));
            // Wait actually, questions has current question. newAnswers has current answer.
            // So history is correctly built from pairing them.

            setCurrentQuestionIndex((prev) => prev + 1);
            await loadNextQuestion(history);
        }
    };

    const finishInterview = async (finalAnswers: string[]) => {
        setIsLoading(true);
        try {
            const sessionData = questions.map((q, i) => ({
                question: q,
                answer: finalAnswers[i]
            }));

            const result = await geminiService.generateInterviewReport(sessionData, config);

            navigate("/interview/result", {
                state: {
                    result,
                    config,
                    sessionData
                }
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error generating results",
                description: error instanceof Error ? error.message : "Failed to generate clear results. Please try again.",
                variant: "destructive",
            });
            // Do NOT navigate to result on error, so user can try again
        } finally {
            setIsLoading(false);
        }
    };

    // Voice Recognition Logic
    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            startRecording();
        }
    };

    const startRecording = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setUserAnswer((prev) => prev + " " + finalTranscript);
                }
            };

            recognitionRef.current.start();
            setIsRecording(true);
        } else {
            alert("Speech recognition is not supported in this browser.");
        }
    };

    if (!config) return null;

    const progress = ((currentQuestionIndex) / parseInt(config.questionCount)) * 100;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Header & Progress */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                Interview Session
                            </h1>
                            <span className="text-sm font-medium text-gray-500">
                                Question {currentQuestionIndex + 1} of {config.questionCount}
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    {/* AI Question Area */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-6 h-6 text-blue-600" />
                        </div>
                        <Card className="flex-1 border-blue-100 dark:border-blue-900 shadow-md">
                            <CardContent className="p-6">
                                {questions[currentQuestionIndex] ? (
                                    <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                                        {questions[currentQuestionIndex]}
                                    </p>
                                ) : (
                                    <div className="flex items-center space-x-2 text-gray-500">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>AI is thinking...</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* User Answer Area */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <Textarea
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Type your answer here... or use the microphone to speak."
                                className="min-h-[150px] text-lg p-4 border-gray-300 dark:border-gray-700 focus:ring-emerald-500"
                            />

                            <div className="flex justify-between items-center">
                                <Button
                                    variant={isRecording ? "destructive" : "secondary"}
                                    onClick={toggleRecording}
                                    className="gap-2"
                                >
                                    {isRecording ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                    {isRecording ? "Stop Recording" : "Voice Input"}
                                </Button>

                                <Button
                                    onClick={handleNext}
                                    disabled={isLoading || !userAnswer.trim()}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    {currentQuestionIndex + 1 >= parseInt(config.questionCount) ? "Finish Interview" : "Next Question"}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InterviewSession;
