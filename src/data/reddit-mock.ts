import { type CategorySlug } from '@/config/categories'

export interface RedditPost {
  id: string
  subreddit: string
  title: string
  body: string
  score: number
  num_comments: number
  url: string
  created_utc: number
  category: CategorySlug
}

export const mockRedditPosts: RedditPost[] = [
  // ── devtools ──────────────────────────────────────────────
  {
    id: 'dt_001',
    subreddit: 'r/webdev',
    title: 'Spent 3 hours debugging why my Next.js API route returns 200 but the client gets a network error',
    body: 'Turns out my middleware was silently eating the response body on certain routes. There is zero logging for this by default. I had to add custom middleware instrumentation just to figure out what was happening. Why is there no built-in request/response tracing for Next.js middleware?',
    score: 1847,
    num_comments: 142,
    url: 'https://reddit.com/r/webdev/comments/abc001',
    created_utc: 1712400000,
    category: 'devtools',
  },
  {
    id: 'dt_002',
    subreddit: 'r/programming',
    title: 'Our team wastes ~2 hours/week resolving merge conflicts in auto-generated files',
    body: 'We have Prisma schema, GraphQL codegen, and OpenAPI types all generating code into the repo. Every PR touches these files and conflicts are constant. We tried .gitattributes merge strategies but they break type safety. Wish there was a tool that could intelligently merge generated code by re-running the generators.',
    score: 923,
    num_comments: 87,
    url: 'https://reddit.com/r/programming/comments/abc002',
    created_utc: 1712486400,
    category: 'devtools',
  },
  {
    id: 'dt_003',
    subreddit: 'r/devops',
    title: 'Is there a way to get a unified view of logs across Vercel, Supabase, and Stripe?',
    body: 'I run a small SaaS and when something breaks I have to check three different dashboards to correlate what happened. Last week a payment failed and I spent 45 minutes jumping between Stripe logs, Supabase function logs, and Vercel to trace the request. I just want one timeline view with all the events correlated by request ID.',
    score: 412,
    num_comments: 63,
    url: 'https://reddit.com/r/devops/comments/abc003',
    created_utc: 1712572800,
    category: 'devtools',
  },
  {
    id: 'dt_004',
    subreddit: 'r/reactjs',
    title: 'React DevTools profiler is useless for diagnosing why my app freezes for 300ms on route change',
    body: 'The profiler shows re-renders but not what triggered them. I have 40+ context providers and somewhere a state update is cascading. I tried why-did-you-render but it floods the console. Need something that shows a causal chain: "this setState caused these 12 re-renders costing 280ms total".',
    score: 2134,
    num_comments: 178,
    url: 'https://reddit.com/r/reactjs/comments/abc004',
    created_utc: 1712659200,
    category: 'devtools',
  },

  // ── health ────────────────────────────────────────────────
  {
    id: 'hl_001',
    subreddit: 'r/diabetes',
    title: 'My CGM app has no way to correlate blood sugar spikes with what I actually ate',
    body: 'I use Dexcom G7 and track meals in MyFitnessPal. There is zero integration between them. I manually screenshot my glucose graph and try to line it up with meal times. Even just a simple overlay of "you ate X at 12:30, glucose peaked at 1:15" would save me hours per week of manual tracking.',
    score: 567,
    num_comments: 89,
    url: 'https://reddit.com/r/diabetes/comments/abc005',
    created_utc: 1712745600,
    category: 'health',
  },
  {
    id: 'hl_002',
    subreddit: 'r/ADHD',
    title: 'Every medication tracking app assumes you take pills at the same time every day',
    body: 'I take Vyvanse but my schedule varies wildly — some days I wake at 6am, some at 10am. Every reminder app just does "take at 8am" which is useless. I need something that adjusts based on when I actually wake up and warns me if taking it too late will mess up my sleep.',
    score: 1203,
    num_comments: 156,
    url: 'https://reddit.com/r/ADHD/comments/abc006',
    created_utc: 1712832000,
    category: 'health',
  },
  {
    id: 'hl_003',
    subreddit: 'r/running',
    title: 'No running app accounts for air quality when planning outdoor routes',
    body: 'I live in a city with variable AQI. On bad days I should run in the park (more trees, less traffic) vs along the main road. But Strava, Nike Run Club etc. just show distance and elevation. I want route suggestions that factor in real-time air quality data, especially during wildfire season.',
    score: 384,
    num_comments: 52,
    url: 'https://reddit.com/r/running/comments/abc007',
    created_utc: 1712918400,
    category: 'health',
  },

  // ── education ─────────────────────────────────────────────
  {
    id: 'ed_001',
    subreddit: 'r/learnprogramming',
    title: 'Tutorial hell is real — I finish courses but cannot build anything from scratch',
    body: 'I have completed 3 Udemy courses, the Odin Project up to intermediate JS, and freeCodeCamp. But when I open VS Code to build my own project I freeze. The gap between "follow along" and "build from scratch" is enormous. I need something that gives me progressively less scaffolding — like training wheels that slowly retract.',
    score: 2891,
    num_comments: 198,
    url: 'https://reddit.com/r/learnprogramming/comments/abc008',
    created_utc: 1713004800,
    category: 'education',
  },
  {
    id: 'ed_002',
    subreddit: 'r/professors',
    title: 'AI detection tools flag legitimate student work and I have no way to verify',
    body: 'Turnitin flagged 8 papers in my last batch as "likely AI generated." Three of those students came to office hours crying — they wrote every word themselves. These tools have no transparency, no confidence intervals, and I am making career-affecting decisions based on a black box percentage. I need something that shows me WHY it thinks text is AI-generated, not just a score.',
    score: 1567,
    num_comments: 134,
    url: 'https://reddit.com/r/professors/comments/abc009',
    created_utc: 1713091200,
    category: 'education',
  },
  {
    id: 'ed_003',
    subreddit: 'r/languagelearning',
    title: 'Duolingo taught me to translate sentences but I cannot hold a 30-second conversation',
    body: 'After 400 days of Duolingo Spanish I can ace every lesson but freeze when a native speaker talks to me. The gap between "pick the right word from 4 options" and "produce a sentence from memory in real-time" is massive. I want an app that simulates real conversation pressure — time limits, unexpected topics, slang, mumbling.',
    score: 1834,
    num_comments: 167,
    url: 'https://reddit.com/r/languagelearning/comments/abc010',
    created_utc: 1713177600,
    category: 'education',
  },
  {
    id: 'ed_004',
    subreddit: 'r/HomeworkHelp',
    title: 'Every math tutoring app skips the "why" and just shows steps',
    body: 'My kid uses Photomath and gets the right answer but has no idea why the steps work. When the test has a slightly different problem format, she is lost. We need something that teaches the underlying concept first, then guides through the procedure — not just a step-by-step answer machine.',
    score: 743,
    num_comments: 91,
    url: 'https://reddit.com/r/HomeworkHelp/comments/abc011',
    created_utc: 1713264000,
    category: 'education',
  },

  // ── finance ───────────────────────────────────────────────
  {
    id: 'fn_001',
    subreddit: 'r/personalfinance',
    title: 'I have 4 subscriptions I forgot about and just found $47/month in charges I did not recognize',
    body: 'Went through my credit card statement line by line and found Grammarly ($12), a VPN I stopped using ($9.99), a cloud storage plan ($15), and some app called "Setapp" ($10). None of these send "you are about to be charged" emails. I want a tool that monitors my recurring charges and pings me before renewal with a "do you still use this?" prompt.',
    score: 3012,
    num_comments: 187,
    url: 'https://reddit.com/r/personalfinance/comments/abc012',
    created_utc: 1713350400,
    category: 'finance',
  },
  {
    id: 'fn_002',
    subreddit: 'r/smallbusiness',
    title: 'QuickBooks gives me 50 reports but none of them answer "can I afford to hire someone?"',
    body: 'I am a solo founder doing $18k MRR. I want to hire a part-time contractor. QuickBooks shows me P&L, cash flow, balance sheet — but none of them answer the actual question: "if I commit to $4k/month in new payroll, will I run out of cash in 6 months given my current growth rate and churn?" I need scenario modeling, not more accounting reports.',
    score: 876,
    num_comments: 112,
    url: 'https://reddit.com/r/smallbusiness/comments/abc013',
    created_utc: 1713436800,
    category: 'finance',
  },
  {
    id: 'fn_003',
    subreddit: 'r/fatFIRE',
    title: 'Tax-loss harvesting across 3 brokerages is a nightmare of spreadsheets',
    body: 'I have taxable accounts at Fidelity, Schwab, and Vanguard. Each has their own unrealized gains/losses view but none of them talk to each other. I manually export CSVs, merge in Google Sheets, and try to find offsetting positions. One wrong wash sale and my accountant charges me $500 to fix it. There has to be a better way.',
    score: 534,
    num_comments: 78,
    url: 'https://reddit.com/r/fatFIRE/comments/abc014',
    created_utc: 1713523200,
    category: 'finance',
  },

  // ── productivity ──────────────────────────────────────────
  {
    id: 'pr_001',
    subreddit: 'r/productivity',
    title: 'I spend more time organizing my task manager than actually doing tasks',
    body: 'I have tried Todoist, Notion, Linear, ClickUp, and Asana. Every time I switch I spend a week setting up projects, labels, views, and automations. Then I realize I have 200 tasks and no idea which 3 matter today. I want something that just asks me "what are the 3 most important things today?" and hides everything else until those are done.',
    score: 2456,
    num_comments: 189,
    url: 'https://reddit.com/r/productivity/comments/abc015',
    created_utc: 1713609600,
    category: 'productivity',
  },
  {
    id: 'pr_002',
    subreddit: 'r/RemoteWork',
    title: 'Meeting notes from Zoom, Google Meet, and Teams all live in different places',
    body: 'My company uses all three depending on who scheduled. Each meeting has notes in a different tool — Otter.ai for Zoom, Google Docs for Meet, OneNote for Teams. When I need to find "what did we decide about the API migration?" I have to search three places. I just want one searchable archive of all meeting decisions regardless of platform.',
    score: 1123,
    num_comments: 95,
    url: 'https://reddit.com/r/RemoteWork/comments/abc016',
    created_utc: 1713696000,
    category: 'productivity',
  },
  {
    id: 'pr_003',
    subreddit: 'r/Notion',
    title: 'Notion is my second brain but I never review anything I put in it',
    body: 'I have 500+ pages of notes, bookmarks, article highlights, and meeting summaries. I diligently capture everything but never resurface it. When I need info I Google it again instead of searching Notion because Notion search is terrible and I cannot remember what I named things. I want something that proactively surfaces relevant past notes when I am working on related topics.',
    score: 1678,
    num_comments: 143,
    url: 'https://reddit.com/r/Notion/comments/abc017',
    created_utc: 1713782400,
    category: 'productivity',
  },
  {
    id: 'pr_004',
    subreddit: 'r/SideProject',
    title: 'I have 12 half-finished side projects and zero shipped products',
    body: 'Every weekend I start something new because the dopamine of "new idea" beats the grind of finishing. I know this pattern but cannot break it. I wish there was an accountability tool specifically for indie hackers that pairs you with someone at a similar stage, sets weekly milestones, and makes it socially painful to abandon yet another project.',
    score: 2234,
    num_comments: 176,
    url: 'https://reddit.com/r/SideProject/comments/abc018',
    created_utc: 1713868800,
    category: 'productivity',
  },
]

export function getPostsByCategorySlug(category: CategorySlug): RedditPost[] {
  return mockRedditPosts.filter((post) => post.category === category)
}
