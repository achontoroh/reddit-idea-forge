import { type CSSProperties, type FC } from 'react'
import { categoryLabels, type CategoryKey } from '@/lib/design-system/categories'

interface TagProps {
  category: CategoryKey
  label?: string
  size?: 'sm' | 'md'
  active?: boolean
  className?: string
}

export const Tag: FC<TagProps> = ({
  category,
  label,
  size = 'md',
  active = false,
  className,
}) => {
  const dotStyle: CSSProperties = { background: `var(--cat-${category})` }

  return (
    <span
      className={className ? `tag ${className}` : 'tag'}
      data-category={category}
      data-size={size}
      data-active={active ? 'true' : undefined}
    >
      <span className="tag-dot" aria-hidden="true" style={dotStyle} />
      <span className="tag-label">{label ?? categoryLabels[category]}</span>
    </span>
  )
}
