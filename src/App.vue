<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@layouts/utils'
import { useRouter } from 'vue-router'

import axios from "axios";
axios.defaults.baseURL = 'https://tracecoffieldapi.toutestgrace.net/api';

const router = useRouter()
const token = localStorage.getItem("token")

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
} else {
  axios.defaults.headers.common["Authorization"] = ""
}

// ---- Snackbar state ----
const showSnackbar = ref(false)
const snackbarMessage = ref("")

// ---- Axios response interceptor ----
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Show toast
      snackbarMessage.value = "Session expired. Please log in again."
      showSnackbar.value = true

      // Wait 1.5s before logging out so user can see the message
      setTimeout(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
      }, 1500)
    }
    return Promise.reject(error)
  }
)
// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()
const configStore = useConfigStore()
</script>

<template>
  <VApp>
    <RouterView />
    <ScrollToTop />

    <!-- Snackbar -->
    <VSnackbar v-model="showSnackbar" :timeout="1500" location="top">
      {{ snackbarMessage }}
    </VSnackbar>
  </VApp>
</template>
