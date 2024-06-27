import { ofetch } from 'ofetch'

export const copyToClipboard = (text: string): boolean => {
  const textField = document.createElement('textarea')

  textField.innerText = text
  document.body.appendChild(textField)
  textField.select()

  const success = document.execCommand('copy')

  textField.remove()

  return success
}

export const cleanEmptyFieldsPayload = (payload: object): object => {
  const cleanPayload: any = {}

  if (payload) {
    Object.entries(payload).forEach(([key, value]) => {
      if (
        value !== null
        && value !== undefined
        && value !== ''
        && value !== 'null'
        && value !== 'undefined'
        && value !== '""'
      )
        cleanPayload[key] = value
    })
  }

  return cleanPayload
}

export async function pesquisaCEP(cep: string): Promise<{
  logradouro: string
  cidade: string
  bairro: string
  estado: string
}> {
  if (!cep || cep.length < 9)
    throw new Error('CEP inválido')

  const response = await ofetch(`https://viacep.com.br/ws/${cep}/json/`, {
    method: 'GET',

    // @ts-expect-error ...
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onResponseError({ response }) {
      console.log(response)

      return response
    },
  })

  if (response.erro)
    throw new Error('CEP inválido')

  return {
    logradouro: response.logradouro,
    cidade: response.localidade,
    bairro: response.bairro,
    estado: response.uf,
  }
}

export const getExtension = filename => {
  if (filename === null || filename === undefined)
    return

  return filename?.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

export const checkMimeType = (value: string | null): string | false => {
  if (!value) {
    console.log('O valor fornecido é nulo.')

    return false
  }

  let mimeType: string | null | false = null

  // Check if value is a base64 string
  if (value.startsWith('data:')) {
    const mimeRegex = /data:([^;]+);/
    const match = mimeRegex.exec(value)

    mimeType = match ? match[1] : null
  }
  else {
    // Assume value is a file path or URL
    mimeType = getExtension(value)
  }

  if (mimeType) {
    console.log(`O valor tem o MIME type ${mimeType}.`)

    return true
  }
  else {
    console.log('Não foi possível determinar o MIME type do valor.')

    return false
  }
}

export const blurHandler = () => {
  const element = document.activeElement as HTMLElement

  if (element)
    element.blur()
}
