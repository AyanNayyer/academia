import { Tolgee, DevTools, VueTolgee, FormatSimple, BackendFetch, LanguageDetector } from '@tolgee/vue';

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .use(BackendFetch({ prefix: 'https://cdn.tolg.ee/8e58922050eadaafbb2bf6a8606f8ba0'}))
  .use(LanguageDetector())
  .init({
    //language: 'en',
    defaultLanguage: 'en',
    fallbackLanguage: 'en',
    availableLanguages: ['en', 'hi'],
    // apiUrl: import.meta.env.VITE_APP_TOLGEE_API_URL, // Tolgee CDN link
    // apiKey: import.meta.env.VITE_APP_TOLGEE_API_KEY
  });

export { tolgee, VueTolgee }; 