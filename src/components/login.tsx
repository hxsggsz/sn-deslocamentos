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
import { IClient } from '@/utils/types'
import { useRouter } from 'next/navigation'

export const Login = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [document, setDocument] = useState('')
  const [typeDocument, setTypeDocument] = useState('')

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    setDocument(ev.currentTarget.value.replace(/[^\d]/g, ''))
  }

  function handleSelect(ev: SelectChangeEvent) {
    setTypeDocument(ev.target.value)
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    // procura um único cliente que bata com todas as informações
    try {
      const getUserResponse = await api.get<IClient[]>('/Cliente')
      const users = getUserResponse.data

      const correctUser = users.find((user) => {
        return (
          user.numeroDocumento === document &&
          user.tipoDocumento === typeDocument &&
          user.nome === name
        )
      })

      if (!correctUser) {
        throw new Error('usuário não encontrado')
      }

      router.replace(`/api/auth/loginClient?id=${correctUser.id}`)
    } catch (err: any) {
      console.error('[client]: ', err)
      setError(
        err.response.data !== ''
          ? err.response.data
          : 'Erro no Login, tente novamente!',
      )
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
        backgroundColor: 'palette.background.default',
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Bem vindo ao SN Deslocamentos!</h1>
      <Box
        sx={{
          background: '#2f2644',
          padding: '20px',
          borderRadius: '10px',
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
            sx={{
              label: {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
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
            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                id="type-document"
              >
                Tipo
              </InputLabel>

              <Select
                id="type-document"
                value={typeDocument}
                onChange={handleSelect}
                label="Selecione um documento"
                labelId="Selecione um documento"
              >
                <MenuItem disabled value="">
                  <em>Selecione um documento</em>
                </MenuItem>
                <MenuItem value="CPF">CPF</MenuItem>
                <MenuItem value="RG">RG</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField
                fullWidth
                value={document}
                id="outlined-basic"
                sx={{
                  label: {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
                onChange={handleChange}
                label="Documento cadastrado"
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
                !!(name === '' || typeDocument === '' || document === '')
              }
              type="submit"
              variant="contained"
            >
              Enviar
            </Button>
          </Box>
        </form>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Não tem uma conta? crie{' '}
          <Link style={{ color: 'rgba(255, 255, 255, 0.7)' }} href="">
            aqui
          </Link>
          , ou crie sua conta de{' '}
          <Link style={{ color: 'rgba(255, 255, 255, 0.7)' }} href="">
            motorista
          </Link>
        </p>
      </Box>
    </Box>
  )
}
