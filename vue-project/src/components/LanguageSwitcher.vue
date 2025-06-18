<template>
  <div class="language-switcher">
    <select :value="currentLang" @change="changeLanguage" class="language-select">
      <option value="en">English</option>
      <option value="hi">हिंदी</option>
    </select>
  </div>
</template>

<script setup>
import { useTolgee } from '@tolgee/vue';

const tolgee = useTolgee(['language']); // 🔑 subscribe to language
const currentLang = tolgee.value.getLanguage();

function changeLanguage(e) {
  tolgee.value.changeLanguage(e.target.value);
}
</script>

<style scoped>
.language-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
.language-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}
.language-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
</style>
  