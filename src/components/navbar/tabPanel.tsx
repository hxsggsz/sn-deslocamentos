import { ReactNode } from 'react'
import { Box } from '@mui/material'

interface TabPanelProps {
  index: number
  value: number
  children: ReactNode
}

export const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}
