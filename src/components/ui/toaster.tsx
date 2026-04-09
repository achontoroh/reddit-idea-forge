'use client'

import { Toaster as SonnerToaster } from 'sonner'
import { type FC } from 'react'

export const Toaster: FC = () => {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
    />
  )
}
