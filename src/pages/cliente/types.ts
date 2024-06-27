export interface ICliente {
  id?: string
  nome: string
  data_nasc: any
  sexo: any
  cpf: string
  nacionalidade: string
  profissao: string
  email: string
  telefone: string
  celular: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string

}

export interface IItemsResponse {
  data: ICliente[]
  total: number
  page: number
}
