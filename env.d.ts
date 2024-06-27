/// <reference types="vite/client" />
import 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_SOFTWARE: string
  readonly VITE_API: string
  readonly VITE_LOGO: string
  readonly VITE_COR_PRIMARY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'vue-router' {
  interface RouteMeta {
    action?: string
    subject?: string
    layoutWrapperClasses?: string
    navActiveLink?: RouteLocationRaw
    layout?: 'blank' | 'default'
    unauthenticatedOnly?: boolean
    public?: boolean
  }
}
