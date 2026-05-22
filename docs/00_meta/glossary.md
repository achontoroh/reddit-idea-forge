# Glossary

Project-specific terms with one-line definitions. Format: `**term** — definition`.

---

- **Idea** — an AI-generated, scored SaaS product concept derived from Reddit pain points; the core entity of the shared feed.
- **Signal** — a user pain point extracted from Reddit posts in Step 1 of the LLM pipeline, before idea generation.
- **ai_score** — model-assigned quality score stored as `/100` in the DB; rendered as `/10` (one decimal) in the UI via `displayScore()`.
- **community_score** — vote-derived score maintained by DB triggers from upvotes/downvotes.
- **Signal level** — score colour band: `signal-high` (≥8.0), `signal-mid` (6.0–7.9), `signal-low` (<6.0) on the `/10` scale.
- **Badge** — server-computed feed marker: New / Hot / Top / Trending, via `computeBadges()` in the ideas route.
- **Category** — one of 8 active topic areas (single source of truth: `src/config/categories.ts`), mapped to ~30 subreddits.
- **Arctic Shift** — primary Reddit data source (public JSON returns 403 on Vercel); fallback is the public JSON API.
- **Rotation** — category/model selection by UTC hour: 3 categories per cron run; Gemma 31B/26B alternate every 6h.
- **For You** — feed tab filtering ideas by the user's preferred categories from `user_preferences`.
- **Enrichment** — pre-LLM step adding cross-subreddit overlap + engagement classification before generation.

---

*Add terms as they emerge.*
