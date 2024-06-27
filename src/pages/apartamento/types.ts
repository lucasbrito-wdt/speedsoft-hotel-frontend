export interface IApartamento {
  id?: string
  nome: string
  codigo: string
  checkins?: ICheckin[]
  ultimo_checkin?: ICheckin
  status: string
}

export interface ICheckin {
  id: string
  chegada: string
  saida: string
  cliente_id: string
}

export interface IItemsResponse {
  data: IApartamento[]
  total: number
  page: number
}

export interface IApartamentoStore {
  apartamento: IApartamento
}
