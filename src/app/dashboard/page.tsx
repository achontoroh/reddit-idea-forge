import { createClient } from '@/lib/supabase/server'
import { type Idea } from '@/lib/types/idea'
import { IdeaFeed } from '@/components/ideas/idea-feed'
import { GenerateButton } from '@/components/ideas/generate-button'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: ideas } = await supabase
    .from('ideas')
    .select('*')
    .order('score', { ascending: false })
    .order('created_at', { ascending: false })

  const typedIdeas = (ideas ?? []) as Idea[]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Ideas Feed</h1>
        <GenerateButton />
      </div>

      {typedIdeas.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-lg text-gray-400">No ideas generated yet</p>
          <p className="text-sm text-gray-400">
            Click &quot;Generate Ideas&quot; to scan Reddit for product opportunities.
          </p>
        </div>
      ) : (
        <IdeaFeed ideas={typedIdeas} />
      )}
    </div>
  )
}
