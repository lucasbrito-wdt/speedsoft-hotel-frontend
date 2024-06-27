import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { themeConfig } from '@themeConfig'
import {useLocalStorageRef} from "@layouts/stores/config";

const unifyTranslations = (arr1: TranslationPair[], arr2: TranslationPair[]): TranslationPair[] => {
  const unified: TranslationPair[] = []

  const mergedTranslations: Map<Language, Translation> = new Map()

  // Add translations from array1 to the map
  for (const [lang, translation] of arr1)
    mergedTranslations.set(lang, translation)

  // Merge translations from array2 into the map
  for (const [lang, translation] of arr2) {
    const existingTranslation = mergedTranslations.get(lang)
    if (existingTranslation) {
      // If translation for the language already exists, merge it with the new one
      mergedTranslations.set(lang, { ...existingTranslation, ...translation })
    }
    else {
      // If translation for the language doesn't exist, add it to the map
      mergedTranslations.set(lang, translation)
    }
  }

  // Convert the map back to an array
  mergedTranslations.forEach((translation, lang) => {
    unified.push([lang, translation])
  })

  return unified
}

const genericMessages = Object.entries(
  import.meta.glob<{ default: any }>('./locales/*.json', { eager: true }))
  .map(([key, value]) => [key.slice(10, -5), value.default])

const crudsMessages = Object.entries(
  import.meta.glob<{ default: any }>('../../pages/**/locales/*.json', { eager: true }))
  .map(([key, value]) => [key.split('/').reverse()[0].replace('.json', ''), value.default])

const messagesArray: TranslationPair[] = unifyTranslations(genericMessages, crudsMessages)

const messages = Object.fromEntries(messagesArray)

let _i18n: any = null

type Language = 'en' | 'es' | 'pt_BR'

interface Translation {
  [key: string]: string | Translation
}

type TranslationPair = [Language, Translation]

export const getI18n = () => {
  if (_i18n === null) {
    _i18n = createI18n({
      legacy: false,
      locale: useLocalStorageRef('language', themeConfig.app.i18n.defaultLocale).value,
      fallbackLocale: 'pt_BR',
      messages,
    })
  }

  return _i18n
}

export default function (app: App) {
  app.use(getI18n())
}
