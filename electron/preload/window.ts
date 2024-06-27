const MINUS = document.getElementById('minimize-app')
const CLOSE = document.getElementById('close-app')

MINUS.addEventListener('click', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  window.ipcRenderer.minimize()
})

CLOSE.addEventListener('click', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  window.ipcRenderer.close()
})
