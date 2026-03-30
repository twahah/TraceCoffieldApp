<script setup>
import axios from 'axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { themeConfig } from '@themeConfig'
import bannerImg from '@images/bana.png'
import logoImg from '@images/logo.png'
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'

const email = ref('')
const verificationCode = ref(['', '', '', '', '', ''])
const isLoading = ref(false)
const isCodeComplete = computed(() => verificationCode.value.every(digit => digit !== ''))
const errorMessage = ref('')
const resendCountdown = ref(0)
const showSuccess = ref(false)

const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

onMounted(() => {
  email.value = window.localStorage.getItem('email') || ''
  startCountdown()
})

const startCountdown = () => {
  resendCountdown.value = 30
  const interval = setInterval(() => {
    if (resendCountdown.value > 0) {
      resendCountdown.value--
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

const handleInput = (index, event) => {
  const value = event.target.value
  if (!/^\d*$/.test(value)) {
    event.target.value = verificationCode.value[index]
    return
  }
  verificationCode.value[index] = value
  if (value && index < 5) {
    const nextInput = document.querySelector(`input[data-index="${index + 1}"]`)
    if (nextInput) nextInput.focus()
  }
}

const handleKeyDown = (index, event) => {
  if (event.key === 'Backspace' && !verificationCode.value[index] && index > 0) {
    event.preventDefault()
    verificationCode.value[index - 1] = ''
    const prevInput = document.querySelector(`input[data-index="${index - 1}"]`)
    if (prevInput) prevInput.focus()
  }
  if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    navigator.clipboard.readText().then(text => {
      const digits = text.replace(/\D/g, '').split('').slice(0, 6)
      digits.forEach((digit, idx) => {
        if (idx < 6) verificationCode.value[idx] = digit
      })
      const lastIndex = Math.min(digits.length - 1, 5)
      const targetInput = document.querySelector(`input[data-index="${lastIndex}"]`)
      if (targetInput) targetInput.focus()
    })
  }
}

const router = useRouter()

const submitVerification = async () => {
  if (!isCodeComplete.value || !email.value) return
  isLoading.value = true
  errorMessage.value = ''
  const code = verificationCode.value.join('')
  let formData = new FormData()
  formData.append("email", email.value)
  formData.append("code", code)
  try {
    const response = await axios.post("/verify", formData)
    if (response.data.status == '200') {
      showSuccess.value = true
      setTimeout(() => {
        let userData = response.data.user
        let token = response.data.token
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token)
        router.push('/newdelivery')
      }, 1500)
    } else {
      errorMessage.value = response.data.message || 'Verification failed'
      shakeCodeInputs()
    }
  } catch (error) {
    errorMessage.value = 'An error occurred. Please try again.'
    shakeCodeInputs()
  } finally {
    isLoading.value = false
  }
}

const shakeCodeInputs = () => {
  const inputs = document.querySelectorAll('.code-input')
  inputs.forEach(input => {
    input.classList.add('shake')
    setTimeout(() => input.classList.remove('shake'), 500)
  })
}

const resendCode = async () => {
  if (!email.value || resendCountdown.value > 0) return
  try {
    await axios.post('/resend-code', { email: email.value })
    startCountdown()
  } catch (error) {
    errorMessage.value = 'Failed to resend code. Please try again.'
  }
}
</script>

<template>
  <div class="verify-root">

    <!-- Bean pattern bg -->
    <div class="bean-bg" aria-hidden="true" />

    <!-- Left decorative panel -->
    <div class="left-panel">
      <VImg :src="bannerImg" cover class="left-img" />
      <div class="left-scrim" />
      <div class="left-content">
        <div class="brand-row">
          <div class="brand-icon"><VImg :src="logoImg" width="56" /></div>
          <span class="brand-name"><em>Trace</em>Coffield</span>
        </div>
        <div class="left-mid">
          <div class="left-tag">🔐 Two-Factor Verification</div>
          <h2 class="left-headline">One step away<br>from the <span class="accent">field.</span></h2>
          <p class="left-body">Your account is protected with email verification. Enter the code we sent to confirm your identity.</p>
        </div>

        <!-- Decorative code preview -->
        <div class="code-preview-card">
          <div class="preview-header">
            <span class="preview-dot green" />
            <span class="preview-dot yellow" />
            <span class="preview-dot red" />
            <span class="preview-title">verification_code.txt</span>
          </div>
          <div class="preview-body">
            <div class="preview-line">
              <span class="preview-key">to:</span>
              <span class="preview-val email-val">{{ email || 'officer@coffield.ug' }}</span>
            </div>
            <div class="preview-line">
              <span class="preview-key">code:</span>
              <span class="preview-val code-val">
                <span
                  v-for="(d, i) in verificationCode"
                  :key="i"
                  class="code-preview-digit"
                  :class="{ filled: d !== '' }"
                >{{ d || '·' }}</span>
              </span>
            </div>
            <div class="preview-line">
              <span class="preview-key">expires:</span>
              <span class="preview-val">10 minutes</span>
            </div>
            <div class="preview-line">
              <span class="preview-key">status:</span>
              <span class="preview-val status-val" :class="{ success: showSuccess, pending: !showSuccess }">
                {{ showSuccess ? '✓ verified' : '⏳ awaiting input' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="right-panel">
      <div class="right-accent" aria-hidden="true" />

      <!-- Success overlay -->
      <transition name="success-fade">
        <div v-if="showSuccess" class="success-overlay">
          <div class="success-blob" />
          <div class="success-content">
            <div class="success-ring">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#2d6a4f"/>
                <path d="M7 12L10.5 15.5L17 9" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="success-title">Verified!</h3>
            <p class="success-sub">Redirecting to your dashboard…</p>
            <div class="success-loader">
              <div class="success-loader-bar" />
            </div>
          </div>
        </div>
      </transition>

      <div class="form-shell">

        <!-- Mobile logo -->
        <div class="mobile-logo">
          <VImg :src="logoImg" width="48" class="mobile-logo-img" />
          <div>
            <div class="mobile-brand"><em>Trace</em>Coffield</div>
            <div class="mobile-sub">Field Officer Platform</div>
          </div>
        </div>

        <!-- Header -->
        <div class="form-header">
          <div class="header-icon-wrap">
            <span class="header-icon">✉️</span>
          </div>
          <h1 class="form-title">Check your email</h1>
          <p class="form-sub">We sent a 6-digit code to</p>
          <div class="email-chip">
            <span class="email-chip-dot" />
            <span class="email-chip-text">{{ email }}</span>
          </div>
        </div>

        <!-- Error -->
        <transition name="slide-alert">
          <div v-if="errorMessage" class="error-pill">
            <span class="error-icon">⚠</span>
            <span>{{ errorMessage }}</span>
            <button class="error-close" @click="errorMessage = ''">✕</button>
          </div>
        </transition>

        <!-- OTP inputs -->
        <VForm @submit.prevent="submitVerification">
          <div class="otp-section">
            <label class="otp-label">Enter verification code</label>
            <div class="otp-row">
              <div
                v-for="(digit, index) in verificationCode"
                :key="index"
                class="otp-cell"
                :class="{ active: digit !== '', error: errorMessage }"
              >
                <input
                  :data-index="index"
                  v-model="verificationCode[index]"
                  @input="handleInput(index, $event)"
                  @keydown="handleKeyDown(index, $event)"
                  class="code-input"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  :disabled="isLoading"
                  :aria-label="`Digit ${index + 1}`"
                />
              </div>
            </div>
            <div class="otp-hint">Tip: You can paste a copied code directly</div>
          </div>

          <!-- Verify button -->
          <button
            type="submit"
            class="verify-btn"
            :class="{ loading: isLoading, complete: isCodeComplete && !isLoading }"
            :disabled="!isCodeComplete || isLoading"
          >
            <span v-if="!isLoading" class="verify-btn-inner">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              Verify Code
            </span>
            <span v-else class="btn-spinner" />
          </button>

          <!-- Resend -->
          <div class="resend-row">
            <span class="resend-text">Didn't get it?</span>
            <button
              type="button"
              class="resend-btn"
              @click="resendCode"
              :disabled="resendCountdown > 0 || !email || isLoading"
            >
              <span v-if="resendCountdown > 0">Resend in {{ resendCountdown }}s</span>
              <span v-else>Resend Code</span>
            </button>
          </div>

          <!-- Security notice -->
          <div class="security-row">
            <span class="security-icon">🔒</span>
            <span class="security-text">This code expires in <strong>10 minutes</strong></span>
          </div>

          <!-- Back to login -->
          <RouterLink :to="{ name: 'login' }" class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
            Back to login
          </RouterLink>
        </VForm>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

/* ── TOKENS ── */
$green-dark:  #1b4332;
$green-mid:   #2d6a4f;
$green-main:  #4a7c59;
$green-light: #74b88a;
$green-pale:  #d4edda;
$brown-dark:  #3d2008;
$brown-mid:   #6b4226;
$cream:       #faf6f0;
$text-dark:   #1a120b;
$text-mid:    #4a4035;
$text-light:  #7a6f65;

/* ── ROOT ── */
.verify-root {
  position: relative;
  display: flex;
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
  background: $cream;
  overflow: hidden;
}

.bean-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.025;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cellipse cx='40' cy='40' rx='22' ry='13' fill='%234a7c59' transform='rotate(-30 40 40)'/%3E%3Cpath d='M40 27 Q40 40 40 53' stroke='%23fff' stroke-width='2.5' fill='none'/%3E%3C/svg%3E");
  background-size: 80px 80px;
}

/* ── LEFT PANEL ── */
.left-panel {
  position: relative;
  flex: 0 0 52%;
  overflow: hidden;
  display: none;
  @media (min-width: 960px) { display: flex; }
}

.left-img {
  position: absolute !important;
  inset: 0;
  z-index: 0;
}

.left-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(150deg,
    rgba(27, 67, 50, 0.88) 0%,
    rgba(45, 106, 79, 0.65) 45%,
    rgba(61, 32, 8, 0.80) 100%
  );
}

.left-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 44px 52px 48px;
  width: 100%;
  color: white;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
}
.brand-name {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 22px;
  font-weight: 700;
  em { font-style: normal; color: $green-light; }
}

.left-mid {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px 0 36px;
}

.left-tag {
  display: inline-block;
  width: fit-content;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: rgba(255,255,255,0.85);
  margin-bottom: 5px;
}

.left-headline {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 40px;
  font-weight: 600;
  line-height: 1.15;
  color: white;
  margin-bottom: 10px;
}
.accent { color: $green-light; font-style: italic; }

.left-body {
  color: rgba(255,255,255,0.7);
  font-size: 15px;
  line-height: 1.65;
  max-width: 380px;
}

/* Code preview card */
.code-preview-card {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
  max-width: 340px;
  animation: floatCard 6s ease-in-out infinite;
}
@keyframes floatCard {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.45);
  padding: 10px 16px;
}
.preview-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  &.green  { background: #3dd68c; }
  &.yellow { background: #f4d03f; }
  &.red    { background: #e74c3c; }
}
.preview-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  margin-left: 6px;
}

.preview-body {
  background: rgba(10,30,20,0.75);
  backdrop-filter: blur(10px);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.preview-line {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}
.preview-key { color: $green-light; min-width: 60px; }
.preview-val { color: rgba(255,255,255,0.8); }
.email-val { color: #93c5fd; font-size: 11px; }
.code-val { display: flex; gap: 4px; }

.code-preview-digit {
  width: 16px;
  text-align: center;
  color: rgba(255,255,255,0.3);
  font-weight: 600;
  transition: all 0.2s;
  &.filled { color: $green-light; }
}

.status-val {
  font-size: 11px;
  &.pending { color: #f4d03f; }
  &.success { color: #3dd68c; }
}

/* ── RIGHT PANEL ── */
.right-panel {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 28px;
  background: $cream;
  overflow: hidden;
}

.right-accent {
  position: absolute;
  top: -140px; right: -140px;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(74,124,89,0.07) 0%, transparent 70%);
  pointer-events: none;
}

/* ── FORM SHELL ── */
.form-shell {
  position: relative;
  width: 100%;
  max-width: 420px;
  animation: fadeInUp 0.6s ease both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Mobile logo */
.mobile-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 40px;
  @media (min-width: 960px) { display: none; }
}
.mobile-logo-img { border-radius: 10px; }
.mobile-brand {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: $text-dark;
  em { font-style: normal; color: $green-mid; }
}
.mobile-sub {
  font-size: 11px;
  color: $text-light;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 2px;
}

/* Header */
.form-header {
  text-align: center;
  margin-bottom: 28px;
}

.header-icon-wrap {
  width: 50px; height: 50px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(74,124,89,0.12), rgba(107,66,38,0.08));
  border: 1px solid rgba(74,124,89,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 18px;
}

.form-title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: $text-dark;
  line-height: 1.1;
  margin-bottom: 8px;
}
.form-sub {
  font-size: 14px;
  color: $text-light;
  margin-bottom: 10px;
}

.email-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1.5px solid rgba(74,124,89,0.2);
  border-radius: 30px;
  padding: 7px 18px;
  box-shadow: 0 2px 8px rgba(27,67,50,0.06);
}
.email-chip-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: $green-main;
  animation: blink 2s infinite;
  flex-shrink: 0;
}
@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
.email-chip-text {
  font-size: 14px;
  font-weight: 600;
  color: $text-dark;
}

/* Error pill */
.error-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff0ee;
  border: 1px solid #f5c2be;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #c0392b;
}
.error-icon { font-size: 15px; flex-shrink: 0; }
.error-close {
  margin-left: auto;
  border: none; background: none;
  cursor: pointer; color: #c0392b;
  font-size: 13px; padding: 0;
}
.slide-alert-enter-active, .slide-alert-leave-active { transition: all 0.3s ease; }
.slide-alert-enter-from, .slide-alert-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── OTP ── */
.otp-section { margin-bottom: 24px; }

