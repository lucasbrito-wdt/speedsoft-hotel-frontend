interface IRole {
  title: string
  value: string
}

export interface IUser {
  id?: string
  name: string
  email: string
  password?: string
  password_confirmation?: string
  foto?: string
  role: IRole
}

export interface IItemsResponse {
  data: IUser[]
  total: number
  page: number
}
