export interface LLMProvider {
  readonly name: string
  complete(userPrompt: string, systemPrompt: string): Promise<string>
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
