<script setup>
import axios from "axios"
import { VForm } from 'vuetify/components/VForm'
import bannerImg from '@images/bana.png'
import logoImg from '@images/logo.png'
import { themeConfig } from '@themeConfig'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const isPasswordVisible = ref(false)
const router = useRouter()
const refVForm = ref()
const loader = ref(false)
const loginerror = ref("")
const rememberMe = ref(false)

const credentials = ref({
  username: '',
  password: '',
})

const signin = async () => {
  loader.value = true
  let formData = new FormData()
  formData.append("username", credentials.value.username)
  formData.append("password", credentials.value.password)

  try {
    const response = await axios.post("/login", formData)
    if (response.status == 200) {
      localStorage.setItem('email', response.data.email)
      router.push('/verify')
    }
  } catch (error) {
    loginerror.value = error.response?.data?.message || "Invalid credentials"
  } finally {
    loader.value = false
  }
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) signin()
  })
}
</script>

<template>
  <div class="auth-root">

    <!-- ── Left panel: decorative ── -->
    <div class="left-panel">
      <!-- Coffee bean pattern overlay -->
      <div class="bean-pattern" aria-hidden="true" />

      <!-- Banner image fills left panel -->
      <VImg :src="bannerImg" cover class="left-bg" />

      <!-- Gradient scrim -->
      <div class="left-scrim" />

      <!-- Content over image -->
      <div class="left-content">
        <div class="left-logo-row">
          <div class="left-logo-icon"><VImg :src="logoImg" width="60" /></div>
          <span class="left-logo-text"><em>Trace</em>Coffield</span>
        </div>

        <div class="left-body">
          <div class="left-tag">Field Officer Platform</div>
          <h2 class="left-headline">
            Finance &amp; Map<br>Coffee Farms<br>
            <span class="left-headline-accent">From the Field.</span>
          </h2>
          <p class="left-sub">
            Draw farm polygons, disburse harvest advance loans,
            and track cherry deliveries — all from one app.
          </p>

          <div class="left-stats">
            <div class="stat">
              <span class="stat-val">3,200+</span>
              <span class="stat-lbl">Farmers</span>
            </div>
            <div class="stat-divider" />
            <div class="stat">
              <span class="stat-val">18.5k</span>
              <span class="stat-lbl">Acres Mapped</span>
            </div>
            <div class="stat-divider" />
            <div class="stat">
              <span class="stat-val">98%</span>
              <span class="stat-lbl">Repayment</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Right panel: form ── -->
    <div class="right-panel">
      <!-- Subtle top-right bean accent -->
      <div class="right-accent" aria-hidden="true" />

      <div class="form-shell">

        <!-- Logo mark for mobile / standalone -->
        <div class="form-logo">
          <VImg :src="logoImg" width="56" class="form-logo-img" />
          <div>
            <div class="form-brand"><em>Trace</em>Coffield</div>
            <div class="form-brand-sub">Field Officer Platform</div>
          </div>
        </div>

        <div class="form-head">
          <h1 class="form-title">Welcome back</h1>
          <p class="form-sub">Sign in to your field officer account</p>
        </div>

        <!-- Error alert -->
        <transition name="slide-alert">
          <div v-if="loginerror" class="error-pill">
            <span class="error-icon">⚠</span>
            <span>{{ loginerror }}</span>
            <button class="error-close" @click="loginerror = ''">✕</button>
          </div>
        </transition>

        <VForm ref="refVForm" @submit.prevent="onSubmit" class="form-body">

          <!-- Username -->
          <div class="field-group">
            <label class="field-label">Username or Email</label>
            <div class="field-wrap">
              <span class="field-icon">👤</span>
              <AppTextField
                v-model="credentials.username"
                placeholder="e.g. jmuwonge"
                autofocus
                :rules="[requiredValidator]"
                class="custom-field"
                hide-details="auto"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="field-group">
            <div class="field-label-row">
              <label class="field-label">Password</label>
              <a href="javascript:void(0)" class="forgot-link">Forgot password?</a>
            </div>
            <div class="field-wrap">
              <span class="field-icon">🔒</span>
              <AppTextField
                v-model="credentials.password"
                :type="isPasswordVisible ? 'text' : 'password'"
                placeholder="············"
                :rules="[requiredValidator]"
                :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                class="custom-field"
                hide-details="auto"
              />
            </div>
          </div>

          <!-- Remember me -->
          <div class="remember-row">
            <label class="remember-label">
              <input type="checkbox" v-model="rememberMe" class="remember-check" />
              <span class="remember-box" :class="{ checked: rememberMe }">
                <span v-if="rememberMe" class="check-tick">✓</span>
              </span>
              <span class="remember-text">Keep me signed in</span>
            </label>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="sign-in-btn"
            :class="{ loading: loader }"
            :disabled="loader"
          >
            <span v-if="!loader" class="btn-label">
              Sign In <span class="btn-arrow">→</span>
            </span>
            <span v-else class="btn-spinner" />
          </button>

        </VForm>

        <div class="form-footer">
          <span>Not a field officer yet?</span>
          <a href="javascript:void(0)" class="back-home" @click="router.push('/')">← Back to Home</a>
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;600&display=swap');

