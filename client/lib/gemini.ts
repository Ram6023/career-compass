import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        console.warn("Gemini API key not found. Using fallback responses.");
        return;
      }

      if (apiKey === "your_gemini_api_key_here") {
        console.warn("Please set your actual Gemini API key.");
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, 
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });
      
      this.isInitialized = true;
      console.log("Gemini AI initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Gemini AI:", error);
      this.isInitialized = false;
    }
  }

  async generateCareerResponse(userMessage: string, userContext?: any): Promise<{
    content: string;
    suggestions?: string[];
    type?: string;
    metadata?: any;
  }> {
    if (!this.isInitialized || !this.model) {
      return this.getFallbackResponse(userMessage);
    }

    try {
      const enhancedPrompt = this.buildCareerPrompt(userMessage, userContext);
      
      const result = await this.model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();

      return this.parseGeminiResponse(text, userMessage);
    } catch (error) {
      console.error("Gemini API error:", error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private buildCareerPrompt(userMessage: string, userContext?: any): string {
    const basePrompt = `You are an expert AI Career Strategist and advisor. You provide personalized, actionable career guidance focusing on:

CORE EXPERTISE:
- Career discovery and path planning
- Industry insights and salary trends
- Skill development roadmaps
- Interview preparation and job search strategies
- Career transitions and growth planning
- AI, Tech, Design, Business, and emerging career fields

RESPONSE STYLE:
- Professional yet conversational
- Use emojis strategically for visual appeal
- Provide specific, actionable advice
- Include current market data when relevant
- Format responses with clear structure using **bold headers**
- Always include 3-5 relevant follow-up suggestions

SPECIAL INSTRUCTIONS:
- For technical roles, include specific technologies and learning paths
- For salary queries, provide INR ranges for Indian market
- For career transitions, focus on transferable skills
- Always encourage continuous learning and growth
- Keep responses comprehensive but concise (under 800 words)

User's message: "${userMessage}"

${userContext ? `User context: ${JSON.stringify(userContext)}` : ''}

Provide a comprehensive response with actionable career advice:`;

    return basePrompt;
  }

  private parseGeminiResponse(text: string, originalMessage: string): {
    content: string;
    suggestions?: string[];
    type?: string;
    metadata?: any;
  } {
    // Generate contextual suggestions based on the response
    const suggestions = this.generateSuggestions(text, originalMessage);
    
    // Detect if this is about a specific career for metadata
    const metadata = this.extractCareerMetadata(text);
    
    return {
      content: text,
      suggestions,
      type: metadata ? 'career_card' : 'text',
      metadata
    };
  }

  private generateSuggestions(response: string, originalMessage: string): string[] {
    const message = originalMessage.toLowerCase();
    
    // Context-aware suggestions based on the conversation topic
    if (message.includes('ai') || message.includes('machine learning')) {
      return [
        "🤖 AI learning roadmap",
        "💻 Best AI programming languages", 
        "🎯 AI portfolio projects",
        "💰 AI salary expectations",
        "🏢 Top AI companies"
      ];
    }
    
    if (message.includes('salary') || message.includes('pay')) {
      return [
        "💰 Salary negotiation tips",
        "📈 Industry salary trends",
        "🎯 Skills for higher pay",
        "🏢 Best paying companies",
        "📊 Location salary comparison"
      ];
    }
    
    if (message.includes('interview') || message.includes('job search')) {
      return [
        "💻 Technical interview prep",
        "🗣️ Behavioral questions guide", 
        "📝 Resume optimization",
        "🔗 LinkedIn networking tips",
        "🎯 Job search strategy"
      ];
    }
    
    if (message.includes('career change') || message.includes('transition')) {
      return [
        "🔄 Career transition plan",
        "🎯 Transferable skills analysis",
        "📚 Upskilling roadmap",
        "💼 Industry research guide",
        "⏰ Timeline planning"
      ];
    }
    
    // Default suggestions
    return [
      "🎯 Find my ideal career",
      "📊 Industry trends 2024",
      "💰 Salary benchmarks",
      "📚 Learning roadmap",
      "🚀 Growth strategies"
    ];
  }

  private extractCareerMetadata(response: string): any {
    // Simple pattern matching to extract career information
    const salaryMatch = response.match(/₹[\d,-]+\s*(?:LPA|per annum|annually)/i);
    const growthMatch = response.match(/(\d+)%.*growth/i);
    
    if (salaryMatch || growthMatch) {
      return {
        salary: salaryMatch ? salaryMatch[0] : "Competitive",
        growth: growthMatch ? `${growthMatch[1]}% growth` : "High growth potential",
        difficulty: "Intermediate", // Default value
      };
    }
    
    return null;
  }

  private getFallbackResponse(userMessage: string): {
    content: string;
    suggestions?: string[];
    type?: string;
    metadata?: any;
  } {
    const message = userMessage.toLowerCase().trim();

    // Enhanced fallback responses
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      return {
        content: `👋 **Hello! Welcome to CareerCompass AI!**

I'm your personal AI Career Strategist, ready to help you navigate your professional journey with expert guidance and insights.

**🎯 How I can help you today:**
• **Career Discovery** - Find your ideal career path
• **Market Intelligence** - Get real-time salary and industry insights  
• **Learning Guidance** - Create personalized skill development roadmaps
• **Job Search Support** - Master interviews and optimize your applications
• **Career Growth** - Plan strategic career moves and transitions

*Note: For enhanced AI responses, please set your Gemini API key.*

What career goals would you like to explore together?`,
        suggestions: [
          "🎯 Discover my dream career",
          "💰 Show salary trends 2024", 
          "📚 Create learning roadmap",
          "💼 Interview preparation tips",
          "🔄 Plan career transition"
        ]
      };
    }

    return {
      content: `🤖 **AI Career Strategist Ready to Help!**

I'm here to provide expert career guidance, but I'm currently running on basic responses. 

**🚀 For the full AI experience:**
• Enhanced personalized career recommendations
• Real-time industry insights and analysis
• Advanced learning path generation
• Detailed salary and market intelligence

**🎯 I can still help you with:**
• Career exploration and planning
• Industry trends and insights
• Skill development guidance
• Interview preparation strategies
• Professional growth advice

What specific career topic would you like to explore?`,
      suggestions: [
        "🎯 Find career opportunities",
        "📊 Industry insights",
        "💡 Career advice",
        "📚 Skill development",
        "💼 Job search help"
      ]
    };
  }

  isGeminiAvailable(): boolean {
    return this.isInitialized && this.model !== null;
  }

  getStatus(): string {
    if (this.isInitialized) {
      return "🟢 Gemini AI Active";
    } else {
      return "🟡 Fallback Mode";
    }
  }
}

export const geminiService = new GeminiService();
