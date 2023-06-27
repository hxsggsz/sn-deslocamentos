import { IVehicles } from '@/utils/types'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { motion } from 'framer-motion'

export const SelectVehicle = ({
  vehicles,
  setVehicle,
}: {
  vehicles: IVehicles[]
  setVehicle: (id: number, kmAtual: number) => void
}) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{ display: 'grid', width: '100%', placeItems: 'center', flexGrow: 1 }}
    >
      <h2>Selecione um veículo</h2>
      <Grid
        container
        rowSpacing={2}
        justifyContent="center"
        alignItems="center"
        spacing={{ xs: 4, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {vehicles.map((vehicle) => (
          <Grid item xs={3} sm={4} md={4} key={vehicle.id}>
            <Paper
              variant="outlined"
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setVehicle(vehicle.id, vehicle.kmAtual)}
              sx={{
                padding: '12px 22px',
                cursor: 'pointer',
              }}
            >
              <Typography noWrap>Modelo: {vehicle.marcaModelo}</Typography>
              <Typography noWrap>Ano: {vehicle.anoFabricacao}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
