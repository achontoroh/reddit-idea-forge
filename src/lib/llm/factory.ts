import { config } from '@/config/app'
import { type LLMProvider } from './provider'
import { AnthropicProvider } from './providers/anthropic'
import { GroqProvider } from './providers/groq'
import { GeminiProvider } from './providers/gemini'

type ProviderName = 'anthropic' | 'groq' | 'gemini'

let cachedProvider: LLMProvider | null = null
let cachedProviderName: string | null = null

export function getLLMProvider(): LLMProvider {
  const provider: ProviderName = config.llm.provider

  // Return cached instance if provider hasn't changed
  if (cachedProvider && cachedProviderName === provider) {
    return cachedProvider
  }

  console.log(`[LLM] Using provider: ${provider}`)

  switch (provider) {
    case 'groq':
      cachedProvider = new GroqProvider()
      break
    case 'gemini':
      cachedProvider = new GeminiProvider()
      break
    case 'anthropic':
    default:
      cachedProvider = new AnthropicProvider()
      break
  }

  cachedProviderName = provider
  return cachedProvider
}
