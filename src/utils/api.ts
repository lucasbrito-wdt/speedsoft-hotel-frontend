import { ofetch } from 'ofetch'

export const $api = ofetch.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api` || '/api',
  async onRequest({ options }) {
    const accessToken = useLocalStorage('accessToken', null).value
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Origin': 'http://localhost:5173',
        'ngrok-skip-browser-warning': 'true',
      }
    }
  },
})
