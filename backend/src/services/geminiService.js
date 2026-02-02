import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

class GeminiService {
  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.isConfigured = !!this.apiKey;
  }

  async generateContent(prompt, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            topK: options.topK || 40,
            topP: options.topP || 0.95,
            maxOutputTokens: options.maxTokens || 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.candidates && response.data.candidates[0]) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No content generated');
      }
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      throw new Error(`Gemini API failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async validateNewsArticle(article) {
    const prompt = `
Analyze this news article and provide validation:

Title: ${article.title}
Source: ${article.sourceName}
Summary: ${article.summary}
URL: ${article.url}

Please validate:
1. Does this appear to be a legitimate news article?
2. Is the source credible?
3. Does the content seem factual and well-written?
4. Rate credibility from 1-10

Respond in JSON format:
{
  "isLegitimate": boolean,
  "credibilityScore": number,
  "sourceCredible": boolean,
  "contentQuality": "high|medium|low",
  "concerns": ["list of any concerns"],
  "recommendation": "approve|review|reject"
}
`;

    try {
      const response = await this.generateContent(prompt, { temperature: 0.3 });
      return JSON.parse(response);
    } catch (error) {
      console.error('Article validation failed:', error);
      return {
        isLegitimate: true, // Default to true if validation fails
        credibilityScore: 7,
        sourceCredible: true,
        contentQuality: "medium",
        concerns: ["Validation service unavailable"],
        recommendation: "review"
      };
    }
  }

  async generateAlternativeContent(originalArticle, reason = "link_broken") {
    const prompt = `
The original news article link is broken. Generate alternative content based on the available information:

Original Title: ${originalArticle.title}
Original Source: ${originalArticle.sourceName}
Original Summary: ${originalArticle.summary}
Reason: ${reason}

Create a replacement article with:
1. A similar but not identical title
2. A comprehensive summary covering the same topic
3. Suggest 3 alternative reliable sources where this story might be found
4. Maintain the same business/financial focus

Respond in JSON format:
{
  "title": "Alternative title",
  "summary": "Detailed summary",
  "alternativeSources": [
    {"name": "Source Name", "url": "https://example.com", "reason": "Why this source is relevant"}
  ],
  "confidence": number,
  "disclaimer": "Note about generated content"
}
`;

    try {
      const response = await this.generateContent(prompt, { temperature: 0.5 });
      return JSON.parse(response);
    } catch (error) {
      console.error('Alternative content generation failed:', error);
      return {
        title: `${originalArticle.title} (Content Unavailable)`,
        summary: `Original article from ${originalArticle.sourceName} is currently unavailable. This appears to be about ${originalArticle.title.toLowerCase()}. Please check back later or visit the source directly.`,
        alternativeSources: [
          { name: "Reuters Business", url: "https://www.reuters.com/business/", reason: "Comprehensive business coverage" },
          { name: "Bloomberg", url: "https://www.bloomberg.com/", reason: "Financial and market news" },
          { name: "Financial Times", url: "https://www.ft.com/", reason: "Global business news" }
        ],
        confidence: 0.3,
        disclaimer: "This content was generated due to source unavailability"
      };
    }
  }

  async enhanceArticleSummary(article) {
    const prompt = `
Enhance this business news article summary to be more informative and engaging:

Title: ${article.title}
Current Summary: ${article.summary}
Source: ${article.sourceName}

Create an enhanced summary that:
1. Is 2-3 sentences long
2. Highlights key business implications
3. Maintains factual accuracy
4. Is engaging but professional
5. Includes relevant business context

Return only the enhanced summary text, no JSON or formatting.
`;

    try {
      const response = await this.generateContent(prompt, { temperature: 0.4 });
      return response.trim();
    } catch (error) {
      console.error('Summary enhancement failed:', error);
      return article.summary; // Return original if enhancement fails
    }
  }

  async generateQuizQuestions(articles) {
    const articlesText = articles.slice(0, 5).map(a => 
      `Title: ${a.title}\nSource: ${a.sourceName}\nSummary: ${a.summary}`
    ).join('\n\n');

    const prompt = `
Based on these business news articles, create 5 multiple-choice quiz questions:

${articlesText}

For each question, create:
1. A clear question about the article content
2. 4 multiple choice options (A, B, C, D)
3. Indicate the correct answer
4. Provide a brief explanation

Format as JSON:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": 0,
      "explanation": "Why this is correct",
      "sourceArticle": "Article title"
    }
  ]
}
`;

    try {
      const response = await this.generateContent(prompt, { temperature: 0.6 });
      return JSON.parse(response);
    } catch (error) {
      console.error('Quiz generation failed:', error);
      return { questions: [] };
    }
  }
}

export default new GeminiService();