.otp-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: $text-mid;
  letter-spacing: 0.03em;
  text-align: center;
  margin-bottom: 16px;
}

.otp-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.otp-cell {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 100%; height: 2px;
    background: $green-main;
    border-radius: 1px;
    transform: scaleX(0);
    transition: transform 0.25s ease;
  }

  &.active::after { transform: scaleX(1); }
  &.error::after  { background: #e74c3c; transform: scaleX(1); }
}

.code-input {
  width: 52px;
  height: 58px;
  border: 1.5px solid rgba(74,124,89,0.2);
  border-radius: 12px;
  background: white;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  color: $text-dark;
  outline: none;
  transition: all 0.2s ease;
  caret-color: $green-main;
  box-shadow: 0 2px 6px rgba(27,67,50,0.05);

  &:focus {
    border-color: $green-main;
    box-shadow: 0 0 0 3px rgba(74,124,89,0.13), 0 2px 6px rgba(27,67,50,0.08);
    transform: translateY(-2px);
  }

  &:not(:placeholder-shown) {
    border-color: rgba(74,124,89,0.45);
    background: linear-gradient(135deg, #f0f9f3, #fafcfb);
    color: $green-dark;
  }

  &:disabled {
    background: #f5f5f5;
    color: #aaa;
    cursor: not-allowed;
  }

  &.shake {
    animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both;
    border-color: #e74c3c !important;
    background: #fff5f5 !important;
  }
}

@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-3px); }
  40%, 60% { transform: translateX(3px); }
}

