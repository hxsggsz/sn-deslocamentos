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

export interface ICondutor {
  id: number
  nome: string
  numeroHabilitacao: string
  catergoriaHabilitacao: string
  vencimentoHabilitacao: string
}

export interface IVehicles {
  id: number
  placa: string
  marcaModelo: string
  anoFabricacao: number
  kmAtual: number
}

export interface IDeslocamentos {
  id: number
  kmInicial: number
  inicioDeslocamento: string
  checkList: string
  motivo: string
  observacao: string
  idCondutor: number
  idVeiculo: number
  idCliente: number
}
