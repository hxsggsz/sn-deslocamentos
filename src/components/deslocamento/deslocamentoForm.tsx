import { useState } from 'react'
import { IVehicles } from '@/utils/types'
import { TabPanel } from './navbar/tabPanel'
import { SelectVehicle } from './selectVehicle'
import { AnimatePresence } from 'framer-motion'
import { Box, Button, TextField } from '@mui/material'
import { IDrivers, SelectDriver } from './SelectDriver'
import { api } from '@/utils/api'

interface IDeslocamentoForm {
  value: number
  userId: number
  vehicles: IVehicles[]
  allDrivers: IDrivers[]
}

export const DeslocamentoForm = ({
  value,
  userId,
  vehicles,
  allDrivers,
}: IDeslocamentoForm) => {
  const [next, setNext] = useState(0)
  const [reason, setReason] = useState('')
  const [driverId, setDriverId] = useState(0)
  const [vehicle, setVehicle] = useState({ id: 0, kmAtual: 0 })

  function handleDriverId(id: number) {
    setDriverId(id)
    setNext((prev) => (prev += 1))
  }

  async function handleVehicle(id: number, kmAtual: number) {
    setVehicle({ id, kmAtual })
    vehicle.id !== 0 && (await startRace())
  }

  async function startRace() {
    const date = new Date()
    const body = {
      kmInicial: vehicle.kmAtual,
      inicioDeslocamento: date.toISOString(),
      checkList: 'pendente',
      motivo: reason,
      observacao: '',
      idCondutor: driverId,
      idVeiculo: vehicle.id,
      idCliente: Number(userId),
    }

    try {
      const raceRespone = await api.post(
        '/Deslocamento/IniciarDeslocamento',
        body,
      )

      if (raceRespone.status === 200) {
        setNext((prev) => (prev += 1))
      }
    } catch (error) {
      console.log('[start race]: ', error)
    }
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
        ) : next === 2 ? (
          <SelectVehicle vehicles={vehicles} setVehicle={handleVehicle} />
        ) : (
          'procurando'
        )}
      </AnimatePresence>
    </TabPanel>
  )
}
