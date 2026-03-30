<template>
  <div class="translate-container">
    <VSelect
      v-model="selectedLanguageCode"
      :items="languages"
      item-title="name"
      item-value="code"
      rounded="pill"
      color="indigo"
      class="custom-select"
      @update:model-value="forceTranslate"
    >
      <template #prepend-inner>
        <v-icon icon="tabler-language" color="indigo-accent-3" />
      </template>
    </VSelect>

    <!-- <div id="google_translate_element" class="hidden-bridge"></div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const selectedLanguageCode = ref('');

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'sw', name: 'Swahili' },
  { code: 'lg', name: 'Luganda' },
  { code: 'ar', name: 'Arabic' }
];

// 🔥 FORCE GOOGLE TRANSLATE USING COOKIE + RELOAD
const forceTranslate = (langCode) => {
  if (!langCode) return;

  const sourceLang = 'en';

  // 1. Set Google translate cookie
  document.cookie = `googtrans=/${sourceLang}/${langCode};path=/`;

  // Optional for some browsers
  document.cookie = `googtrans=/${sourceLang}/${langCode};domain=${location.hostname};path=/`;

  console.log(`Language set → ${langCode}. Reloading...`);

  // 2. Reload page to apply translation
  window.location.reload();
};

onMounted(() => {
  // Prevent loading script multiple times
  if (window.google && window.google.translate) return;

  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement({
      pageLanguage: 'en',
      autoDisplay: false
    }, 'google_translate_element');
  };

  const script = document.createElement('script');
  script.src ='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);
});
</script>

<style scoped>
.translate-container {
  width: 150px;
}

/* IMPORTANT: Do not use display: none. 
   Google script checks visibility before initializing.
*/
.hidden-bridge {
  position: fixed;
  top: -100px;
  left: 0;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
  height: 0;
  width: 0;
}

/* UI Polishing */
:deep(.custom-select .v-field) {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
}

/* Clean up Google's "Top Bar" injection */
:global(.skiptranslate) {
  display: none !important;
}
:global(body) {
  top: 0 !important;
  position: static !important;
}
</style>
