import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseServiceRole } from '@/lib/supabase/service'
import { getRedditSource } from '@/lib/reddit'
import { generateIdeasFromPosts } from '@/lib/services/idea-generator'
import { scoreIdea } from '@/lib/services/idea-scorer'
import { type Idea, type ScoreBreakdown } from '@/lib/types/idea'

export async function POST() {
  try {
    // Auth check
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Step 1: Load Reddit posts and filter out already-processed ones
    const source = getRedditSource()
    const allPosts = await source.fetchPosts()

    const { data: existingIdeas } = await (supabaseServiceRole
      .from('ideas') as ReturnType<typeof supabaseServiceRole.from>)
      .select('source_url')
      .not('source_url', 'is', null)

    const processedUrls = new Set(
      ((existingIdeas ?? []) as Array<{ source_url: string }>).map(
        (idea) => idea.source_url
      )
    )

    const posts = allPosts.filter(
      (post) => !processedUrls.has(post.url)
    )

    if (posts.length === 0) {
      return NextResponse.json({
        message: 'All posts already analyzed',
        generated: 0,
      })
    }

    // Step 2: Generate ideas from posts (includes signal extraction + idea generation)
    const generatedIdeas = await generateIdeasFromPosts(posts)

    // Step 3: Re-score each idea independently for more accurate scoring
    const scoredIdeas = await Promise.all(
      generatedIdeas.map(async (idea) => {
        const categoryPosts = allPosts.filter((p) => p.category === idea.category)
        const score = await scoreIdea(idea, categoryPosts)
        return { idea, score }
      })
    )

    // Step 4: Save to Supabase via service role (bypasses RLS for insert)
    const ideasToInsert = scoredIdeas.map(({ idea, score }) => ({
      title: idea.title,
      pitch: idea.pitch,
      pain_point: idea.pain_point,
      category: idea.category,
      source_subreddit: idea.source_subreddit,
      source_url: idea.source_url,
      ai_score: score.total,
      ai_score_breakdown: {
        pain_intensity: score.pain_intensity,
        willingness_to_pay: score.willingness_to_pay,
        competition: score.competition,
        tam: score.tam,
      } satisfies ScoreBreakdown,
      target_audience: idea.target_audience,
    }))

    // Type assertion needed: supabase-js v2.102 generic resolution
    // doesn't match our Database type shape for .insert()
    const { data: savedIdeas, error: insertError } = await (supabaseServiceRole
      .from('ideas') as ReturnType<typeof supabaseServiceRole.from>)
      .insert(ideasToInsert as never)
      .select()

    if (insertError) {
      console.error('[API] ideas/generate insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to save ideas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: {
        ideas: savedIdeas as Idea[],
        count: savedIdeas?.length ?? 0,
      },
    })
  } catch (error) {
    console.error('[API] ideas/generate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
