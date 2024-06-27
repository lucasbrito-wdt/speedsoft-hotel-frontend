import { defineStore } from 'pinia'

export const useSnackBarStore = defineStore('SnackBar', {
  state: () => ({
    show: false,
    color: '',
    text: '',
  }),
  actions: {
    showSnackBar(color: string, text: string) {
      this.show = true
      this.color = color
      this.text = text
    },
    hideSnackBar() {
      this.show = false
    },
  },
})
