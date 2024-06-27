import LoginService from './login-service'
import type { LoginResponse } from './types'
import errorHandler from '@/services/errorHandler'

interface PayloadLogin {
  email: string
  password: string
}

export default function useLogin() {
  const { erros, mostrarErros, loading } = errorHandler()
  const router = useRouter()
  const ability = useAbility()

  const loadingBtn = () => {
    loading.value = !loading.value
  }

  const putData = (response: LoginResponse) => {
    if (response.authorization) {
      const abilities = response.authorization.abilities.permissions
      const user = response.user
      const token = response.authorization.token

      useLocalStorage('userAbilityRules', abilities)

      ability.update(abilities)

      useLocalStorage('userData', user)
      useLocalStorage('accessToken', token)
      useLocalStorage('subjects', response.authorization.abilities.subjects)
    }
    else {
      const user = response.usuario
      const token = response.token.token
      const abilities = response.token.abilities

      useLocalStorage('userAbilityRules', abilities)

      ability.update(abilities)

      useLocalStorage('userData', user)
      useLocalStorage('accessToken', token)
    }
  }

  const login = async (payload: PayloadLogin) => {
    loadingBtn()

    return LoginService.postOrPutRequest('POST', payload).catch((err: any) => {
      loadingBtn()
      mostrarErros(err)
    })
  }

  const logout = () => {
    useLocalStorage('userData', null).value = null
    useLocalStorage('userAbilityRules', null).value = null
    useLocalStorage('accessToken', null).value = null

    router.replace('/auth/login')
  }

  return {
    login,
    erros,
    loading,
    logout,
    putData,
  }
}
