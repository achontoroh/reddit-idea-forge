import { type RedditPost } from '@/data/reddit-mock'
import { REDDIT_CONFIG } from '@/config/reddit'

export function selectPostsForLLM(
  posts: RedditPost[],
  limit: number = REDDIT_CONFIG.llmInputPostLimit
): RedditPost[] {
  if (posts.length <= limit) {
    return posts
  }

  const postsByCategory = new Map<string, RedditPost[]>()

  for (const post of posts) {
    const existing = postsByCategory.get(post.category) ?? []
    existing.push(post)
    postsByCategory.set(post.category, existing)
  }

  for (const categoryPosts of postsByCategory.values()) {
    categoryPosts.sort((left, right) => right.score - left.score)
  }

  const categories = Array.from(postsByCategory.keys())
  const selected: RedditPost[] = []

  while (selected.length < limit) {
    let pickedInRound = false

    for (const category of categories) {
      const nextPost = postsByCategory.get(category)?.shift()
      if (!nextPost) continue

      selected.push(nextPost)
      pickedInRound = true

      if (selected.length === limit) {
        return selected
      }
    }

    if (!pickedInRound) {
      break
    }
  }

  return selected
}
