import { ChangeEvent, FormEvent, useState } from 'react'
import { SelectChangeEvent } from '@mui/material/Select'
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
} from '@mui/material'
import Link from 'next/link'
import { api } from '@/utils/api'
import { ICondutor } from '@/utils/types'
import { useRouter } from 'next/navigation'
import { useThemes } from '@/context/themeContext'

export const Signup = () => {
  const router = useRouter()
  const { mode } = useThemes()
  const [error, setError] = useState('')
  const [license, setLicense] = useState('')
  const [typeDocument, setTypeDocument] = useState('')
  const [values, setValues] = useState({ name: '', LicenseDate: '' })

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    setValues({
      ...values,
      [ev.target.name]: ev.target.value,
    })
  }

  function handleChangeNumbers(ev: ChangeEvent<HTMLInputElement>) {
    setLicense(ev.currentTarget.value.replace(/[^\d]/g, ''))
  }

  function handleSelect(ev: SelectChangeEvent) {
    setTypeDocument(ev.target.value)
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const date = new Date(values.LicenseDate)
    const dateISO = date.toISOString()
    const body = {
      nome: values.name,
      numeroHabilitacao: license,
      categoriaHabilitacao: typeDocument,
      vencimentoHabilitacao: dateISO,
    }
    // procura um único cliente que bata com todas as informações
    try {
      const clientsResponse = await api.get<ICondutor[]>('/Condutor')
      const getUser = clientsResponse.data

      const checkDocument = getUser.find(
        (user) => user.numeroHabilitacao === license,
      )

      if (checkDocument) {
        throw new Error('Condutor com essa habilitação já registrado')
      }
      setError('')

      const getUserResponse = await api.post<ICondutor[]>('/Condutor', body)
      const usersId = getUserResponse.data

      router.replace(`/api/auth/login?id=${usersId}`)
    } catch (err: any) {
      console.error('[logIn]: ', err)
      setError(err.message)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: `url(/background-${mode}.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      <h1 style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
        Bem vindo ao SN Deslocamentos!
      </h1>
      <Box
        sx={{
          padding: '20px',
          borderRadius: '10px',
          bgcolor: 'action.disabledBackground',
        }}
      >
        <h2 style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Primeiro de tudo, entre na sua conta:
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            placeItems: 'center',
            gap: '12px',
          }}
        >
          <TextField
            name="name"
            id="outlined-basic"
            value={values.name}
            label="Seu melhor nome"
            onChange={handleChange}
            variant="outlined"
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: '6px',
            }}
          >
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="type-document">Categoria</InputLabel>

              <Select
                id="type-document"
                value={typeDocument}
                onChange={handleSelect}
                label="Selecione uma categoria"
                labelId="Selecione uma categoria"
              >
                <MenuItem disabled value="">
                  <em>Selecione uma categoria</em>
                </MenuItem>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
                <MenuItem value="E">E</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField
                fullWidth
                value={license}
                id="outlined-basic"
                onChange={handleChangeNumbers}
                label="Habilitação registrada"
              />
            </FormControl>
          </Box>

          <TextField
            fullWidth
            type="date"
            name="LicenseDate"
            value={values.LicenseDate}
            id="outlined-basic"
            sx={{
              '& .MuiFormHelperText-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                width: '100%',
                margin: 0,
                paddingTop: '4px',
                paddingLeft: '14px',
              },
            }}
            onChange={handleChange}
            helperText="Habilitação registrada"
          />

          {error && <span style={{ color: '#ff1744' }}>{error}</span>}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              width: '100%',
            }}
          >
            <Button
              disabled={
                !!(values.name === '' || typeDocument === '' || license === '')
              }
              type="submit"
              variant="contained"
            >
              Enviar
            </Button>
          </Box>
        </form>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Já tem uma conta? Entre{' '}
          <Link
            href="/driver/login"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            aqui
          </Link>
          , ou crie sua conta de{' '}
          <Link style={{ color: 'rgba(255, 255, 255, 0.7)' }} href="/">
            cliente
          </Link>
        </p>
      </Box>
    </Box>
  )
}
