import { Tab, Tabs } from '@mui/material'
import { Dispatch, SetStateAction, SyntheticEvent } from 'react'

interface INavbar {
  tabs: string[]
  value: number
  setValue: Dispatch<SetStateAction<number>>
}

export const Navbar = ({ tabs, value, setValue }: INavbar) => {
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Tabs
      sx={{
        paddingTop: '14px',
        borderBottom: 1,
        borderColor: 'divider',
      }}
      value={value}
      onChange={handleChange}
      aria-label="basic tabs example"
    >
      {tabs.map((tab, idx) => (
        <Tab key={idx} label={tab} />
      ))}
    </Tabs>
  )
}
