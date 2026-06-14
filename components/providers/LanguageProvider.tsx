'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Language } from '@/types'

const STORAGE_KEY = 'preferred_language'
const DEFAULT_LANG: Language = 'id'

type Translations = Record<string, unknown>

// Module-level cache so switching back to a loaded language is instant.
const cache: Partial<Record<Language, Translations>> = {}

async function loadTranslations(lang: Language): Promise<Translations> {
  if (cache[lang]) return cache[lang]!
  const res = await fetch(`/locales/${lang}.json`)
  const data = (await res.json()) as Translations
  cache[lang] = data
  return data
}

function getNested(obj: Translations, path: string): unknown {
  let current: unknown = obj
  for (const key of path.split('.')) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  /** Returns a string translation, or `fallback` when missing (used for SSR/first paint). */
  t: (key: string, fallback?: string) => string
  /** Returns a raw nested value (array/object), or `fallback` when missing. */
  tr: <T>(key: string, fallback: T) => T
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(DEFAULT_LANG)
  const [translations, setTranslations] = useState<Translations>({})

  // Hydrate saved preference on mount.
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Language) || DEFAULT_LANG
    setLangState(saved)
    document.documentElement.lang = saved
    loadTranslations(saved).then(setTranslations)
  }, [])

  const setLang = useCallback((newLang: Language) => {
    localStorage.setItem(STORAGE_KEY, newLang)
    document.documentElement.lang = newLang
    setLangState(newLang)
    loadTranslations(newLang).then(setTranslations)
  }, [])

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const value = getNested(translations, key)
      return typeof value === 'string' ? value : (fallback ?? key)
    },
    [translations]
  )

  const tr = useCallback(
    <T,>(key: string, fallback: T): T => {
      const value = getNested(translations, key)
      return value === undefined || value === null ? fallback : (value as T)
    },
    [translations]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tr }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
