import React from 'react'
import { Toaster as Sonner, ToasterProps } from 'sonner'

type Theme = 'light' | 'dark' | 'system'

interface CustomToasterProps extends ToasterProps {
  theme?: Theme
}

const Toaster: React.FC<CustomToasterProps> = ({ theme = 'system', ...props }) => {
  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      {...props}
    />
  )
}

export { Toaster }
