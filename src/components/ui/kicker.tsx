import type { FC } from 'react'

interface KickerProps {
  number?: string | number
  label: string
  className?: string
}

export const Kicker: FC<KickerProps> = ({ number, label, className }) => {
  const prefix =
    number === undefined || number === null || number === ''
      ? null
      : typeof number === 'number'
        ? String(number).padStart(2, '0')
        : number

  return (
    <span className={className ? `kicker ${className}` : 'kicker'}>
      {prefix && (
        <>
          {prefix}
          <span aria-hidden="true">{' · '}</span>
        </>
      )}
      {label}
    </span>
  )
}
