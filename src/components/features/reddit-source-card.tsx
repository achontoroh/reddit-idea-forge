import { type FC } from 'react'
import { type RedditPost } from '@/lib/types/reddit-post'

interface RedditSourceCardProps {
  post: RedditPost
}

export const RedditSourceCard: FC<RedditSourceCardProps> = ({ post }) => {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-lg bg-surface-lowest p-4 transition-all hover:shadow-md hover:bg-surface-low"
    >
      {/* Reddit icon */}
      <div className="shrink-0 mt-0.5">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-on-surface-muted group-hover:text-accent transition-colors"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9" cy="11" r="1.5" fill="currentColor" />
          <circle cx="15" cy="11" r="1.5" fill="currentColor" />
          <path
            d="M8.5 14.5c.5 1.5 1.8 2.5 3.5 2.5s3-1 3.5-2.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        {/* Subreddit badge */}
        <span className="inline-block text-[11px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5 mb-2">
          r/{post.subreddit}
        </span>

        {/* Post title */}
        <p className="text-sm font-medium text-on-surface leading-snug line-clamp-2 mb-2">
          {post.title}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-on-surface-muted">
          {/* Upvotes */}
          <span className="inline-flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            {post.score}
          </span>

          {/* Comments */}
          <span className="inline-flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {post.num_comments}
          </span>
        </div>
      </div>

      {/* External link icon */}
      <div className="shrink-0 mt-1">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-on-surface-muted opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </div>
    </a>
  )
}
