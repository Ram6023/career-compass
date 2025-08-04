import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Clock
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

const QUICK_QUESTIONS = [
  "What career is best for me?",
  "How do I become a software engineer?",
  "What skills should I learn for data science?",
  "How much do UX designers earn?",
  "What are the fastest growing careers?",
  "How to switch careers at 30?"
];

const CAREER_TOPICS = [
  { icon: Briefcase, title: "Career Exploration", description: "Discover new career paths" },
  { icon: TrendingUp, title: "Skill Development", description: "Learn what skills to build" },
  { icon: GraduationCap, title: "Education Planning", description: "Plan your learning journey" },
  { icon: Target, title: "Goal Setting", description: "Set achievable career goals" }
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI Career Assistant. I'm here to help you with career guidance, skill development, job market insights, and more. What would you like to know about your career journey?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Help me choose a career path",
        "What skills are in demand?",
        "How to prepare for interviews?",
        "Salary expectations for my field"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('career') && lowerMessage.includes('best')) {
      return "Great question! To recommend the best career for you, I'd need to know more about your interests, skills, and academic background. Here are some questions to consider:\n\n• What subjects do you enjoy most?\n• What are your strongest skills?\n• Do you prefer working with people, data, or creative projects?\n• What's your educational background?\n\nWould you like to take our comprehensive career assessment for personalized recommendations?";
    }
    
    if (lowerMessage.includes('software engineer') || lowerMessage.includes('programming')) {
      return "Becoming a software engineer is an excellent career choice! Here's a roadmap:\n\n**Essential Skills:**\n• Programming languages (Python, JavaScript, Java)\n• Problem-solving and logical thinking\n• Version control (Git)\n• Database knowledge\n\n**Learning Path:**\n1. Start with programming fundamentals (3-6 months)\n2. Build projects and create a portfolio\n3. Learn frameworks and tools\n4. Practice coding interviews\n\n**Timeline:** 6-12 months of dedicated learning\n**Salary Range:** ₹5-20 LPA for beginners\n\nWould you like specific course recommendations?";
    }
    
    if (lowerMessage.includes('data science') || lowerMessage.includes('data scientist')) {
      return "Data Science is one of the hottest fields! Here's what you need to know:\n\n**Core Skills:**\n• Python/R programming\n• Statistics and mathematics\n• Machine learning\n• Data visualization\n• SQL databases\n\n**Learning Path:**\n1. Mathematics & Statistics foundation\n2. Python programming for data analysis\n3. Machine learning algorithms\n4. Work on real-world projects\n\n**Tools to Master:**\n• Pandas, NumPy, Scikit-learn\n• Tableau/Power BI for visualization\n• Jupyter notebooks\n\n**Expected Salary:** ₹8-25 LPA\n\nInterested in a detailed roadmap?";
    }
    
    if (lowerMessage.includes('ux') || lowerMessage.includes('ui') || lowerMessage.includes('design')) {
      return "UX/UI Design is a creative and rewarding field! Here's the breakdown:\n\n**Key Skills:**\n• User research and empathy\n• Wireframing and prototyping\n• Visual design principles\n• Design tools (Figma, Adobe Creative Suite)\n• Usability testing\n\n**Typical Salary:**\n• Entry level: ₹4-8 LPA\n• Mid level: ₹8-15 LPA\n• Senior level: ₹15-25 LPA\n\n**Portfolio Requirements:**\n• 3-5 case studies\n• Show your design process\n• Include before/after examples\n\nWant help building your design portfolio?";
    }
    
    if (lowerMessage.includes('salary') || lowerMessage.includes('earn') || lowerMessage.includes('pay')) {
      return "Salary expectations vary by role, experience, and location. Here are some average ranges in India:\n\n**Tech Roles:**\n• Software Engineer: ₹5-20 LPA\n• Data Scientist: ₹8-25 LPA\n• Product Manager: ₹10-30 LPA\n\n**Design Roles:**\n• UX Designer: ₹4-15 LPA\n• Graphic Designer: ₹3-8 LPA\n\n**Business Roles:**\n• Business Analyst: ₹6-18 LPA\n• Digital Marketing: ₹3-12 LPA\n\n**Factors affecting salary:**\n• Company size and type\n• Location (Bangalore, Mumbai pay more)\n• Skills and certifications\n• Experience level\n\nWhich specific role interests you?";
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
      return "Skills in high demand right now:\n\n**Technical Skills:**\n• Cloud computing (AWS, Azure)\n• Artificial Intelligence & Machine Learning\n• Cybersecurity\n• Mobile development\n• Data analysis\n\n**Soft Skills:**\n• Digital marketing\n• Project management\n• Communication\n• Leadership\n• Adaptability\n\n**Emerging Areas:**\n• Blockchain technology\n• IoT development\n• AR/VR development\n• Sustainable technology\n\n**Learning Tips:**\n• Focus on 2-3 skills at a time\n• Build projects to practice\n• Get certified\n• Join communities\n\nWhich area would you like to explore further?";
    }
    
    // Default response
    return "I understand you're looking for career guidance! I can help you with:\n\n• Career path recommendations\n• Skill development strategies\n• Salary and market insights\n• Learning roadmaps\n• Interview preparation\n• Industry trends\n\nCould you tell me more specifically what you'd like to know? For example, are you looking to:\n- Explore new career options?\n- Develop specific skills?\n- Understand market demands?\n- Plan your learning journey?";
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

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: generateBotResponse(inputMessage),
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Tell me more about this",
        "What courses do you recommend?",
        "How long will it take?",
        "What's the job market like?"
      ]
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    inputRef.current?.focus();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md dark:bg-gray-900/90 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  CareerCompass
                </h1>
                <p className="text-xs text-gray-500">AI Career Assistant</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Home</Link>
              <Link to="/careers" className="text-gray-600 hover:text-indigo-600 transition-colors">Explore Careers</Link>
              <Link to="/resume-analyzer" className="text-gray-600 hover:text-indigo-600 transition-colors">Resume Analyzer</Link>
              <Link to="/roadmaps" className="text-gray-600 hover:text-indigo-600 transition-colors">Career Roadmaps</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span>Quick Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {QUICK_QUESTIONS.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full text-left justify-start h-auto p-3 text-sm"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Career Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <BookOpen className="h-5 w-5 text-indigo-500" />
                  <span>Popular Topics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {CAREER_TOPICS.map((topic, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <topic.icon className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{topic.title}</h4>
                        <p className="text-xs text-gray-600">{topic.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border-b">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">AI Career Assistant</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Online • Ready to help</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className="flex items-start space-x-3">
                          {message.sender === 'bot' && (
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex-shrink-0">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <div className={`rounded-2xl p-4 ${
                            message.sender === 'user' 
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <div className="whitespace-pre-line text-sm leading-relaxed">
                              {message.content}
                            </div>
                            <div className={`text-xs mt-2 ${
                              message.sender === 'user' ? 'text-indigo-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          {message.sender === 'user' && (
                            <div className="p-2 bg-gray-200 rounded-full flex-shrink-0">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        
                        {/* Suggestions */}
                        {message.sender === 'bot' && message.suggestions && (
                          <div className="mt-3 ml-12 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-7"
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
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-gray-100 rounded-2xl p-4">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex space-x-3">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about careers, skills, salaries..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Press Enter to send</span>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Powered by AI</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