.otp-hint {
  text-align: center;
  font-size: 12px;
  color: $text-light;
  margin-top: 10px;
}

/* ── VERIFY BUTTON ── */
.verify-btn {
  width: 100%;
  padding: 15px 28px;
  border-radius: 14px;
  border: none;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #c9d0cc 0%, #b0b8b4 100%);
  color: #888;
  box-shadow: none;
  margin-bottom: 18px;

  &.complete {
    background: linear-gradient(135deg, $green-mid 0%, $green-main 100%);
    color: white;
    box-shadow: 0 6px 22px rgba(45,106,79,0.35);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(45,106,79,0.45);
    }
  }

  &:disabled { cursor: not-allowed; }

  &:active:not(:disabled) { transform: translateY(0) !important; }
}

.verify-btn-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-spinner {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── RESEND ── */
.resend-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}
.resend-text { font-size: 14px; color: $text-light; }
.resend-btn {
  border: none;
  background: none;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: $green-mid;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(74,124,89,0.08);
    color: $green-dark;
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

/* ── SECURITY + BACK ── */
.security-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border: 1px solid rgba(74,124,89,0.12);
  border-radius: 10px;
}
.security-icon { font-size: 15px; }
.security-text { font-size: 13px; color: $text-light; }
.security-text strong { color: $text-mid; }

