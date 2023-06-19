export interface IClient {
  id: number
  numeroDocumento: string
  tipoDocumento: string
  nome: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  uf: string
}

export interface IUF {
  states: {
    id: number
    sigla: string
    nome: string
  }[]
}

export interface ICities {
  id: number
  nome: string
}