/* ── TOKENS ── */
$green-dark:  #1b4332;
$green-mid:   #2d6a4f;
$green-main:  #4a7c59;
$green-light: #74b88a;
$green-pale:  #d4edda;
$brown-dark:  #3d2008;
$brown-mid:   #6b4226;
$brown-light: #a0522d;
$cream:       #F9F7F5;
$text-dark:   #1a120b;
$text-mid:    #4a4035;
$text-light:  #7a6f65;

/* ── ROOT LAYOUT ── */
.auth-root {
  display: flex;
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
  background: $cream;
}

/* ── LEFT PANEL ── */
.left-panel {
  position: relative;
  flex: 0 0 55%;
  overflow: hidden;
  display: none;

  @media (min-width: 960px) { display: flex; }
}

.left-bg {
  position: absolute !important;
  inset: 0;
  z-index: 0;
}

.bean-pattern {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.08;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'%3E%3Cellipse cx='35' cy='35' rx='20' ry='12' fill='%234a7c59' transform='rotate(-30 35 35)'/%3E%3Cpath d='M35 23 Q35 35 35 47' stroke='%23fff' stroke-width='2' fill='none'/%3E%3C/svg%3E");
  background-size: 70px 70px;
}

.left-scrim {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    160deg,
    rgba(27, 67, 50, 0.82) 0%,
    rgba(27, 67, 50, 0.55) 50%,
    rgba(61, 32, 8, 0.75) 100%
  );
}

.left-content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 48px 44px;
  width: 100%;
  color: white;
}

/* Logo row */
.left-logo-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.left-logo-icon {
  width: 60px; height: 60px;
  border-radius: 20px;
  background: rgb(255, 255, 255);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.2);
}
.left-logo-text {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: white;
  em { font-style: normal; color: $green-light; }
}

/* Body copy */
.left-body { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 48px 0 32px; }

.left-tag {
  display: inline-block;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.85);
  margin-bottom: 22px;
  width: fit-content;
  background: rgba(255,255,255,0.08);
}

.left-headline {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 35px;
  font-weight: 600;
  line-height: 1.12;
  margin-bottom: 20px;
  color: white;
}
.left-headline-accent {
  color: $green-light;
  font-style: italic;
}

.left-sub {
  color: rgba(255,255,255,0.72);
  font-size: 15px;
  line-height: 1.65;
  max-width: 400px;
  margin-bottom: 36px;
}

/* Stats row */
.left-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 16px;
  width: fit-content;
}
.stat { display: flex; flex-direction: column; gap: 3px; }
.stat-val { font-family: Arial, Helvetica, sans-serif; font-size: 22px; font-weight: 700; color: white; }
.stat-lbl { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; }
.stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.2); }

/* Mini map card */
.mini-map-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  background: white;
  max-width: 280px;
  animation: floatCard 6s ease-in-out infinite;
}
@keyframes floatCard {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.mini-map-svg { width: 100%; display: block; }
.mini-map-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  background: $green-dark;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
}
.mini-map-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: $green-light;
  animation: blink 2s infinite;
}
@keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
.mini-map-loan {
  margin-left: auto;
  color: $green-light;
  font-size: 12px;
}

/* ── RIGHT PANEL ── */
.right-panel {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: $cream;
  overflow: hidden;
}

