import { motion } from 'framer-motion'
import { TabPanel } from './navbar/tabPanel'
import { IDeslocamentos } from '@/utils/types'
import { Box, Paper, Typography } from '@mui/material'

interface IHistoric {
  value: number
  deslocamentos: IDeslocamentos[]
}

export const Historic = ({ value, deslocamentos }: IHistoric) => {
  const formatedDate = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    day: 'numeric',
    month: 'short',
  })
  return (
    <TabPanel index={1} value={value}>
      <Typography variant="h3" align="center">
        Histórico
      </Typography>
      <Box
        mt={2}
        sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
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
                width: '90vw',
                maxWidth: '556px',
              }}
            >
              <Typography>Motivo: {deslocamento.motivo}</Typography>
              <Typography>
                Data:{' '}
                {formatedDate.format(new Date(deslocamento.inicioDeslocamento))}
              </Typography>
              <Typography>
                Status: {deslocamento.observacao !== '' ? '🟢' : '🔴'}
              </Typography>
            </Paper>
          ))
        )}
      </Box>
    </TabPanel>
  )
}
