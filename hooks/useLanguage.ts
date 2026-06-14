// Re-export from the provider so existing `@/hooks/useLanguage` imports keep working.
// Language state is shared via React Context (see LanguageProvider) so the ID/EN
// toggle updates every component at once.
export { useLanguage, LanguageProvider } from '@/components/providers/LanguageProvider'
