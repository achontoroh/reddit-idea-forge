export interface LLMCompleteOptions {
  temperature?: number
  /** Override the default model for this call (provider-specific model ID) */
  model?: string
}

export interface LLMProvider {
  readonly name: string
  complete(userPrompt: string, systemPrompt: string, options?: LLMCompleteOptions): Promise<string>
}

export class LLMError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly cause?: unknown
  ) {
    super(`[${provider}] ${message}`)
    this.name = 'LLMError'
  }
}