.right-accent {
  position: absolute;
  top: -120px;
  right: -120px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(74,124,89,0.08) 0%, transparent 70%);
  pointer-events: none;
}

/* ── FORM SHELL ── */
.form-shell {
  width: 100%;
  max-width: 400px;
  animation: fadeInUp 0.6s ease both;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Logo (mobile / standalone) */
.form-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 40px;

  @media (min-width: 960px) { display: none; }
}
.form-logo-img { border-radius: 12px; }
.form-brand {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: $text-dark;
  em { font-style: normal; color: $green-mid; }
}
.form-brand-sub {
  font-size: 11px;
  color: $text-light;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 2px;
}

/* Heading */
.form-head { margin-bottom: 28px; }
.form-title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 34px;
  font-weight: 600;
  color: $text-dark;
  line-height: 1.1;
  margin-bottom: 8px;
}
.form-sub { font-size: 14px; color: $text-light; }

/* Error pill */
.error-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff0ee;
  border: 1px solid #f5c2be;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 22px;
  font-size: 14px;
  color: #c0392b;
}
.error-icon { font-size: 16px; flex-shrink: 0; }
.error-close {
  margin-left: auto;
  border: none;
  background: none;
  cursor: pointer;
  color: #c0392b;
  font-size: 13px;
  padding: 0;
}
.slide-alert-enter-active, .slide-alert-leave-active { transition: all 0.3s ease; }
.slide-alert-enter-from, .slide-alert-leave-to { opacity: 0; transform: translateY(-10px); }

/* Form body */
.form-body { display: flex; flex-direction: column; gap: 20px; }

/* Field groups */
.field-group { display: flex; flex-direction: column; gap: 7px; }
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: $text-mid;
  letter-spacing: 0.02em;
}
.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.forgot-link {
  font-size: 12px;
  font-weight: 600;
  color: $green-mid;
  text-decoration: none;
  transition: color 0.2s;
  &:hover { color: $green-dark; }
}

.field-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.field-icon {
  position: absolute;
  left: 14px;
  font-size: 16px;
  z-index: 2;
  pointer-events: none;
}

/* Override Vuetify field for consistent padding */
.custom-field {
  width: 100%;

  :deep(.v-field) {
    border-radius: 12px !important;
    background: white !important;
    border: 1.5px solid rgba(74, 124, 89, 0.18) !important;
    box-shadow: 0 1px 4px rgba(27, 67, 50, 0.06) !important;
    transition: border-color 0.2s, box-shadow 0.2s !important;
    padding-left: 40px !important;

    &:hover {
      border-color: rgba(74, 124, 89, 0.35) !important;
    }

    &:focus-within {
      border-color: $green-main !important;
      box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.12) !important;
    }
  }

  :deep(.v-field__outline) { display: none !important; }
}

/* Remember me */
.remember-row { margin-top: -4px; }
.remember-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}
.remember-check { display: none; }
.remember-box {
  width: 20px; height: 20px;
  border-radius: 6px;
  border: 2px solid rgba(74, 124, 89, 0.35);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &.checked {
    background: $green-mid;
    border-color: $green-mid;
  }
}
.check-tick { font-size: 12px; color: white; font-weight: 700; }
.remember-text { font-size: 14px; color: $text-mid; }

/* Sign in button */
.sign-in-btn {
  width: 100%;
  padding: 16px 28px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, $green-mid 0%, $green-main 100%);
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 6px 20px rgba(45, 106, 79, 0.35);
  transition: all 0.3s ease;
  margin-top: 4px;
  letter-spacing: 0.02em;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(45, 106, 79, 0.45);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled { opacity: 0.7; cursor: not-allowed; }
}

.btn-label { display: flex; align-items: center; gap: 8px; }
.btn-arrow { display: inline-block; transition: transform 0.3s; }
.sign-in-btn:hover:not(:disabled) .btn-arrow { transform: translateX(4px); }

.btn-spinner {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Footer */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid rgba(74, 124, 89, 0.1);
  font-size: 14px;
  color: $text-light;
}
.back-home {
  color: $green-mid;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.2s;
  &:hover { color: $green-dark; }
}

/* ── RESPONSIVE ── */
@media (max-width: 960px) {
  .auth-root { flex-direction: column; }
  .right-panel { padding: 48px 24px; }
  .form-logo { display: flex !important; }
}
</style>
