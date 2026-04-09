import Anthropic from '@anthropic-ai/sdk'
import { LLM_CONFIG } from '@/config/llm'

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY environment variable is required')
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = LLM_CONFIG.temperature
): Promise<string> {
  const response = await anthropic.messages.create({
    model: LLM_CONFIG.model,
    max_tokens: LLM_CONFIG.maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from LLM')
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[LLM] System prompt:', systemPrompt.slice(0, 200), '...')
    console.log('[LLM] Response:', textBlock.text.slice(0, 500), '...')
  }

  return textBlock.text
}

export async function callLLMWithRetry(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = LLM_CONFIG.temperature,
  maxRetries: number = 1
): Promise<string> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await callLLM(systemPrompt, userPrompt, temperature)
    } catch (error) {
      if (attempt === maxRetries) throw error
      console.warn(`[LLM] Attempt ${attempt + 1} failed, retrying...`)
    }
  }
  throw new Error('LLM call failed after retries')
}
