import { computed, ref } from 'vue'
import { useConfigStore } from '@core/stores/config'

export const useGenerateVariant = (imgLight: string, imgDark: string) => {
  const configThemeStore = useConfigStore()

  const theme = ref<string>('light')

  configThemeStore.$subscribe((mutation, state) => {
    theme.value = state.theme
  })

  // eslint-disable-next-line vue/return-in-computed-property
  return computed(() => {
    if (theme.value === 'light')
      return imgLight

    if (theme.value === 'dark')
      return imgDark
  })
}
