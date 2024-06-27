import type { LiteralUnion } from 'type-fest'
import { useLocalStorageRef } from '@layouts/stores/config'

export const resolveVuetifyTheme = (defaultTheme: LiteralUnion<'light' | 'dark' | 'system', string>): 'light' | 'dark' => {
  const cookieColorScheme = useLocalStorageRef<'light' | 'dark'>('color-scheme', usePreferredDark().value ? 'dark' : 'light')
  const storedTheme = useLocalStorageRef('theme', defaultTheme).value

  return storedTheme === 'system'
    ? cookieColorScheme.value === 'dark'
      ? 'dark'
      : 'light'
    : storedTheme as 'light' | 'dark'
}
