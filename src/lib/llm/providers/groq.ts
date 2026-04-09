import Groq from 'groq-sdk'
import { LLM_CONFIG } from '@/config/llm'
import { type LLMProvider, LLMError } from '../provider'

export class GroqProvider implements LLMProvider {
  readonly name = 'groq'
  private readonly client: Groq

  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new LLMError('GROQ_API_KEY environment variable is required', 'groq')
    }
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  }

  async complete(userPrompt: string, systemPrompt: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: LLM_CONFIG.maxTokens,
        temperature: LLM_CONFIG.temperature,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      })

      const content = response.choices[0]?.message?.content
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
