interface ErrorHandling {
  errors: any[] | string
  erroStatus: string
  erroDialog: boolean
}

export const handleError = (error: any) => {
  if (error?.status === 500) {
    return {
      errors: [],
      erroStatus: 'Ocorreu um erro tente novamente mais tarde',
      erroDialog: true,
    } as ErrorHandling
  }
  if (error?.status === 403 || error?.status === 401) {
    return {
      errors: [],
      erroStatus: error._data?.message,
      erroDialog: true,
    } as ErrorHandling
  }
  else {
    return {
      errors: error._data?.errors,
      erroStatus: error._data?.message ?? '',
      erroDialog: true,
    } as ErrorHandling
  }
}
