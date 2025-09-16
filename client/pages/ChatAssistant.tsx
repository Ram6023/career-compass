import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Mic, Copy, Sparkles } from "lucide-react";
import { authService } from "@/lib/auth";
import { geminiService } from "@/lib/gemini";
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

export default function ChatAssistant() {
  const [user] = useState(authService.getCurrentUser());

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello ${user?.firstName || "there"}! 👋 \n\nI'm your **AI Career Strategist** - your personal guide to navigating the future of work. \n\n✨ **What I can help you with:**\n• Discover your ideal career path\n• Get real-time salary insights  \n• Create personalized learning roadmaps\n• Stay ahead of industry trends\n• Master interview strategies\n\nLet's unlock your potential together! What career goals are you exploring today?`,
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        try {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        } catch (e) {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
              messagesContainerRef.current.scrollHeight;
          }
        }
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages]);

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

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const thinkingTime = Math.random() * 2000 + 1500;
    await new Promise((resolve) => setTimeout(resolve, thinkingTime));

    const response = await geminiService.generateCareerResponse(inputMessage, {
      user: user,
      conversationHistory: messages.slice(-5),
    });
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

      <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-4 lg:py-6 max-w-6xl">
        <Card className="h-[calc(100vh-60px)] flex flex-col shadow-2xl border-0 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          {/* Messages */}
          <div className="flex-1 relative overflow-hidden">
            <div
              className="h-full overflow-y-auto scroll-smooth"
              ref={messagesContainerRef}
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              <div className="p-2 sm:p-4 lg:p-6 space-y-4 lg:space-y-6 min-h-full">
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
                      className={`max-w-[90%] sm:max-w-[85%] lg:max-w-[80%] ${
                        message.sender === "user" ? "order-2" : "order-1"
                      }`}
                    >
                      <div className="flex items-start space-x-2 lg:space-x-3">
                        {message.sender === "bot" && (
                          <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-emerald-500/30">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 text-white text-xs font-bold">
                              AI
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`rounded-2xl p-3 sm:p-4 lg:p-5 shadow-lg backdrop-blur-sm overflow-hidden ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white shadow-emerald-500/25"
                              : "bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-slate-100 border border-emerald-100/50 dark:border-emerald-800/50"
                          }`}
                        >
                          <div className="whitespace-pre-line text-sm leading-relaxed break-words overflow-wrap-anywhere">
                            {message.content}
                          </div>

                          {message.type === "career_card" &&
                            message.metadata && (
                              <div className="mt-4 p-4 bg-emerald-50/80 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
                                  ? "text-emerald-100"
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
                                  onClick={() => copyMessage(message.content)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {message.sender === "user" && (
                          <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-emerald-200 dark:ring-emerald-700">
                            <AvatarFallback className="bg-emerald-200 dark:bg-emerald-700 text-emerald-700 dark:text-emerald-300">
                              {user?.firstName?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      {message.sender === "bot" && message.suggestions && (
                        <div className="mt-4 ml-0 lg:ml-12 flex flex-wrap gap-2 max-w-full">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-9 bg-white/95 dark:bg-slate-800/95 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-xl backdrop-blur-sm transition-all duration-200"
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

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-9 w-9 ring-2 ring-emerald-500/30">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 text-white text-xs font-bold">
                          AI
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white/95 dark:bg-slate-800/95 rounded-2xl p-4 shadow-lg border border-emerald-100/50 dark:border-emerald-800/50 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
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

          {/* Input */}
          <div className="p-3 sm:p-4 lg:p-6 border-t border-emerald-200/30 dark:border-emerald-700/30 bg-emerald-50/50 dark:bg-emerald-950/30 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4 items-stretch lg:items-end w-full">
              <div className="flex-1 space-y-2">
                <Textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about careers, skills, salaries, or job market trends..."
                  className="min-h-[50px] lg:min-h-[60px] max-h-[120px] resize-none bg-white/95 dark:bg-slate-700/95 border-emerald-300/50 dark:border-emerald-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 w-full"
                  disabled={isTyping}
                />
              </div>
              <div className="flex flex-row space-x-2 justify-end lg:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 lg:h-12 w-10 lg:w-12 p-0 border-emerald-300/50 dark:border-emerald-600/50 rounded-xl backdrop-blur-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200"
                  disabled={isTyping}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="h-10 lg:h-12 px-4 lg:px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-700 shadow-lg rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-3 space-y-1 lg:space-y-0 text-xs text-slate-500 dark:text-slate-400">
              <span>Press Enter to send • Shift + Enter for new line</span>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-3 w-3" />
                <span>Powered by Gemini AI</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
