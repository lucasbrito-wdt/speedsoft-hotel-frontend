export interface ICheckin {
  id?: string
  reseva: string
  chegada: any
  saida: any
  quantidade_adulto: any
  quantidade_crianca: any
  motivo_viagem: string
  meio_transporte: string
  placa: string
  valor_diaria: number
  valor_diaria_extra: number
  valor_iss: number
  aliquota_iss: number
  total: number
  apartamento_id: string
  empresa_id: string
  cliente_id: string
}

export interface IItemsResponse {
  data: ICheckin[]
  total: number
  page: number
}
