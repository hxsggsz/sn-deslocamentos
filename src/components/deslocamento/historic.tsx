import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { TabPanel } from '../navbar/tabPanel'
import { IDeslocamentos } from '@/utils/types'
import { Box, Paper, Typography } from '@mui/material'
import { ArrowClockwise } from '@phosphor-icons/react'

interface IHistoric {
  value: number
  deslocamentos: IDeslocamentos[]
}

export const Historic = ({ value, deslocamentos }: IHistoric) => {
  const router = useRouter()
  const formatedDate = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    day: 'numeric',
    month: 'short',
  })
  return (
    <TabPanel index={1} value={value}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: 500,
        }}
      >
        Histórico
        <ArrowClockwise
          size={34}
          weight="bold"
          cursor="pointer"
          onClick={router.refresh}
        />
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {deslocamentos.length === 0 ? (
          <Typography>Nenhum deslocamento realizado ainda :(</Typography>
        ) : (
          deslocamentos.map((deslocamento) => (
            <Paper
              key={deslocamento.id}
              variant="outlined"
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              sx={{
                padding: '12px 22px',
                userSelect: 'none',
              }}
            >
              <Typography>Motivo: {deslocamento.motivo}</Typography>
              <Typography>
                Data:{' '}
                {formatedDate.format(new Date(deslocamento.inicioDeslocamento))}
              </Typography>
              <Typography>
                Status: {deslocamento.checkList}{' '}
                {deslocamento.checkList === 'concluído' ? '🟢' : '🔴'}
              </Typography>
            </Paper>
          ))
        )}
      </Box>
    </TabPanel>
  )
}
