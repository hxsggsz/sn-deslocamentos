import { useState } from 'react'
import { TabPanel } from './navbar/tabPanel'
import { Box, Button, TextField } from '@mui/material'
import { IDrivers, SelectDriver } from './SelectDriver'
import { IVehicles } from '@/utils/types'
import { SelectVehicle } from './selectVehicle'
import { AnimatePresence } from 'framer-motion'

interface IDeslocamentoForm {
  value: number
  vehicles: IVehicles[]
  allDrivers: IDrivers[]
}

export const DeslocamentoForm = ({
  value,
  vehicles,
  allDrivers,
}: IDeslocamentoForm) => {
  const [next, setNext] = useState(0)
  const [driverId, setDriverId] = useState(0)
  const [vehicle, setVehicle] = useState({ id: 0, kmInicial: 0 })
  const [reason, setReason] = useState('')

  function handleDriverId(id: number) {
    setDriverId(id)
    setNext((prev) => (prev += 1))
  }

  function handleVehicle(id: number, kmInicial: number) {
    setVehicle({ id, kmInicial })
    setNext((prev) => (prev += 1))
    startRace()
  }

  async function startRace() {
    const date = new Date()
    const body = {
      kmInicial: vehicle.kmInicial,
      inicioDeslocamento: date.toISOString(),
      checkList: 'pendente',
      motivo: reason,
      observacao: '',
      idCondutor: driverId,
      idVeiculo: vehicle.id,
      idCliente: 0,
    }
    console.log(body)
  }

  return (
    <TabPanel index={0} value={value}>
      {/* realiza a animação mesmo depois do componente deixar de existir */}
      <AnimatePresence>
        {next === 0 ? (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <TextField
              value={reason}
              id="input-reason"
              variant="outlined"
              label="Motivo do deslocamento"
              onChange={(ev) => setReason(ev.target.value)}
            />
            <Box sx={{ display: 'flex', justifyItems: 'end' }}>
              <Button
                type="submit"
                disabled={reason === ''}
                onClick={() => setNext((prev) => (prev += 1))}
              >
                Iniciar
              </Button>
            </Box>
          </Box>
        ) : next === 1 ? (
          <SelectDriver allDrivers={allDrivers} setDriverId={handleDriverId} />
        ) : (
          <SelectVehicle vehicles={vehicles} setVehicle={handleVehicle} />
        )}
      </AnimatePresence>
    </TabPanel>
  )
}
