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
      console.log("Gemini AI initialized successfully with model: gemini-1.5-flash");
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

    // 1. Check for salary/income related queries
    if (message.includes('salary') || message.includes('pay') || message.includes('earn') || message.includes('money')) {
      // Specialized response for Data Scientist salary as it is a common query
      if (message.includes('data scien')) {
        return {
          content: `💰 **Salary Insights: Data Scientist**

Data Science is one of the highest-paying fields in tech right now.

**Indian Market Benchmarks:**
• **Entry Level (0-2 yrs):** ₹6 - 12 LPA
• **Mid Level (3-5 yrs):** ₹15 - 25 LPA
• **Senior Level (5+ yrs):** ₹30 - 50+ LPA

*Top product-based companies (Google, Microsoft, Amazon) often offer packages exceeding ₹40 LPA including stock options.*

**Factors affecting pay:**
1. **Skills:** NLP, Deep Learning, and MLOps command higher premiums.
2. **Location:** Bangalore and Hyderabad typically pay 20-30% more than other cities.`,
          suggestions: ["Data Scientist Roadmap", "Required Skills", "Interview Prep"],
          type: 'text'
        };
      }

      return {
        content: `💰 **Salary Insights & Trends**

Salary expectations vary significantly based on role, location, and experience. Here are some general benchmarks for the Indian market:

**Tech Roles:**
• **Software Engineer:** ₹6-30+ LPA (Entry to Senior)
• **Data Scientist:** ₹8-35+ LPA
• **Product Manager:** ₹15-50+ LPA

**Creative & Design:**
• **UI/UX Designer:** ₹6-25+ LPA
• **Graphic Designer:** ₹4-12 LPA

**Business & Management:**
• **Business Analyst:** ₹7-20 LPA
• **Digital Marketer:** ₹5-18 LPA

*Note: These are estimated ranges. Top product companies often pay significantly higher.*

Would you like details on a specific role?`,
        suggestions: ["Salary for Data Scientist", "High paying non-tech jobs", "Negotiation tips"],
        type: 'text'
      };
    }

    // 2. Check for learning paths / roadmaps
    if (message.includes('roadmap') || message.includes('learn') || message.includes('start') || message.includes('study') || message.includes('guide')) {
      return {
        content: `🗺️ **Learning Roadmap Guide**

To build a personalized learning roadmap, I need to know your target role. However, here is a general framework for success:

**Phase 1: Foundations (1-2 months)**
• Master the core principles
• Learn standard tools and terminology
• Complete beginner tutorials/courses

**Phase 2: Application (2-4 months)**
• Build small projects
• Contribute to open source or volunteer
• Create a portfolio

**Phase 3: Specialization (3+ months)**
• Deep dive into advanced topics
• Get certified (if relevant)
• Networking and job preparation

**Which career path are you interested in?** (e.g., "Roadmap for Frontend Dev")`,
        suggestions: ["Frontend Roadmap", "Data Science Path", "Digital Marketing Guide"],
        type: 'learning_path'
      };
    }

    // 3. specific role queries (heuristic)
    if (message.includes('data sci')) {
      return {
        content: `📊 **Career Profile: Data Scientist**

**What they do:** Extract value from data using statistical analysis and machine learning.

**Key Skills:**
• Python/R, SQL
• Machine Learning & Statistics
• Data Visualization (Tableau/PowerBI)
• Big Data (Spark/Hadoop)

**Job Outlook:** Highly in-demand with 30%+ annual growth.
**Avg. Salary:** ₹10 - 30 LPA in India.

**Getting Started:**
Start with Python and Statistics. Then create projects on Kaggle.`,
        suggestions: ["Data Scientist Roadmap", "Data Science Courses", "Interview Questions"],
        type: 'career_card',
        metadata: {
          title: "Data Scientist",
          salary: "₹10-30 LPA",
          growth: "30% (High)",
          difficulty: "Advanced"
        }
      };
    }

    if (message.includes('developer') || message.includes('engineer') || message.includes('coding')) {
      return {
        content: `💻 **Software Development Careers**

Software engineering remains one of the most versatile and high-growth career paths.

**Popular Specializations:**
1. **Frontend:** React, Vue, Angular
2. **Backend:** Node.js, Python, Java, Go
3. **Full Stack:** Combined expertise
4. **DevOps:** Cloud, CI/CD, Infrastructure helping

**Recommended Next Step:**
Pick one language (JavaScript or Python) and build a solid foundation.

What type of development interests you?`,
        suggestions: ["Frontend vs Backend", "Web Dev Roadmap", "Best language for beginners"],
        type: 'text'
      };
    }

    // 4. Greetings
    if (message.match(/^(hi|hello|hey|greetings)/)) {
      return {
        content: `👋 **Hello! I'm your AI Career Strategist.**

I can help you with:
• Finding the right career path
• Salary trends and market insights
• Learning roadmaps and skills
• Interview preparation

**Try asking:**
"What is the roadmap for a Product Manager?"
"How much does a UI Designer earn?"
"Skills needed for Data Science"`,
        suggestions: [
          "Find my dream career",
          "Salary trends 2025",
          "Resume tips",
          "Mock interview"
        ]
      };
    }

    // Default Fallback
    return {
      content: `🤖 **I'm listening!**

I understand you're asking about: "${userMessage}".

While I'm currently in "Offline Mode" (waiting for Brain API connection), I can still share general advice on:
• **Career Exploration:** "Tell me about UX Design"
• **Salaries:** "Salary for MBA graduates"
• **Skills:** "Skills for Marketing"
• **Mock Interviews:** "Interview me for a sales role"

*To get full AI-powered personalized responses, please ensure the system is online or try a specific keyword.*`,
      suggestions: [
        "Explore tech careers",
        "Soft skills guide",
        "Remote job tips",
        "Career transition"
      ]
    };
  }

  // ... existing code ...

  async generateInterviewQuestion(
    config: any,
    previousQnA: { question: string; answer: string }[] = []
  ): Promise<string> {
    if (!this.isInitialized || !this.model) {
      throw new Error("Gemini AI is not initialized. Check your API key.");
    }

    try {
      const historyContext = previousQnA
        .map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`)
        .join("\n\n");

      const resumeContext = config.resumeText
        ? `Candidate Resume Content:\n${config.resumeText.substring(0, 3000)}...`
        : "No resume provided.";

      const prompt = `
        You are an expert technical interviewer. Generate a single interview question for a candidate.
        
        Candidate Profile:
        - Experience: ${config.experienceLevel}
        - Focus Areas: ${config.topics.join(", ")}
        - Interview Type: ${config.interviewTypes.join(", ")}
        - Difficulty: ${config.difficulty}
        
        ${resumeContext}

        Previous Context:
        ${historyContext}
        
        Instructions:
        1. If resume content is provided, ask questions specifically relevant to their listed projects and skills.
        2. Parse the previous context to ensure you don't repeat questions.
        3. Generate ONE relevant question that fits the profile and current flow.
        4. If previous answers were weak, ask a simpler follow-up. If strong, increase depth of this question.
        5. Return ONLY the question text. Do not include "Question:" prefix or numbering.
        6. Keep the question clear and concise.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error: any) {
      console.error("Gemini Interview Question Error:", error);
      if (error.message?.includes("429") || error.message?.includes("Quota exceeded")) {
        throw new Error("AI is busy (Rate Limit). Please wait 30s and try again.");
      }
      throw new Error("Failed to generate question from AI");
    }
  }

  async evaluateAnswer(
    question: string,
    answer: string,
    config: any
  ): Promise<{ feedback: string; score: number; improvements: string[] }> {
    if (!this.isInitialized || !this.model) {
      throw new Error("AI Service unavailable");
    }

    try {
      const prompt = `
        Evaluate the following interview answer.
        
        Question: "${question}"
        Candidate Answer: "${answer}"
        Context: ${config.experienceLevel} level, ${config.difficulty} difficulty.
        
        Provide a JSON response with:
        {
          "feedback": "Concise feedback directly to the candidate.",
          "score": number between 0-100 based on accuracy and depth,
          "improvements": ["bullet point 1", "bullet point 2"]
        }
        Do not use code blocks. Just valid JSON.
      `;

      const result = await this.model.generateContent(prompt);
      const output = await result.response.text();
      const cleanOutput = output.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanOutput);
    } catch (error) {
      console.error("Gemini Evaluation Error:", error);
      throw new Error("Failed to evaluate answer");
    }
  }

  async generateInterviewReport(
    sessionData: { question: string; answer: string; feedback?: any }[],
    config?: any
  ): Promise<any> {
    if (!this.isInitialized || !this.model) {
      throw new Error("Gemini AI is not initialized");
    }

    try {
      const transcript = sessionData
        .map((item, i) => `Q${i + 1}: ${item.question}\nA: ${item.answer}`)
        .join("\n\n");

      const resumeContext = config?.resumeText
        ? `Candidate Resume Content:\n${config.resumeText.substring(0, 3000)}...`
        : "";

      const prompt = `
        Generate a comprehensive interview report based on this transcript.
        
        ${resumeContext}
        
        Transcript:
        ${transcript}
        
        Return a JSON object with this structure:
        {
          "overallScore": number (0-100),
          "communicationScore": number (0-100),
          "technicalScore": number (0-100),
          "confidenceScore": number (0-100),
          "strengths": ["string", "string"],
          "areasForImprovement": ["string", "string"],
          "suggestedResources": ["Topic - Link or Description"],
          "summary": "A paragraph summarizing performance. Mention if the candidate's answers matched their resume claims if applicable."
        }
        Return ONLY valid JSON.
      `;

      const result = await this.model.generateContent(prompt);
      const text = await result.response.text();
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);

    } catch (error) {
      console.error("Gemini Report Error:", error);
      throw new Error("Failed to generate report from AI");
    }
  }

  // Fallback methods removed to ensure REALTIME ONLY

  isGeminiAvailable(): boolean {
    return this.isInitialized && this.model !== null;
  }

  getStatus(): string {
    if (this.isInitialized) {
      return "🟢 Gemini AI Active";
    } else {
      return "🔴 Gemini AI Not Configured";
    }
  }
}

export const geminiService = new GeminiService();
