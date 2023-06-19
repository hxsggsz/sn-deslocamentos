import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
  Autocomplete,
  SelectChangeEvent,
} from '@mui/material'
import Link from 'next/link'
import { IClient, IUF } from '@/utils/types'
import { useRouter } from 'next/navigation'
import { useCities } from '@/hooks/useCities'
import { useSignUp } from '@/hooks/useSignUp'
import { FormEvent, useMemo, useState } from 'react'
import { api } from '@/utils/api'

export const SignUp = ({ states }: IUF) => {
  const sign = useSignUp()
  const router = useRouter()
  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const { data: allCities } = useCities(uf)
  const [typeDocument, setTypeDocument] = useState('')

  const stateAbbreviation = useMemo(() => {
    return states.map((state) => state.sigla)
  }, [states])

  const cities = useMemo(() => {
    if (!allCities) {
      return []
    }

    return allCities.map((city) => city.nome)
  }, [allCities])

  function handleSelect(ev: SelectChangeEvent) {
    setTypeDocument(ev.target.value)
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()

    const body = {
      numeroDocumento: sign.valueNumbers.document,
      tipoDocumento: typeDocument,
      nome: sign.values.name,
      logradouro: sign.values.address,
      numero: sign.valueNumbers.addressNumber,
      bairro: sign.values.address,
      cidade: city,
      uf,
    }

    try {
      const clientsResponse = await api.get<IClient[]>('/Cliente')
      const getUser = clientsResponse.data

      const checkDocument = getUser.find(
        (user) => user.numeroDocumento === sign.valueNumbers.document,
      )

      if (checkDocument) {
        throw new Error('Usuário já registrado')
      }

      const signupResponse = await api.post('/Cliente', body)
      const newUserId = signupResponse.data

      if (!newUserId) {
        throw new Error('Não foi possível realizar o cadastro')
      }

      router.replace(`/api/auth/loginClient?id=${newUserId}`)
    } catch (err: any) {
      setError(err.message)
      console.error('[signup]: ', err)
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
        <h2 style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
          Novo por aqui? Crie a sua conta!
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
            value={sign.values.name}
            onChange={sign.handleChange}
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
                name="type-document"
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
                name="document"
                value={sign.valueNumbers.document}
                id="outlined-basic"
                sx={{
                  label: {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
                onChange={sign.handleChangeNumbers}
                label="Documento cadastrado"
              />
            </FormControl>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: '6px',
            }}
          >
            <FormControl sx={{ minWidth: 100 }}>
              <Autocomplete
                disablePortal
                inputValue={uf}
                id="auto-states"
                noOptionsText="Estado não-encontrado"
                options={stateAbbreviation}
                onInputChange={(_, newInputValue) => {
                  setUf(newInputValue)
                }}
                renderInput={(params) => <TextField {...params} label="UF" />}
              />
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <Autocomplete
                disablePortal
                inputValue={city}
                id="auto-cities"
                options={cities}
                noOptionsText={
                  uf === ''
                    ? 'Selecione um estado antes'
                    : 'Nenhuma cidade com esse nome encontrado'
                }
                onInputChange={(_, newInputValue) => {
                  setCity(newInputValue)
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Cidade" />
                )}
              />
            </FormControl>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: '6px',
            }}
          >
            <TextField
              name="addressNumber"
              value={sign.valueNumbers.addressNumber}
              onChange={sign.handleChangeNumbers}
              id="outlined-basic"
              label="Número"
              sx={{
                label: {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
              variant="outlined"
            />
            <TextField
              name="address"
              value={sign.values.address}
              onChange={sign.handleChange}
              id="outlined-basic"
              label="Endereço"
              sx={{
                label: {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
              variant="outlined"
            />
          </Box>

          <TextField
            name="neighborhood"
            value={sign.values.neighborhood}
            onChange={sign.handleChange}
            id="outlined-basic"
            label="Bairro"
            sx={{
              label: {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
            variant="outlined"
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
                !!(
                  uf === '' ||
                  city === '' ||
                  typeDocument === '' ||
                  sign.values.name === '' ||
                  sign.values.address === '' ||
                  sign.values.neighborhood === '' ||
                  sign.valueNumbers.document === '' ||
                  sign.valueNumbers.addressNumber === ''
                )
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
          <Link style={{ color: 'rgba(255, 255, 255, 0.7)' }} href="/login">
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
