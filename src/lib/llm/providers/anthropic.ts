import Anthropic from '@anthropic-ai/sdk'
import { LLM_CONFIG } from '@/config/llm'
import { type LLMProvider, LLMError } from '../provider'

export class AnthropicProvider implements LLMProvider {
  readonly name = 'anthropic'
  private readonly client: Anthropic

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new LLMError('ANTHROPIC_API_KEY environment variable is required', 'anthropic')
    }
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }

  async complete(userPrompt: string, systemPrompt: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: LLM_CONFIG.model,
        max_tokens: LLM_CONFIG.maxTokens,
        temperature: LLM_CONFIG.temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      })

      const textBlock = response.content.find((block) => block.type === 'text')
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text response from LLM')
      }

      return textBlock.text
    } catch (error) {
      if (error instanceof LLMError) throw error
      throw new LLMError('Completion failed', this.name, error)
    }
  }
}
