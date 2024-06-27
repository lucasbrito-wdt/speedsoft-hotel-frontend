import { isEmpty, isEmptyArray, isNullOrUndefined } from './helpers'

export const requiredValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'Este campo é obrigatório'

  return !!String(value).trim().length || 'Este campo é obrigatório'
}

export const emailValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-\d]+\.)+[a-z]{2,}))$/i

  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || 'O e-mail precisa ser válido'

  return re.test(String(value)) || 'O e-mail precisa ser válido'
}

export const passwordValidator = (password: string) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/

  const validPassword = regExp.test(password)

  return validPassword || 'Este campo deve conter pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial e um dígito, com no mínimo 8 caracteres'
}

export const confirmedValidator = (value: string, target: string) =>

  value === target || 'As senhas não confere.'

export const betweenValidator = (value: unknown, min: number, max: number) => {
  const valueAsNumber = Number(value)

  return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || `Precisa ser entre ${min} e ${max}`
}

export const integerValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  if (Array.isArray(value))
    return value.every(val => /^-?\d+$/.test(String(val))) || 'Este campo precisa ser um número'

  return /^-?\d+$/.test(String(value)) || 'Este campo precisa ser um número'
}

export const regexValidator = (value: unknown, regex: RegExp | string): string | boolean => {
  if (isEmpty(value))
    return true

  let regeX = regex
  if (typeof regeX === 'string')
    regeX = new RegExp(regeX)

  if (Array.isArray(value))
    return value.every(val => regexValidator(val, regeX))

  return regeX.test(String(value)) || 'O regex não está em um formato válido'
}

export const alphaValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  return /^[A-Z]*$/i.test(String(value)) || 'Este campo precisa ter letras.'
}

export const urlValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^(https?:\/\/)?(www\.)?[a-zA-Z\d.\-]+\.[a-zA-Z]{2,5}\.?/

  return re.test(String(value)) || 'A URL informada é inválida'
}

export const lengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value))
    return true

  return String(value).length === length || `O campo precisa ter no mínimo ${length} caracteres`
}

export const alphaDashValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const valueAsString = String(value)

  return /^[\w-]*$/.test(valueAsString) || 'Todos os caracteres são inválidos'
}

// valida se a data é maior que hoje
export const dataMaiorQueHoje = (data: string) => {
  const dataSelecionada = new Date(data)
  const hoje = new Date()

  hoje.setHours(0, 0, 0, 0)

  return dataSelecionada > hoje || 'A data inserida precisa ser maior que hoje.'
}

export const regexCNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/

export const cnpjValidator = (value: string | number | number[] = '') => {
  if (!value)
    return false

  const isString = typeof value === 'string'
  if (isString && !regexCNPJ.test(value))
    return false

  const numbers = matchNumbers(value)
  if (numbers.length !== 14)
    return false

  const items = [...new Set(numbers)]
  if (items.length === 1)
    return false

  const digit0 = validCalc(12, numbers)
  const digit1 = validCalc(13, numbers)

  return (digit0 === numbers[12] && digit1 === numbers[13]) || 'Você precisa informar um CNPJ válido.'
}

function validCalc(x: number, numbers: number[]) {
  let factor = x - 7
  let sum = 0

  for (let i = 0; i < x; i++) {
    sum += numbers[i] * factor--
    if (factor < 2)
      factor = 9
  }

  const result = 11 - (sum % 11)

  return result > 9 ? 0 : result
}

function matchNumbers(value: string | number | number[] = '') {
  const match = value
    .toString()
    .replace(/\D+/g, '')
    .match(/\d/g)

  return Array.isArray(match) ? match.map(Number) : []
}

export const cpfValidator = (cpf: string) => {
  // Validar se é String
  if (typeof cpf !== 'string')
    return false

  // Tirar formatação
  cpf = cpf.replace(/\D+/g, '')

  // Validar se tem tamanho 11 ou se é uma sequência de digitos repetidos
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/))
    return false

  // String para Array
  cpf = cpf.split('')

  const validator = cpf

  // Pegar os últimos 2 digitos de validação
    .filter((digit, index, array) => index >= array.length - 2 && digit)

  // Transformar digitos em números
    .map(el => +el)

  const toValidate = pop => cpf

  // Pegar Array de items para validar
    .filter((digit, index, array) => index < array.length - pop && digit)

  // Transformar digitos em números
    .map(el => +el)

  const rest = (count, pop) => (toValidate(pop)

  // Calcular Soma dos digitos e multiplicar por 10
    .reduce((soma, el, i) => soma + el * (count - i), 0) * 10)

      // Pegar o resto por 11
      % 11

      // transformar de 10 para 0
      % 10

  return !(rest(10, 2) !== validator[0] || rest(11, 1) !== validator[1]) || 'Você precisa informar um CPF válido.'
}

export const cepValidator = (cep: string) => {
  // Remover caracteres não numéricos
  const cepLimpo = cep.replace(/\D/g, '')

  // Verificar se o CEP possui 8 dígitos
  if (cepLimpo.length !== 8)
    return false || 'Você precisa informar um CEP válido.'

  // Verificar se o CEP é uma sequência de dígitos repetidos
  if (/^(\d)\1+$/.test(cepLimpo))
    return false || 'Você precisa informar um CEP válido.'

  // CEP válido
  return true
}
