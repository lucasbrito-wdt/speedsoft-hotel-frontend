import errorHandler from './errorHandler'
import type { QueryString } from '@/pages/types/global-types'

const { mostrarErros } = errorHandler()

class ApiService {
  private readonly _endpoint: string

  public constructor(endpoint: string) {
    this._endpoint = endpoint
  }

  protected filtrarQuery(objeto: any) {
    const filtrarQuery = {}

    for (const chave in objeto) {
      if (objeto[chave] !== null && objeto[chave] !== undefined && objeto[chave] !== '')

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        filtrarQuery[chave] = objeto[chave]
    }

    return filtrarQuery
  }

  protected getURL(url: string, query: QueryString): string {
    const queryFiltrada = this.filtrarQuery(query)

    // Remove trailing slash if it exists
    const sanitizedUrl = url.replace(/\/$/, '')

    return createUrl(sanitizedUrl, {
      query: queryFiltrada,
    }).value
  }

  /**
   * This method is used to make POST or PUT requests.
   *
   * @template TRequest - The expected response type.
   * @param {string} httpVerb - The HTTP verb to use for the request. Should be either 'POST' or 'PUT'.
   * @param {object | string | undefined} payload - The payload to send with the request. Can be an object, a string, or undefined.
   * @param {string | undefined} id - The id to append to the endpoint URL. Can be a string or undefined.
   * @returns {Promise<TRequest>} - Returns a promise that resolves with the response of the request.
   *
   * @throws Will throw an error if the request fails.
   */
  async postOrPutRequest<TRequest>(httpVerb: string, payload?: object | string | undefined, id?: string | undefined): Promise<TRequest> {
    // @ts-expect-error ...
    payload = cleanEmptyFieldsPayload(payload)
    let url = typeof id === 'undefined' ? this._endpoint : `${this._endpoint}/${id}`
    if (typeof payload === 'string')
      url = `${this._endpoint}/${payload}`

    return await $api<TRequest>(url, {
      method: httpVerb,
      body: payload,

      onResponseError({ response }) {
        mostrarErros(response)

        return response._data
      },
    })
  }

  /**
   * This method is used to make GET or DELETE requests.
   *
   * @template TRequest - The expected response type.
   * @param {string} httpVerb - The HTTP verb to use for the request. Should be either 'GET' or 'DELETE'.
   * @param {QueryString | undefined} query - The query parameters to append to the endpoint URL. Can be a QueryString object or undefined.
   * @param {string | undefined} id - The id to append to the endpoint URL. Can be a string or undefined.
   * @returns {Promise<TRequest>} - Returns a promise that resolves with the response of the request.
   *
   * @throws Will throw an error if the request fails.
   */
  protected async getOrDeleteRequest<TRequest>(httpVerb: string, query?: QueryString, id?: string | undefined): Promise<TRequest> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const url = this.getURL(typeof id === 'undefined' ? this._endpoint : `${this._endpoint}/${id}`, query)

    return await $api<TRequest>(url, {
      method: httpVerb,

      onResponseError({ response }) {
        mostrarErros(response)

        return response._data
      },
    })
  }

  /**
   * This method is used to create a new resource.
   *
   * @template TRequest - The expected response type.
   * @param {object} payload - The payload to send with the request.
   * @returns {Promise<TRequest>} - Returns a promise that resolves with the response of the request.
   */
  public async create<TRequest>(payload: object): Promise<TRequest> {
    return await this.postOrPutRequest<TRequest>('POST', payload)
  }

  /**
   * This method is used to update an existing resource.
   *
   * @template TRequest - The expected response type.
   * @param {object} payload - The payload to send with the request.
   * @param {string} id - The id of the resource to update.
   * @returns {Promise<TRequest>} - Returns a promise that resolves with the response of the request.
   */
  public async update<TRequest>(payload: object, id: string): Promise<TRequest> {
    return await this.postOrPutRequest<TRequest>('PUT', payload, id)
  }

  /**
   * This method is used to fetch all resources.
   *
   * @template TRequest - The expected response type.
   * @param {QueryString | undefined} query - The query parameters to append to the endpoint URL. Can be a QueryString object or undefined.
   * @returns {Promise<TRequest>} - Returns a promise that resolves with the response of the request.
   */
  public async fetchAll<TRequest>(query?: QueryString): Promise<TRequest> {
    return await this.getOrDeleteRequest<TRequest>('GET', query)
  }

  /**
   * This method is used to fetch a specific resource.
   *
   * @template TRequest - The expected response type.
   * @param {string} id - The id of the resource to fetch.
   * @returns {Promise<TRequest>} - Returns a promise that resolves with the response of the request.
   */
  public async fetch<TRequest>(id: string): Promise<TRequest> {
    return await this.getOrDeleteRequest<TRequest>('GET', undefined, id)
  }

  /**
   * This method is used to delete a specific resource.
   *
   * @template TRequest - The expected response type.
   * @param {string} id - The id of the resource to delete.
   * @returns {Promise<TRequest>} - Returns a promise that resolves with the response of the request.
   */
  public async destroy<TRequest>(id: string): Promise<TRequest> {
    return await this.getOrDeleteRequest<TRequest>('DELETE', undefined, id)
  }

  /**
   * This method is used to search resources.
   *
   * @template TRequest - The expected response type.
   * @param {string} field - The field to search.
   * @param {string} value - The value to search for.
   * @param {number} page - The page number.
   * @param {string | undefined} relation - The relation to include in the search. Can be a string or undefined.
   * @param {any | undefined} orderBy - The order by clause. Can be any value or undefined.
   * @returns {Promise<TRequest>} - Returns a promise that resolves with the response of the request.
   */
  public async search<TRequest>(field: string, value: string, page: number, relation?: string, orderBy?: any): Promise<TRequest> {
    return await this.getOrDeleteRequest<TRequest>('GET', {
      page,
      sort_by: orderBy.key,
      sort_order: orderBy.order,
    }, `pesquisarpor/${field}/${value}/${relation}`)
  }
}

export default ApiService
