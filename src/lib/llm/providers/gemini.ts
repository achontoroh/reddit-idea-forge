import { GoogleGenerativeAI } from '@google/generative-ai'
import { LLM_CONFIG } from '@/config/llm'
import { type LLMProvider, type LLMCompleteOptions, LLMError } from '../provider'

export class GeminiProvider implements LLMProvider {
  readonly name = 'gemini'
  private readonly client: GoogleGenerativeAI

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new LLMError('GEMINI_API_KEY environment variable is required', 'gemini')
    }
    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }

  async complete(userPrompt: string, systemPrompt: string, options?: LLMCompleteOptions): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({
        model: options?.model ?? LLM_CONFIG.geminiModel,
        systemInstruction: systemPrompt,
        generationConfig: {
          maxOutputTokens: LLM_CONFIG.maxTokens,
          temperature: options?.temperature ?? LLM_CONFIG.temperature,
          responseMimeType: 'application/json',
        },
      })

      const result = await model.generateContent(userPrompt)
      const content = result.response.text()
      if (!content) {
        throw new Error('No text response from LLM')
      }

      return content
    } catch (error) {
      if (error instanceof LLMError) throw error
      throw new LLMError('Completion failed', this.name, error)
    }
  }
}
