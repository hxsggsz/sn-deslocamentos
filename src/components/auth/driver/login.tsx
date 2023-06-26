import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material'
import Link from 'next/link'
import { api } from '@/utils/api'
import { ICondutor } from '@/utils/types'
import { useRouter } from 'next/navigation'
import { useThemes } from '@/context/themeContext'
import { SelectChangeEvent } from '@mui/material/Select'
import { ChangeEvent, FormEvent, useState } from 'react'

export const Login = () => {
  const router = useRouter()
  const { mode } = useThemes()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [license, setLicense] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [typeDocument, setTypeDocument] = useState('')

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    setLicense(ev.currentTarget.value.replace(/[^\d]/g, ''))
  }

  function handleSelect(ev: SelectChangeEvent) {
    setTypeDocument(ev.target.value)
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    console.log(name, license, typeDocument)
    // procura um único cliente que bata com todas as informações
    try {
      setIsLoading(true)
      const getUserResponse = await api.get<ICondutor[]>('/Condutor')
      const users = getUserResponse.data

      const correctUser = users.find((user) => {
        return (
          user.numeroHabilitacao === license &&
          // escreveram o nome da coluna do banco de dados errado
          user.catergoriaHabilitacao === typeDocument &&
          user.nome === name
        )
      })

      if (!correctUser) {
        throw new Error('usuário não encontrado')
      }

      router.replace(`/api/auth/login?id=${correctUser.id}`)
    } catch (err: any) {
      console.error('[logIn]: ', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
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
        background: `url(/background-${mode ? 'dark' : 'light'}.png)`,
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
            value={name}
            onChange={(ev) => setName(ev.currentTarget.value)}
            id="outlined-basic"
            label="Seu melhor nome"
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
                onChange={handleChange}
                label="Habilitação registrada"
              />
            </FormControl>
          </Box>
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
                !!(name === '' || typeDocument === '' || license === '')
              }
              type="submit"
              variant="contained"
            >
              {isLoading ? <CircularProgress size="1.5rem" /> : 'Enviar'}
            </Button>
          </Box>
        </form>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Não tem uma conta? crie{' '}
          <Link
            href="/driver/signup"
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
