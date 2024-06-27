import type { IUsuario } from '@/pages/usuario/types'

export interface IPermission {
  id?: string
  title: string
  name: string
  actions: IAction[]
  actionsAdded?: IActionsAdded[]
  actionsAdding?: string[]
  actionsChip?: string[]
  actionsDelete?: string[]
}

export interface IActionsAdded {
  id: string
  action: string
}

export interface IAction {
  id?: string
  title: string
  action: string
}

export interface IRole {
  id?: string
  title: string
  name: string
  permissions: IPermission[]
}

export interface IRoleResponse {
  data: IRole[]
  total: number
}

export interface IPermissionResponse {
  data: IPermission[]
  page: number
  total: number
}

export interface IUsuarioResponse {
  data: IUsuario[]
  page: number
  total: number
}
