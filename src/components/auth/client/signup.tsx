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
  CircularProgress,
} from '@mui/material'
import Link from 'next/link'
import { api } from '@/utils/api'
import { IClient, IUF } from '@/utils/types'
import { useRouter } from 'next/navigation'
import { useCities } from '@/hooks/useCities'
import { useSignUp } from '@/hooks/useSignUp'
import { FormEvent, useMemo, useState } from 'react'
import { useThemes } from '@/context/themeContext'

export const SignUp = ({ states }: IUF) => {
  const sign = useSignUp()
  const router = useRouter()
  const { mode } = useThemes()
  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const { data: allCities } = useCities(uf)
  const [isLoading, setIsLoading] = useState(false)
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
      setIsLoading(true)
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

      router.replace(`/api/auth/login?id=${newUserId}`)
    } catch (err: any) {
      setError(err.message)
      console.error('[signup]: ', err)
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
              <InputLabel id="type-document">Tipo</InputLabel>

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
                id="outlined-basic"
                label="Documento cadastrado"
                value={sign.valueNumbers.document}
                onChange={sign.handleChangeNumbers}
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
                width: '130px',
              }}
              variant="outlined"
            />
            <TextField
              name="address"
              value={sign.values.address}
              onChange={sign.handleChange}
              id="outlined-basic"
              label="Endereço"
              variant="outlined"
            />
          </Box>

          <TextField
            name="neighborhood"
            value={sign.values.neighborhood}
            onChange={sign.handleChange}
            id="outlined-basic"
            label="Bairro"
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
              {isLoading ? <CircularProgress size="1.5rem" /> : 'Enviar'}
            </Button>
          </Box>
        </form>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Já tem uma conta? Entre{' '}
          <Link style={{ color: 'rgba(255, 255, 255, 0.7)' }} href="/login">
            aqui
          </Link>
          , ou crie sua conta de{' '}
          <Link
            href="/driver/signup"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            motorista
          </Link>
        </p>
      </Box>
    </Box>
  )
}
