import { handleError } from '@/services/error-handling'

export default function errorHandler() {
  const erros = ref({
    erroStatus: '',
    erroDialog: false,
    errors: [],
  })

  const loading = ref(false)

  const mostrarErros = (erro: any) => {
    const handling = handleError(erro)

    loading.value = false
    erros.value.erroStatus = handling?.erroStatus
    erros.value.erroDialog = handling?.erroDialog
    //@ts-ignore
    erros.value.errors = handling?.errors
  }

  return {
    mostrarErros,
    erros,
    loading,
  }
}
