export default function IdeaDetailLoading() {
  return (
    <div className="max-w-[720px] mx-auto">
      {/* Back link skeleton */}
      <div className="h-5 w-24 bg-surface-low rounded animate-pulse mb-6" />

      {/* Category + score skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-7 w-28 bg-surface-low rounded-full animate-pulse" />
        <div className="h-7 w-20 bg-surface-low rounded-full animate-pulse" />
      </div>

      {/* Title skeleton */}
      <div className="space-y-3 mb-8">
        <div className="h-10 w-full bg-surface-low rounded-lg animate-pulse" />
        <div className="h-10 w-2/3 bg-surface-low rounded-lg animate-pulse" />
      </div>

      {/* Pitch skeleton */}
      <div className="space-y-2 mb-16">
        <div className="h-5 w-full bg-surface-low rounded animate-pulse" />
        <div className="h-5 w-full bg-surface-low rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-surface-low rounded animate-pulse" />
      </div>

      {/* Pain point section skeleton */}
      <div className="mb-20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-surface-low" />
          <div className="h-3 w-20 bg-surface-low rounded animate-pulse" />
        </div>
        <div className="p-6 rounded-lg bg-surface-lowest shadow-md">
          <div className="space-y-2">
            <div className="h-4 w-full bg-surface-low rounded animate-pulse" />
            <div className="h-4 w-full bg-surface-low rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-surface-low rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
