import { createClient } from '@/lib/supabase/server'
import { type Idea, type IdeaWithVote } from '@/lib/types/idea'
import { IdeaFeed } from '@/components/ideas/idea-feed'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Auth is already guarded by DashboardLayout — user is guaranteed here
  const { data: { user } } = await supabase.auth.getUser()

  const { data: ideas } = await supabase
    .from('ideas')
    .select('*, idea_votes!left(vote)')
    .eq('idea_votes.user_id', user!.id)
    .order('ai_score', { ascending: false })
    .order('created_at', { ascending: false })

  const typedIdeas: IdeaWithVote[] = (ideas ?? []).map((row) => {
    const { idea_votes, ...idea } = row as Idea & { idea_votes: { vote: number }[] }
    const userVote = idea_votes?.[0]?.vote as 1 | -1 | undefined ?? null
    return { ...idea, userVote }
  })

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl md:text-[3.5rem] font-bold font-heading tracking-[-0.02em] leading-tight text-on-surface">
          Ideas
        </h1>
      </header>

      {typedIdeas.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-lg text-on-surface-muted">No ideas generated yet</p>
          <p className="text-sm text-on-surface-muted">
            New ideas are generated automatically — check back soon.
          </p>
        </div>
      ) : (
        <IdeaFeed ideas={typedIdeas} />
      )}
    </div>
  )
}
