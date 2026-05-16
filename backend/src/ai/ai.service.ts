import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  private openaiApiKey = process.env.OPENAI_API_KEY;
  private openaiModel = process.env.AI_MODEL || 'gpt-3.5-turbo';

  async generateResponse(
    userMessage: string,
    conversationHistory: any[],
  ): Promise<string> {
    try {
      // Format conversation history for API
      const messages = conversationHistory
        .map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        }))
        .concat([
          {
            role: 'user',
            content: userMessage,
          },
        ]);

      // Add system prompt for counselor context
      const systemPrompt = {
        role: 'system',
        content: `You are a compassionate school counselor AI assistant. Your role is to:
1. Listen actively and show empathy to student concerns
2. Provide supportive guidance on academic, personal, and social issues
3. Suggest resources and coping strategies
4. Encourage positive decision-making
5. Maintain confidentiality and appropriate boundaries
6. Recommend professional help when needed
Keep responses concise, warm, and appropriate for school settings.`,
      };

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.openaiModel,
          messages: [systemPrompt, ...messages],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'I apologize, but I am temporarily unable to respond. Please try again later or reach out to your counselor.';
    }
  }

  async analyzeSentiment(text: string): Promise<string> {
    // Basic sentiment analysis - can be enhanced with ML models
    const positiveWords = [
      'good',
      'great',
      'happy',
      'excited',
      'grateful',
      'wonderful',
    ];
    const negativeWords = [
      'sad',
      'angry',
      'frustrated',
      'worried',
      'stressed',
      'anxious',
    ];

    const textLower = text.toLowerCase();
    const positiveCount = positiveWords.filter((word) =>
      textLower.includes(word),
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      textLower.includes(word),
    ).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  async extractTopics(text: string): Promise<string[]> {
    // Simple keyword extraction - can be enhanced with NLP
    const topics: string[] = [];
    const keywords = {
      'academic': ['grades', 'homework', 'exam', 'study', 'school'],
      'personal': ['family', 'home', 'parents', 'friends', 'relationship'],
      'mental health': [
        'stress',
        'anxiety',
        'depression',
        'worried',
        'sad',
      ],
      'career': ['future', 'college', 'job', 'career', 'major'],
    };

    const textLower = text.toLowerCase();
    for (const [topic, words] of Object.entries(keywords)) {
      if (words.some((word) => textLower.includes(word))) {
        topics.push(topic);
      }
    }

    return topics;
  }
}
