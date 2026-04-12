export default function DashboardLoading() {
  return (
    <div>
      <header className="mb-12">
        <div className="h-12 w-40 bg-surface-low rounded-lg animate-pulse" />
      </header>

      {/* Sort tabs skeleton */}
      <div className="flex gap-8 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-5 w-12 bg-surface-low rounded animate-pulse" />
        ))}
      </div>

      {/* Category chips skeleton */}
      <div className="flex gap-2 flex-wrap mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-surface-low rounded-full animate-pulse" />
        ))}
      </div>

      {/* Idea cards skeleton */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-surface-lowest p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-3">
              <div className="h-6 w-3/4 bg-surface-low rounded animate-pulse" />
              <div className="h-8 w-14 bg-surface-low rounded-full animate-pulse" />
            </div>
            <div className="mb-4">
              <div className="h-5 w-20 bg-surface-low rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-surface-low rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-surface-low rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
