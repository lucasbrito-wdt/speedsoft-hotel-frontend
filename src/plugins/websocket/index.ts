import Pusher from 'pusher-js'
import Echo from 'laravel-echo'

Pusher.logToConsole = true

export const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_MIX_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_MIX_PUSHER_APP_CLUSTER,
  encrypted: true,
})
