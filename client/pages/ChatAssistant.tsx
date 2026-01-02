import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Mic,
  Copy,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Zap,
  Briefcase,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { authService } from "@/lib/auth";
import { geminiService } from "@/lib/gemini";
import { toast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
  type?: "text" | "quick_reply" | "career_card" | "learning_path";
  metadata?: any;
}

export default function ChatAssistant() {
  const [user] = useState(authService.getCurrentUser());
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello ${user?.firstName || "there"}! I'm **Nova**, your AI Career Strategist.\n\nI can help you analyze career paths, estimate salaries, and build personalized learning roadmaps.\n\n*What's on your mind today?*`,
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "Explore potential careers",
        "Salary trends for 2024",
        "Review my resume skills",
        "Interview preparation"
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (location.state?.initialMessage) {
      handleSendMessage(location.state.initialMessage);
      // Clear state to prevent re-sending on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSendMessage = async (text?: string) => {
    const messageContent = text || inputMessage;
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate thinking delay for realism
    const thinkingTime = Math.random() * 1000 + 800; // 0.8s - 1.8s
    await new Promise((resolve) => setTimeout(resolve, thinkingTime));

    const response = await geminiService.generateCareerResponse(userMessage.content, {
      user: user,
      conversationHistory: messages.slice(-3),
    });

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: response.content,
      sender: "bot",
      timestamp: new Date(),
      suggestions: response.suggestions,
      type: (response.type as Message["type"]) || "text",
      metadata: response.metadata,
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
    if (inputRef.current) inputRef.current.focus();
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
      title: "Copied",
      description: "Message copied to clipboard",
      duration: 1500,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#0B1120] overflow-hidden font-sans">
      <Header pageSubtitle="Nova AI Strategist" />

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "flex max-w-[90%] sm:max-w-[80%] gap-4",
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  {message.sender === "bot" ? (
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                      {message.sender === "bot" ? "Nova AI" : "You"}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "relative rounded-3xl p-5 shadow-sm overflow-hidden text-sm leading-relaxed",
                      message.sender === "user"
                        ? "bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-tr-md"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800 rounded-tl-md"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {/* Metadata Card (for Career Profiles) */}
                    {message.type === "career_card" && message.metadata && (
                      <div className="mt-4 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-indigo-500" />
                            {message.metadata.title}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="text-xs text-slate-500 mb-1">Salary Range</div>
                            <div className="font-semibold text-emerald-600 dark:text-emerald-400">{message.metadata.salary}</div>
                          </div>
                          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="text-xs text-slate-500 mb-1">Growth</div>
                            <div className="font-semibold text-indigo-600 dark:text-indigo-400">{message.metadata.growth}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Learning Path Type */}
                    {message.type === "learning_path" && (
                      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <div className="text-xs text-indigo-800 dark:text-indigo-200">
                          <strong>Pro Tip:</strong> Break this roadmap down into weekly sprints for better retention.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions / Suggestions */}
                  {message.sender === "bot" && (
                    <div className="flex flex-col gap-3 mt-1">
                      {/* Suggestion Chips */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestion(suggestion)}
                              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-slate-600 dark:text-slate-300"
                            >
                              <Zap className="h-3 w-3" />
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Message Actions */}
                      <div className="flex items-center gap-2 px-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          onClick={() => copyMessage(message.content)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-[80%] gap-4">
                <div className="h-10 w-10 flex-shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex space-x-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-3 rounded-2xl rounded-tl-md">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent dark:from-[#0B1120] dark:via-[#0B1120] dark:to-transparent pt-10 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-3 bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-700/50 ring-1 ring-slate-100 dark:ring-slate-800">

            {/* Left Actions */}
            <div className="flex pb-2 pl-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                title="Upload context (coming soon)"
              >
                <Sparkles className="h-5 w-5" />
              </Button>
            </div>

            {/* Text Area */}
            <Textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything about your career journey..."
              className="min-h-[50px] max-h-[200px] border-0 focus-visible:ring-0 bg-transparent resize-none py-3.5 text-base text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              rows={1}
            />

            {/* Right Actions */}
            <div className="flex gap-2 pb-2 pr-2">
              {/* Mic Button - Visual only for this iteration unless reusing logic */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full transition-all",
                  isRecording
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:text-slate-400"
                )}
                onClick={() => setIsRecording(prev => !prev)}
              >
                <Mic className="h-5 w-5" />
              </Button>

              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className={cn(
                  "h-10 w-10 rounded-full p-0 shadow-lg transition-all duration-300",
                  !inputMessage.trim()
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 active:scale-95"
                )}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest font-medium">
              Powered by Gemini AI • Strategy Engine v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
