export interface IEmpresa {
  cnpj: string
  razao_social: string
  email: string
  telefone: string
  cep: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  pais: string

}

export interface IItemsResponse {
  data: IEmpresa[]
  total: number
  page: number
}
