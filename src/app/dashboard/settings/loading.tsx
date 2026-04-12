export default function SettingsLoading() {
  return (
    <div className="max-w-[560px] mx-auto">
      {/* Back link skeleton */}
      <div className="h-5 w-24 bg-surface-low rounded animate-pulse mb-6" />

      <div className="mb-12">
        {/* Title skeleton */}
        <div className="h-12 w-48 bg-surface-low rounded-lg animate-pulse mb-2" />
        {/* Subtitle skeleton */}
        <div className="h-5 w-80 bg-surface-low rounded animate-pulse" />
      </div>

      {/* Form skeleton */}
      <div className="space-y-6">
        <div className="p-6 rounded-lg bg-surface-lowest shadow-md">
          <div className="space-y-4">
            <div className="h-5 w-32 bg-surface-low rounded animate-pulse" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 w-28 bg-surface-low rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>
        <div className="h-10 w-32 bg-surface-low rounded-lg animate-pulse" />
      </div>
    </div>
  )
}
