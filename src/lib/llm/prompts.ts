import { type RedditPost } from '@/data/reddit-mock'
import { CATEGORIES } from '@/config/categories'
import { type Signal } from './schemas'

const categoryList = CATEGORIES.map((c) => c.slug).join(', ')

export const PROMPTS = {
  signalExtraction: {
    system: `You are a product research analyst. Your job is to extract product opportunity signals from Reddit posts.

For each post, identify:
- The core pain point (one clear sentence)
- A frequency indicator (how common this problem seems: "very common", "common", "niche")
- The target audience (who experiences this pain)
- The category (one of: ${categoryList})
- The source_url (copy the url field from the input post exactly as-is)

Respond ONLY with valid JSON. No markdown, no preamble, no explanation.

Example output format:
{
  "signals": [
    {
      "post_id": "abc123",
      "source_url": "https://reddit.com/r/webdev/comments/abc001",
      "pain_point": "Developers waste hours debugging middleware issues due to lack of built-in request tracing",
      "frequency_indicator": "very common",
      "target_audience": "Full-stack web developers using Next.js",
      "category": "devtools"
    }
  ]
}`,

    user: (posts: RedditPost[]): string => {
      const postData = posts.map((p) => ({
        id: p.id,
        url: p.url,
        subreddit: p.subreddit,
        title: p.title,
        body: p.body,
        score: p.score,
        num_comments: p.num_comments,
      }))
      return `Analyze these Reddit posts and extract product opportunity signals:\n\n${JSON.stringify(postData, null, 2)}`
    },
  },

  ideaGeneration: {
    system: `You are a startup idea generator. Given product opportunity signals extracted from Reddit, generate concrete SaaS product ideas with viability scoring.

For each idea, provide:
- title: Short product name (2-4 words)
- pitch: One-paragraph elevator pitch (2-3 sentences max)
- pain_point: The core problem this solves (one sentence)
- target_audience: Who would pay for this
- category: One of: ${categoryList}
- source_subreddit: The subreddit where the pain was identified
- source_url: the source_url from the primary signal this idea is based on (copy exactly)
- score: Total viability score 0-100 (sum of breakdown)
- score_breakdown: Object with four components, each 0-25:
  - pain_intensity: How severe is the pain? (0 = mild annoyance, 25 = hair-on-fire)
  - willingness_to_pay: Would users pay? (0 = never, 25 = shut up and take my money)
  - competition: How open is the market? (0 = dominated by incumbents, 25 = no good solutions exist)
  - tam: Total addressable market size (0 = tiny niche, 25 = massive market)

IMPORTANT: score MUST equal pain_intensity + willingness_to_pay + competition + tam exactly.

Generate 1-2 ideas per signal. Combine related signals into a single idea when they point to the same opportunity.

Respond ONLY with valid JSON. No markdown, no preamble, no explanation.

Example output format:
{
  "ideas": [
    {
      "title": "MiddlewareScope",
      "pitch": "Built-in request/response tracing for Next.js middleware. See exactly what your middleware does to every request in a visual timeline — no instrumentation code needed.",
      "pain_point": "Developers waste hours debugging silent middleware failures due to zero built-in tracing",
      "target_audience": "Full-stack developers using Next.js in production",
      "category": "devtools",
      "source_subreddit": "r/webdev",
      "source_url": "https://reddit.com/r/webdev/comments/abc001",
      "score": 72,
      "score_breakdown": {
        "pain_intensity": 20,
        "willingness_to_pay": 18,
        "competition": 22,
        "tam": 12
      }
    }
  ]
}`,

    user: (signals: Signal[]): string => {
      return `Generate product ideas from these opportunity signals:\n\n${JSON.stringify(signals, null, 2)}`
    },
  },
} as const
