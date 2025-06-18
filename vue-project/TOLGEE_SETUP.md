# Tolgee Localization Setup Guide

## Overview
This project has been integrated with Tolgee for internationalization (i18n). Tolgee provides a powerful platform for managing translations and localizing your Vue.js application.

## Setup Instructions

### 1. Install Dependencies
The Tolgee Vue package has already been installed:
```bash
npm install @tolgee/vue
```

### 2. Environment Configuration
Create a `.env` file in the `vue-project` directory with your Tolgee API credentials:

```env
VITE_APP_TOLGEE_API_URL=https://app.tolgee.io
VITE_APP_TOLGEE_API_KEY=your_actual_tolgee_api_key_here
```

**Important:** Replace `your_actual_tolgee_api_key_here` with your real Tolgee API key from the Tolgee dashboard.

### 3. Project Structure
The following files have been created/modified for Tolgee integration:

- `src/tolgee.js` - Tolgee configuration
- `src/translations/en.json` - English translations
- `src/translations/hi.json` - Hindi translations
- `src/components/LanguageSwitcher.vue` - Language switcher component
- `src/main.js` - Updated to include Tolgee provider
- `src/App.vue` - Updated to wrap with TolgeeProvider
- `src/views/StudentDashboard.vue` - Updated to use translations

### 4. How to Use Translations

#### In Templates
Use the `$t()` function to access translations:
```vue
<template>
  <h1>{{ $t('dashboard.welcome') }}</h1>
  <p>{{ $t('dashboard.stats.next_in_days', { days: 5 }) }}</p>
</template>
```

#### In Scripts
Use the `useTolgee()` composable:
```vue
<script>
import { useTolgee } from '@tolgee/vue';

export default {
  setup() {
    const { t, changeLanguage, getLanguage } = useTolgee();
    
    return {
      message: t('dashboard.welcome'),
      changeLanguage,
      getLanguage
    };
  }
}
</script>
```

### 5. Adding New Languages

1. Create new translation files in `src/translations/`:
   - `es.json` for Spanish
   - `fr.json` for French
   - `de.json` for German

2. Update the `tolgee.js` configuration to include the new languages:
```javascript
import enTranslations from './translations/en.json';
import esTranslations from './translations/es.json';

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .init({
    language: 'en',
    apiUrl: import.meta.env.VITE_APP_TOLGEE_API_URL,
    apiKey: import.meta.env.VITE_APP_TOLGEE_API_KEY,
    staticData: {
      en: enTranslations,
      es: esTranslations
    }
  });
```

3. Update the `LanguageSwitcher.vue` component to include the new language options.

### 6. Tolgee Dashboard Integration

1. Go to [Tolgee Dashboard](https://app.tolgee.io)
2. Create a new project or use an existing one
3. Add your translations to the Tolgee dashboard
4. Use the API key from your project settings in the `.env` file

### 7. Development vs Production

- **Development**: Uses static translations from JSON files for faster development
- **Production**: Can use Tolgee API for dynamic translations and over-the-air updates

### 8. Translation Keys Structure

The translation keys follow a hierarchical structure:
```
dashboard/
├── welcome
├── logout
├── stats/
│   ├── current_cgpa
│   ├── upcoming_deadlines
│   └── ...
├── ai_assistants/
│   ├── handbook_assistant
│   ├── features/
│   │   ├── rag_powered/
│   │   │   ├── title
│   │   │   └── description
│   │   └── ...
└── ...
```

### 9. Testing the Integration

1. Start the development server:
```bash
npm run dev
```

2. Navigate to the student dashboard
3. Use the language switcher in the top-right corner to test different languages
4. Verify that all text is properly translated

### 10. Troubleshooting

- **Translations not showing**: Check that the translation keys exist in your JSON files
- **API errors**: Verify your Tolgee API key and URL in the `.env` file
- **Language not switching**: Ensure the language is supported in your `staticData` configuration

## Additional Resources

- [Tolgee Vue Documentation](https://tolgee.io/docs/integrations/vue)
- [Tolgee Dashboard](https://app.tolgee.io)
- [Vue.js Internationalization Guide](https://vuejs.org/guide/best-practices/production-deployment.html#internationalization)

### 6. Supported Languages

Currently supported languages:
- **English (en)** - Default language
- **Hindi (hi)** - हिंदी - Complete translations available
- **Spanish (es)** - Placeholder (add translations as needed)
- **French (fr)** - Placeholder (add translations as needed)
- **German (de)** - Placeholder (add translations as needed) 