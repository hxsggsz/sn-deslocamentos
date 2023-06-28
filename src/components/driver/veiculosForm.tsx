import { api } from '@/utils/api'
import { IVehicles } from '@/utils/types'
import { TabPanel } from '../navbar/tabPanel'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Box, Button, CircularProgress, Paper, TextField } from '@mui/material'
import { KeyedMutator } from 'swr'

export const VeiculosForm = ({
  value,
  mutate,
}: {
  value: number
  mutate: KeyedMutator<IVehicles[]>
}) => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState({
    placa: '',
    marca: '',
    kmAtual: '',
    anoFabricacao: '',
  })

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    setValues({
      ...values,
      [ev.target.name]: ev.target.value,
    })
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()

    if (values.anoFabricacao.length < 4) {
      setError('Ano Inválido')
      return
    }

    try {
      setIsLoading(true)
      const vehicleResponse = await api.get<IVehicles[]>('/Veiculo')
      const vehicles = vehicleResponse.data

      const checkVehicles = vehicles.find(
        (vehicle) => vehicle.placa === values.placa,
      )
      if (checkVehicles) {
        throw new Error('Veículo já registrado')
      }

      const body = {
        placa: values.placa,
        marcaModelo: values.marca,
        anoFabricacao: Number(values.anoFabricacao),
        kmAtual: Number(values.kmAtual),
      }

      await api.post('/Veiculo', body)
      mutate()
      setValues({ placa: '', marca: '', kmAtual: '', anoFabricacao: '' })
      setError('')
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TabPanel index={0} value={value}>
      <Paper
        variant="outlined"
        sx={{
          padding: '12px 22px',
          borderTop: '8px solid #7253b6',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gap: '6px',
          }}
        >
          <TextField
            id="placa"
            name="placa"
            variant="outlined"
            value={values.placa}
            onChange={handleChange}
            label="Placa do veículo"
          />
          <TextField
            id="marca"
            name="marca"
            variant="outlined"
            value={values.marca}
            onChange={handleChange}
            label="Marca do veículo"
          />
          <Box sx={{ display: 'flex', gap: '6px' }}>
            <TextField
              type="number"
              variant="outlined"
              id="anoFabricacao"
              name="anoFabricacao"
              label="Ano de fabricação"
              onChange={handleChange}
              value={values.anoFabricacao}
            />
            <TextField
              id="kmAtual"
              type="number"
              name="kmAtual"
              value={values.kmAtual}
              variant="outlined"
              label="KM atual do veículo"
              onChange={handleChange}
            />
          </Box>
          {error && <span style={{ color: '#ff1744' }}>{error}</span>}
          <Button
            disabled={
              values.placa === '' ||
              values.anoFabricacao === '' ||
              values.kmAtual === '' ||
              values.marca === ''
            }
            type="submit"
          >
            {isLoading ? <CircularProgress size="1.5rem" /> : 'Enviar'}
          </Button>
        </form>
      </Paper>
    </TabPanel>
  )
}
