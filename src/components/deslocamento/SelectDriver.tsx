import { Box, Grid, Paper, Typography } from '@mui/material'
import { motion } from 'framer-motion'

export interface IDrivers {
  id: number
  nome: string
}
export const SelectDriver = ({
  allDrivers,
  setDriverId,
}: {
  allDrivers: IDrivers[]
  setDriverId: (id: number) => void
}) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    sx={{ display: 'grid', placeItems: 'center', flexGrow: 1 }}
  >
    <h2>Selecione um motorista</h2>
    <Grid
      container
      justifyContent="center"
      rowSpacing={2}
      spacing={{ xs: 4, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      {allDrivers.length !== 0 ? (
        allDrivers.map((driver) => (
          <Grid item xs={3} sm={4} md={4} key={driver.id}>
            <Paper
              variant="outlined"
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDriverId(driver.id)}
              sx={{
                padding: '12px 22px',
                cursor: 'pointer',
              }}
            >
              <Typography>{driver.nome}</Typography>
            </Paper>
          </Grid>
        ))
      ) : (
        <Typography>Nenhum motorista disponivel no momento</Typography>
      )}
    </Grid>
  </Box>
)
