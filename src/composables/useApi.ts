import { createFetch } from '@vueuse/core'
import { destr } from 'destr'

/**
 * `useApi` is a custom hook that creates a fetch instance with predefined settings.
 * It uses the `createFetch` function from `@vueuse/core` to create the fetch instance.
 *
 * @export
 * @const
 *
 * @property {string} baseUrl - The base URL for the fetch requests. It defaults to the value of `VITE_API_BASE_URL` environment variable or '/api' if the environment variable is not set.
 * @property {object} fetchOptions - The default options for the fetch requests.
 * @property {object} fetchOptions.headers - The default headers for the fetch requests. It includes 'Accept: application/json'.
 * @property {object} options - The options for the fetch instance.
 * @property {boolean} options.refetch - Whether to refetch on component updates. It is set to true.
 * @property {Function} options.beforeFetch - A function that runs before each fetch request. It adds the 'Authorization' header if an access token is available.
 * @property {Function} options.afterFetch - A function that runs after each fetch request. It parses the response data if it's JSON.
 *
 */
export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  fetchOptions: {
    headers: {
      Accept: 'application/json',
    },
  },
  options: {
    refetch: true,
    async beforeFetch({ options }) {
      const accessToken = useLocalStorage('accessToken', null)

      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,

        }
      }

      return { options }
    },
    afterFetch(ctx) {
      const { data, response } = ctx

      // Parse data if it's JSON

      let parsedData = null
      try {
        parsedData = destr(data)
      }
      catch (error) {
        console.error(error)
      }

      return { data: parsedData, response }
    },
  },
})