.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: $green-mid;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.2s;
  border-top: 1px solid rgba(74,124,89,0.1);
  padding-top: 18px;

  &:hover {
    color: $green-dark;
    background: rgba(74,124,89,0.05);
  }
}

/* ── SUCCESS OVERLAY ── */
.success-overlay {
  position: absolute;
  inset: 0;
  background: rgba(250,246,240,0.96);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  border-radius: 20px;
}

.success-blob {
  position: absolute;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(74,124,89,0.12) 0%, transparent 70%);
  pointer-events: none;
}

.success-content {
  text-align: center;
  animation: scaleIn 0.5s ease both;
}
.success-ring {
  margin-bottom: 20px;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both;
}
.success-title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: $green-dark;
  margin-bottom: 8px;
}
.success-sub { font-size: 14px; color: $text-light; margin-bottom: 20px; }

.success-loader {
  width: 180px;
  height: 4px;
  background: $green-pale;
  border-radius: 2px;
  margin: 0 auto;
  overflow: hidden;
}
.success-loader-bar {
  height: 100%;
  background: linear-gradient(90deg, $green-mid, $green-light);
  border-radius: 2px;
  animation: progressBar 1.5s ease forwards;
}
@keyframes progressBar { from { width: 0; } to { width: 100%; } }

.success-fade-enter-active, .success-fade-leave-active { transition: opacity 0.3s ease; }
.success-fade-enter-from, .success-fade-leave-to { opacity: 0; }

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes popIn {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

/* ── RESPONSIVE ── */
@media (max-width: 960px) {
  .verify-root { flex-direction: column; }
  .right-panel { padding: 48px 24px; }
  .mobile-logo { display: flex !important; }
}

@media (max-width: 480px) {
  .otp-row { gap: 7px; }
  .code-input { width: 44px; height: 52px; font-size: 20px; }
}
</style>
