<script setup>
import navItems from '@/navigation/vertical'
import { themeConfig } from '@themeConfig'

import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import GoogleLanguageSwitcher from '@/layouts/components/GoogleLanguageSwitcher.vue'

import UserProfile from '@/layouts/components/UserProfile.vue'

import { VerticalNavLayout } from '@layouts'

const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref(null)
const userData = JSON.parse(localStorage.getItem("user"));

watch([
  isFallbackStateActive,
  refLoadingIndicator,
], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()
  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })
// !SECTION
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn id="vertical-nav-toggle-btn" class="ms-n3 d-lg-none" @click="toggleVerticalOverlayNavActive(true)" >
          <VIcon size="26" icon="tabler-menu-2" />
        </IconBtn>
        <div>
          <span class="h3"><b>{{ userData.business }}</b></span> <br>
          <small class="h6">{{ userData.location }} | {{ userData.contact }}</small>
        </div>
        <VSpacer />
        <!-- <NavSearchBar class="ms-lg-n3" /> -->
        <VSpacer />
        <GoogleLanguageSwitcher />
        <NavbarThemeSwitcher />
        <UserProfile />
      </div>
    </template>

    <AppLoadingIndicator ref="refLoadingIndicator" />

    <RouterView v-slot="{ Component }">
      <Suspense
        :timeout="0"
        @fallback="isFallbackStateActive = true"
        @resolve="isFallbackStateActive = false"
      >
        <Component :is="Component" />
      </Suspense>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>
