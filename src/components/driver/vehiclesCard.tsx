import { IVehicles } from '@/utils/types'
import { TabPanel } from '../navbar/tabPanel'
import { Box, Paper, Typography } from '@mui/material'

interface IVehicleCard {
  value: number
  vehicles: IVehicles[]
}

export const VehicleCard = ({ value, vehicles }: IVehicleCard) => {
  return (
    <TabPanel index={0} value={value}>
      <Box
        sx={{
          display: 'grid',
          gap: '12px',
          width: '100%',
        }}
      >
        {vehicles.map((vehicle) => (
          <Paper
            key={vehicle.id}
            variant="outlined"
            sx={{
              borderTop: '8px solid #7253b6',
              padding: '12px 22px',
              width: '90vw',
              maxWidth: '556px',
            }}
          >
            <Typography>Marca: {vehicle.marcaModelo}</Typography>
            <Typography>Ano: {vehicle.anoFabricacao}</Typography>
            <Typography>Placa: {vehicle.placa}</Typography>
          </Paper>
        ))}
      </Box>
    </TabPanel>
  )
}
