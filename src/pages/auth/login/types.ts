export interface LoginResponse {
  authorization: Authorization
  user: UserData
}

interface UserData {
  id: string
  name: string

  // another fields
}

interface Authorization {
  abilities: Permissions[]
  token: string
}

interface Permissions {
  permissions: Abilities[]
}

interface Abilities {
  action: string
  subject: string
}
