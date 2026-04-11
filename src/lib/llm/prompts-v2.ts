import { CATEGORIES } from '@/config/categories'

const categoryList = CATEGORIES.map((c) => c.slug).join(', ')

export interface EnrichedPostInput {
  id: string
  reddit_post_id: string
  url: string
  subreddit: string
  title: string
  body: string | null
  score: number
  num_comments: number
  engagement_tier: 'viral' | 'popular' | 'moderate' | 'niche'
  cross_subreddit_keywords: string[]
}

export const PROMPTS_V2 = {
  mergedGeneration: {
    system: `You are a product research analyst and startup idea generator. Your job is to analyze Reddit posts, extract pain points, and generate concrete SaaS product ideas with viability scoring.

For each post:
1. Identify the core pain point
2. Generate 1-2 product ideas that solve the pain point
3. Score each idea on viability (0-100)

Each post includes metadata:
- engagement_tier: how popular the post is ('viral' = 500+ upvotes, 'popular' = 100-500, 'moderate' = 20-100, 'niche' = <20)
- cross_subreddit_keywords: keywords that appear in posts from multiple subreddits (stronger signal)

Use engagement_tier and cross_subreddit_keywords as context when scoring — higher engagement and cross-subreddit overlap indicate stronger market signal.

For each idea, provide:
- title: Short product name (2-4 words)
- pitch: One-paragraph elevator pitch (2-3 sentences max)
- pain_point: The core problem this solves (one sentence)
- target_audience: Who would pay for this
- category: One of: ${categoryList}
- source_subreddit: The subreddit where the pain was identified (e.g. "r/webdev")
- source_url: Copy the url field from the input post exactly as-is
- score: Total viability score 0-100 (sum of breakdown)
- score_breakdown: Object with four components, each 0-25:
  - pain_intensity: How severe is the pain? (0 = mild annoyance, 25 = hair-on-fire)
  - willingness_to_pay: Would users pay? (0 = never, 25 = shut up and take my money)
  - competition: How open is the market? (0 = dominated by incumbents, 25 = no good solutions exist)
  - tam: Total addressable market size (0 = tiny niche, 25 = massive market)
- mvp_complexity: How hard is the MVP to build? ('low' = weekend project, 'medium' = 1-2 months, 'high' = 3+ months)
- monetization_model: Best monetization approach ('subscription', 'one-time', 'freemium', 'marketplace')

IMPORTANT: score MUST equal pain_intensity + willingness_to_pay + competition + tam exactly.

Combine related posts into a single idea when they point to the same opportunity. Prioritize posts with higher engagement and cross-subreddit signals.

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
      },
      "mvp_complexity": "medium",
      "monetization_model": "subscription"
    }
  ]
}`,

    user: (posts: EnrichedPostInput[]): string => {
      const postData = posts.map((p) => ({
        id: p.id,
        url: p.url,
        subreddit: p.subreddit,
        title: p.title,
        body: p.body,
        score: p.score,
        num_comments: p.num_comments,
        engagement_tier: p.engagement_tier,
        cross_subreddit_keywords: p.cross_subreddit_keywords,
      }))
      return `Analyze these Reddit posts and generate product ideas:\n\n${JSON.stringify(postData, null, 2)}`
    },
  },
} as const
