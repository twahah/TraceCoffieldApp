<template>
  <div class="td-root">

    <!-- ════════════════════ NAV ════════════════════ -->
    <header class="td-nav" :class="{ 'td-nav--solid': scrollY > 40 }">
      <div class="td-nav-inner">
        <VImg :src="logoImg" max-width="88" alt="Logo" class="td-logo" />

        <nav class="td-nav-links">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/">Services</RouterLink>
          <RouterLink to="/track" class="td-nav-active">Tracking</RouterLink>
          <RouterLink to="/">Pricing</RouterLink>
          <RouterLink to="/">Support</RouterLink>
        </nav>

        <button class="td-cta-btn" @click="router.push('/login')">
          Get Started <span class="td-arrow">→</span>
        </button>
      </div>
    </header>

    <!-- ════════════════════ HERO ════════════════════ -->
    <section class="td-hero">
      <div class="td-blob td-blob-1"></div>
      <div class="td-blob td-blob-2"></div>
      <div class="td-blob td-blob-3"></div>

      <div class="td-hero-inner">
        <h3 class="td-hero-h1">
          Track Your<br>
          <em class="td-hero-em">Package</em>
        </h3>

        <p class="td-hero-p">
          Enter your tracking number for live delivery updates,
          estimated arrival, and full package details.
        </p>

        <!-- Search bar -->
        <div class="td-search-shell">
          <div class="td-search-wrap">
            <div class="td-search-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <input
              v-model="trackingNumber"
              type="text"
              class="td-search-input"
              placeholder="Enter tracking number (e.g. DLV12345678)"
              @keyup.enter="searchDelivery"
            />
            <button
              class="td-search-btn"
              @click="searchDelivery"
              :disabled="!trackingNumber || searchLoading"
            >
              <span v-if="!searchLoading">Track Package</span>
              <span v-else class="td-spinner"></span>
              <span class="td-arrow" v-if="!searchLoading">→</span>
            </button>
          </div>
          <div class="td-search-hint">Format: DLVXXXXXXXXX · No spaces required</div>
        </div>
      </div>
    </section>

    <!-- ════════════════════ RESULTS ════════════════════ -->
    <section class="td-results" v-if="delivery">
      <div class="td-results-inner">

        <!-- Status Banner -->
        <div class="td-status-banner" :class="`td-banner--${delivery.status}`">
          <div class="td-banner-left">
            <div class="td-banner-icon">{{ getStatusIcon(delivery.status) }}</div>
            <div>
              <div class="td-banner-status">{{ getStatusText(delivery.status) }}</div>
              <div class="td-banner-trk">{{ delivery.tracking_number }}</div>
            </div>
          </div>
          <div class="td-banner-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {{ formatDate(delivery.created_at) }}
          </div>
        </div>

        <!-- Card grid -->
        <div class="td-cards-grid">

          <!-- Route -->
          <div class="td-card" style="animation-delay:.05s">
            <div class="td-card-head">
              <div class="td-card-icon td-icon--red">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
              </div>
              <span class="td-card-title">Route</span>
            </div>
            <div class="td-route-visual">
              <div class="td-route-node">
                <div class="td-node-dot td-node-dot--from"></div>
                <div>
                  <div class="td-node-lbl">From</div>
                  <div class="td-node-val">{{ delivery.departure || '—' }}</div>
                </div>
              </div>
              <div class="td-route-connector">
                <div class="td-connector-line"></div>
                <div class="td-connector-arrow">→</div>
                <div class="td-connector-line"></div>
              </div>
              <div class="td-route-node">
                <div class="td-node-dot td-node-dot--to"></div>
                <div>
                  <div class="td-node-lbl">To</div>
                  <div class="td-node-val">{{ delivery.destination || '—' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contacts -->
          <div class="td-card" style="animation-delay:.1s">
            <div class="td-card-head">
              <div class="td-card-icon td-icon--blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <span class="td-card-title">Contacts</span>
            </div>
            <div class="td-party-row">
              <div class="td-party">
                <div class="td-party-avatar td-party-avatar--red">{{ getInitials(delivery.client?.name) }}</div>
                <div>
                  <div class="td-party-role">Sender</div>
                  <div class="td-party-name">{{ delivery.client?.name || 'Customer' }}</div>
                  <div class="td-party-sub">📞 {{ delivery.client?.phone || 'Not provided' }}</div>
                </div>
              </div>
              <div class="td-party-sep"></div>
              <div class="td-party">
                <div class="td-party-avatar td-party-avatar--red">{{ getInitials(delivery.recipient_name) }}</div>
                <div>
                  <div class="td-party-role">Recipient</div>
                  <div class="td-party-name">{{ delivery.recipient_name || 'Customer' }}</div>
                  <div class="td-party-sub">📞 {{ delivery.recipient_phone || 'Not provided' }}</div>
                </div>
              </div>
              <div class="td-party-sep"></div>
              <div class="td-party">
                <div class="td-party-avatar td-party-avatar--blue">{{ getInitials(delivery.courier?.name) }}</div>
                <div>
                  <div class="td-party-role">Delivery Agent</div>
                  <div class="td-party-name">{{ delivery.courier?.name || 'Agent' }}</div>
                  <div class="td-party-sub">🚛 {{ delivery.courier?.vehicle_no || '—' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="td-card" style="animation-delay:.15s">
            <div class="td-card-head">
              <div class="td-card-icon td-icon--green">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <span class="td-card-title">Delivery Details</span>
            </div>
            <div class="td-details-list">
              <div class="td-detail-row">
                <span class="td-detail-lbl">📅 Est. Delivery</span>
                <span class="td-detail-val">{{ formatDateTime(delivery.delivery_date_time) }}</span>
              </div>
              <div class="td-detail-row">
                <span class="td-detail-lbl">💳 Payment</span>
                <span class="td-detail-val">{{ getPaymentMethodLabel(delivery.payment_method) }}</span>
              </div>
              <div class="td-detail-row">
                <span class="td-detail-lbl">📝 Instructions</span>
                <span class="td-detail-val">{{ delivery.instructions || 'None' }}</span>
              </div>
            </div>
          </div>

          <!-- Parcels -->
          <div class="td-card" style="animation-delay:.2s">
            <div class="td-card-head">
              <div class="td-card-icon td-icon--orange">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <span class="td-card-title">Package Contents</span>
              <div class="td-parcel-badge">{{ delivery.parcels?.length || 0 }} items</div>
            </div>
            <div class="td-parcels-scroll">
              <div v-for="(parcel, i) in delivery.parcels" :key="i" class="td-parcel-row">
                <div class="td-parcel-num">{{ i + 1 }}</div>
                <div class="td-parcel-info">
                  <div class="td-parcel-desc">{{ parcel.description || 'Package item' }}</div>
                  <div class="td-parcel-meta">
                    <span>⚖️ {{ parcel.weight || '0' }} kg</span>
                    <span v-if="parcel.value">Value: ${{ formatNumber(parcel.value) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Timeline -->
        <div class="td-timeline-card">
          <div class="td-timeline-head">
            <div class="td-tl-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fe4c40" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Delivery Timeline
            </div>
            <div class="td-tl-count">{{ timeline.length }} updates</div>
          </div>

          <div class="td-timeline">
            <div
              v-for="(ev, i) in timeline"
              :key="i"
              class="td-tl-item"
              :class="{ 'td-tl-item--current': i === 0 }"
            >
              <div class="td-tl-rail">
                <div class="td-tl-dot" :class="`td-dot--${ev.status}`">
                  <span>{{ getStatusIcon(ev.status) }}</span>
                </div>
                <div class="td-tl-line" v-if="i !== timeline.length - 1"></div>
              </div>
              <div class="td-tl-body">
                <div class="td-tl-ev-title">{{ ev.title }}</div>
                <div class="td-tl-ev-desc">{{ ev.description }}</div>
                <div class="td-tl-ev-meta">
                  <span>🕒 {{ formatDateTime(ev.timestamp) }}</span>
                  <span v-if="ev.location">📍 {{ ev.location }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ════════════════════ EMPTY ════════════════════ -->
    <section class="td-empty" v-if="showEmptyState">
      <div class="td-empty-inner">
        <div class="td-empty-icon">📦</div>
        <h2 class="td-empty-title">Ready to Track Your Package</h2>
        <p class="td-empty-p">Enter your tracking number above to see real-time delivery status and updates.</p>
        <div class="td-tips-grid">
          <div class="td-tip">
            <div class="td-tip-icon">🔍</div>
            <div>
              <div class="td-tip-title">Finding your tracking number</div>
              <div class="td-tip-sub">Check your email confirmation or order details page</div>
            </div>
          </div>
          <div class="td-tip">
            <div class="td-tip-icon">📱</div>
            <div>
              <div class="td-tip-title">Need help?</div>
              <div class="td-tip-sub">Contact our support team for live assistance</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════ ERROR ════════════════════ -->
    <section class="td-error" v-if="error">
      <div class="td-error-inner">
        <div class="td-error-icon">⚠️</div>
        <h2 class="td-error-title">Package Not Found</h2>
        <p class="td-error-p">{{ error }}</p>
        <button class="td-cta-btn" @click="clearError">Try Again</button>
      </div>
    </section>

    <!-- ════════════════════ FOOTER ════════════════════ -->
    <footer class="td-footer">
      <div class="td-footer-inner">
        <div class="td-footer-brand">
          <VImg :src="logoImg" max-width="80" alt="Logo" />
          <p class="td-footer-tagline">Real-time tracking for every delivery. Stay informed, every step.</p>
        </div>
        <div class="td-footer-col">
          <div class="td-footer-col-title">Quick Links</div>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/track">Track Package</RouterLink>
          <RouterLink to="#services">Services</RouterLink>
        </div>
        <div class="td-footer-col">
          <div class="td-footer-col-title">Support</div>
          <RouterLink to="#">Help Center</RouterLink>
          <RouterLink to="#">Contact Us</RouterLink>
          <RouterLink to="#">FAQs</RouterLink>
        </div>
        <div class="td-footer-col">
          <div class="td-footer-col-title">Need Help?</div>
          <a href="tel:+2439871234">📞 +243 987-1234</a>
          <div class="td-footer-hours">Mon–Sun · 6AM–12AM EST</div>
        </div>
      </div>
      <div class="td-footer-bar">© 2024 ParcelHub. All rights reserved.</div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logoImg from '@images/logo.png'
import axios from 'axios'

const router = useRouter()
const trackingNumber = ref('')
const delivery       = ref(null)
const error          = ref('')
const searchLoading  = ref(false)
const scrollY        = ref(0)

definePage({ meta: { layout: 'blank', unauthenticatedOnly: true } })

const showEmptyState = computed(() => !delivery.value && !error.value && !searchLoading.value)

const getInitials = n => n ? n.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2) : '?'

const timeline = computed(() => {
  if (!delivery.value) return []
  const events = []
  if (delivery.value.status_history) {
    delivery.value.status_history.forEach(h => events.push({
      status: h.status,
      title: getStatusText(h.status),
      description: h.notes || `Status changed to ${getStatusText(h.status)}`,
      timestamp: h.created_at,
      location: h.location
    }))
  } else if (delivery.value.status_updated_at) {
    events.push({
      status: delivery.value.status,
      title: getStatusText(delivery.value.status),
      description: `Package is now ${getStatusText(delivery.value.status).toLowerCase()}`,
      timestamp: delivery.value.status_updated_at,
      location: delivery.value.status === 'delivered' ? delivery.value.destination : 'In transit'
    })
  }
  events.push({ status: 'pending', title: 'Order Created', description: 'Package information received and processing started', timestamp: delivery.value.created_at, location: 'System' })
  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  if (typeof num !== 'number') num = Number(num) || 0
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
const searchDelivery = async () => {
  if (!trackingNumber.value.trim()) return
  searchLoading.value = true; error.value = ''; delivery.value = null
  try {
    const res = await axios.get(`/track-delivery/${trackingNumber.value.trim()}`)
    if (res.data.success) {
      delivery.value = res.data.data
      if (delivery.value.parcels && !Array.isArray(delivery.value.parcels))
        delivery.value.parcels = JSON.parse(delivery.value.parcels || '[]')
    } else error.value = res.data.message || 'Delivery not found'
  } catch (e) {
    error.value = e.response?.data?.message || 'Delivery not found. Please check the tracking number.'
  } finally { searchLoading.value = false }
}

const clearError   = () => { error.value = ''; trackingNumber.value = '' }
const formatDate   = d => d ? new Date(d).toLocaleDateString('en-US', { weekday:'short', year:'numeric', month:'short', day:'numeric' }) : 'N/A'
const formatDateTime = d => d ? new Date(d).toLocaleString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'N/A'
const getStatusText  = s => ({ pending:'Pending', in_transit:'In Transit', delivered:'Delivered', cancelled:'Cancelled' })[s] || s
const getStatusIcon  = s => ({ pending:'⏳', in_transit:'🚚', delivered:'✅', cancelled:'❌' })[s] || '📦'
const getPaymentMethodLabel = m => ({ departure:'Pay on Departure', delivery:'Pay on Delivery', prepaid:'Prepaid' })[m] || m || 'Not specified'

onMounted(() => {
  window.addEventListener('scroll', () => { scrollY.value = window.scrollY })
  const p = new URLSearchParams(window.location.search).get('track')
  if (p) { trackingNumber.value = p; searchDelivery() }
})
</script>

<style scoped>
/* ═══ BASE ═══ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.td-root {
  position: absolute; inset: 0;
  background: #fafafa;
  color: #16161e;
  overflow-x: hidden;
  min-height: 100vh;
}

/* ═══ NAV ═══ */
.td-nav {
  position: fixed; inset-block-start: 0; inset-inline: 0;
  z-index: 100; padding: 14px 0;
  backdrop-filter: blur(12px);
  background: rgba(250,250,250,.82);
  transition: background .25s, box-shadow .25s;
}
.td-nav--solid {
  background: rgba(255,255,255,.97);
  box-shadow: 0 1px 0 rgba(0,0,0,.07), 0 4px 20px rgba(0,0,0,.05);
}
.td-nav-inner {
  max-width: 1180px; margin: 0 auto; padding: 0 28px;
  display: flex; align-items: center; justify-content: space-between; gap: 32px;
}
.td-nav-links { display: flex; gap: 28px; }
.td-nav-links a {
  
  font-size: 14px; font-weight: 500; color: #444;
  text-decoration: none; position: relative; transition: color .18s;
}
.td-nav-links a:hover, .td-nav-active { color: #fe4c40 !important; }
.td-nav-links a::after {
  content: ''; position: absolute;
  inset-block-end: -4px; inset-inline-start: 0;
  height: 1.5px; width: 0;
  background: #fe4c40; transition: width .22s;
}
.td-nav-links a:hover::after, .td-nav-active::after { width: 100% !important; }

/* ═══ CTA BTN ═══ */
.td-cta-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: #fe4c40; color: white;
  border: none; cursor: pointer;
  
  font-size: 14px; font-weight: 600;
  padding: 10px 22px; border-radius: 10px;
  box-shadow: 0 4px 14px rgba(254,76,64,.28);
  transition: transform .18s, box-shadow .18s;
}
.td-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(254,76,64,.36); }
.td-arrow { display: inline-block; transition: transform .18s; }
.td-cta-btn:hover .td-arrow,
.td-search-btn:not(:disabled):hover .td-arrow { transform: translateX(3px); }

/* ═══ HERO ═══ */
.td-hero {
  position: relative;
  display: flex; align-items: center;
  padding: 100px 0px; overflow: hidden;
}
.td-blob {
  position: absolute; border-radius: 50%;
  filter: blur(80px); opacity: .42; pointer-events: none;
}
.td-blob-1 { width:500px;height:500px;background:radial-gradient(circle,rgba(254,76,64,.22) 0%,transparent 70%);top:-120px;left:-100px; }
.td-blob-2 { width:400px;height:400px;background:radial-gradient(circle,rgba(255,154,60,.16) 0%,transparent 70%);top:60px;right:-60px; }
.td-blob-3 { width:300px;height:300px;background:radial-gradient(circle,rgba(254,76,64,.1) 0%,transparent 70%);bottom:-80px;left:42%; }

.td-hero-inner {
  position: relative; z-index: 2;
  max-width: 780px; margin: 0 auto; text-align: center;
  animation: td-up .65s ease both;
}
.td-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  
  font-size: 12px; font-weight: 600;
  letter-spacing: 1.4px; text-transform: uppercase;
  color: #fe4c40;
  background: rgba(254,76,64,.07);
  padding: 6px 14px; border-radius: 20px;
  border: 1px solid rgba(254,76,64,.15);
  margin-bottom: 22px;
}
.td-pulse-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #fe4c40;
  animation: td-pulse 1.8s ease-in-out infinite;
}
@keyframes td-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(254,76,64,.35); }
  50%      { box-shadow: 0 0 0 6px transparent; }
}
.td-hero-h1 {
  font-size: clamp(20px, 6vw, 46px);
  font-weight: 700; line-height: 1.05;
  letter-spacing: -0.025em; color: #16161e;
  margin-bottom: 18px;
}
.td-hero-em {
  font-style: italic;
  background: linear-gradient(135deg, #fe4c40 0%, #ff9a3c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.td-hero-p {
  
  font-size: 16px; color: #64748b; line-height: 1.65;
  margin-bottom: 6px; max-width: 540px; margin-inline: auto;
}

/* ═══ SEARCH ═══ */
.td-search-shell { max-width: 680px; margin: 0 auto; }
.td-search-wrap {
  display: flex; align-items: center;
  background: white;
  border: 1.5px solid rgba(0,0,0,.1);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,.08);
  overflow: hidden;
  transition: border-color .2s, box-shadow .2s;
}
.td-search-wrap:focus-within {
  border-color: #fe4c40;
  box-shadow: 0 8px 32px rgba(0,0,0,.08), 0 0 0 4px rgba(254,76,64,.12);
}
.td-search-icon-wrap {
  padding: 0 16px; color: #b0b7c3; flex-shrink: 0;
  display: flex; align-items: center;
}
.td-search-input {
  flex: 1; border: none; outline: none;
  
  font-size: 15px; color: #16161e;
  padding: 16px 0; background: transparent;
}
.td-search-input::placeholder { color: #b0b7c3; }
.td-search-btn {
  display: flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #fe4c40, #ff6b5b);
  color: white; border: none; cursor: pointer;
  
  font-size: 14px; font-weight: 600;
  padding: 0 24px; height: 54px; flex-shrink: 0;
  transition: opacity .18s;
}
.td-search-btn:disabled { opacity: .55; cursor: not-allowed; }
.td-search-hint {
  
  font-size: 12px; color: #b0b7c3;
  margin-top: 10px; text-align: left; padding-left: 4px;
}
.td-spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: white; border-radius: 50%;
  animation: td-spin .7s linear infinite;
}
@keyframes td-spin { to { transform: rotate(360deg); } }

/* ═══ RESULTS ═══ */
.td-results { padding: 28px 22px; }
.td-results-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }

/* Status banner */
.td-status-banner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px; border-radius: 16px;
  border: 1.5px solid transparent;
  animation: td-up .38s ease both;
}
.td-banner--pending    { background: rgba(255,159,67,.08); border-color: rgba(255,159,67,.22); }
.td-banner--in_transit { background: rgba(0,207,232,.07);  border-color: rgba(0,207,232,.22); }
.td-banner--delivered  { background: rgba(40,199,111,.08); border-color: rgba(40,199,111,.22); }
.td-banner--cancelled  { background: rgba(234,84,85,.07);  border-color: rgba(234,84,85,.22); }
.td-banner-left { display: flex; align-items: center; gap: 14px; }
.td-banner-icon { font-size: 28px; }
.td-banner-status { font-size: 16px; font-weight: 700; }
.td-banner-trk {
  font-size: 13px;
  color: #fe4c40; background: rgba(254,76,64,.07);
  padding: 2px 8px; border-radius: 6px; margin-top: 4px; display: inline-block;
}
.td-banner-date {
  display: flex; align-items: center; gap: 6px;
  
  font-size: 13px; color: #64748b;
}

/* Card grid */
.td-cards-grid {
  display: grid; grid-template-columns: repeat(2,1fr); gap: 16px;
}
@media(max-width:900px){ .td-cards-grid { grid-template-columns: 1fr; } }

.td-card {
  background: white; border-radius: 18px;
  border: 1px solid rgba(0,0,0,.07);
  box-shadow: 0 2px 16px rgba(0,0,0,.05);
  padding: 22px;
  animation: td-up .44s ease both;
  transition: box-shadow .2s, transform .2s;
}
.td-card:hover { box-shadow: 0 6px 28px rgba(0,0,0,.09); transform: translateY(-1px); }

.td-card-head {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 18px; padding-bottom: 14px;
  border-bottom: 1px solid rgba(0,0,0,.06);
}
.td-card-icon {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.td-icon--red    { background: rgba(254,76,64,.09);  color: #fe4c40; }
.td-icon--blue   { background: rgba(0,207,232,.1);   color: #00b0cc; }
.td-icon--green  { background: rgba(40,199,111,.1);  color: #18a058; }
.td-icon--orange { background: rgba(255,159,67,.12); color: #e07a00; }
.td-card-title {
  
  font-size: 12.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .8px;
  color: #94a3b8; flex: 1;
}

/* Route */
.td-route-visual { display: flex; align-items: center; gap: 10px; }
.td-route-node { display: flex; align-items: flex-start; gap: 10px; flex: 1; }
.td-node-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
.td-node-dot--from { background: #fe4c40; box-shadow: 0 0 0 3px rgba(254,76,64,.12); }
.td-node-dot--to   { background: #28C76F; box-shadow: 0 0 0 3px rgba(40,199,111,.12); }
.td-node-lbl { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 3px; }
.td-node-val { font-size: 15px; font-weight: 600; color: #16161e; }
.td-route-connector { display: flex; align-items: center; gap: 4px; }
.td-connector-line { width: 22px; height: 1px; background: rgba(0,0,0,.1); }
.td-connector-arrow { font-size: 14px; color: #fe4c40; }

/* Contacts */
.td-party-row { display: flex; align-items: flex-start; gap: 16px; }
.td-party { display: flex; align-items: flex-start; gap: 12px; flex: 1; }
.td-party-sep { width: 1px; background: rgba(0,0,0,.07); align-self: stretch; }
.td-party-avatar {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  
  font-size: 13px; font-weight: 700; color: white; flex-shrink: 0;
}
.td-party-avatar--red  { background: linear-gradient(135deg, #fe4c40, #ff6b5b); }
.td-party-avatar--blue { background: linear-gradient(135deg, #00CFE8, #0099b5); }
.td-party-role { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 3px; }
.td-party-name { font-size: 12px; font-weight: 600; color: #16161e; margin-bottom: 4px; }
.td-party-sub  { font-size: 11px; color: #64748b; }

/* Details */
.td-details-list { display: flex; flex-direction: column; }
.td-detail-row {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  padding: 11px 0; border-bottom: 1px solid rgba(0,0,0,.04);
}
.td-detail-row:last-child { border-bottom: none; }
.td-detail-lbl { font-size: 13px; color: #64748b; white-space: nowrap; }
.td-detail-val { font-size: 13px; font-weight: 500; color: #16161e; text-align: right; }

/* Parcels */
.td-parcel-badge {
  font-size: 11.5px; font-weight: 600;
  color: #00b0cc; background: rgba(0,207,232,.1);
  padding: 3px 10px; border-radius: 20px; margin-left: auto;
}
.td-parcels-scroll { display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto; }
.td-parcel-row {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 10px;
  border: 1px solid rgba(0,0,0,.05);
  transition: border-color .15s, transform .15s;
}
.td-parcel-row:hover { border-color: rgba(254,76,64,.2); transform: translateX(3px); }
.td-parcel-num {
  width: 28px; height: 28px; border-radius: 8px;
  background: rgba(254,76,64,.08); color: #fe4c40;
  display: flex; align-items: center; justify-content: center;
  
  font-size: 12px; font-weight: 700; flex-shrink: 0;
}
.td-parcel-desc { font-size: 14px; font-weight: 500; color: #16161e; margin-bottom: 3px; }
.td-parcel-meta { font-size: 12px; color: #64748b; display: flex; gap: 100px; }

/* Timeline */
.td-timeline-card {
  background: white; border-radius: 18px;
  border: 1px solid rgba(0,0,0,.07);
  box-shadow: 0 2px 16px rgba(0,0,0,.05);
  padding: 24px;
  animation: td-up .5s ease both;
}
.td-timeline-head {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 22px; padding-bottom: 16px;
  border-bottom: 1px solid rgba(0,0,0,.06);
}
.td-tl-title {
  display: flex; align-items: center; gap: 8px;
  
  font-size: 15px; font-weight: 700; flex: 1;
}
.td-tl-count {
  
  font-size: 11.5px; font-weight: 600;
  color: #fe4c40; background: rgba(254,76,64,.08);
  padding: 3px 10px; border-radius: 20px;
}
.td-timeline { display: flex; flex-direction: column; }
.td-tl-item { display: flex; gap: 16px; padding: 14px 0; }
.td-tl-item:not(:last-child) { border-bottom: 1px solid rgba(0,0,0,.04); }
.td-tl-rail { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.td-tl-dot {
  width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.td-dot--pending    { background: rgba(255,159,67,.12); }
.td-dot--in_transit { background: rgba(0,207,232,.12); }
.td-dot--delivered  { background: rgba(40,199,111,.12); }
.td-dot--cancelled  { background: rgba(234,84,85,.12); }
.td-tl-item--current .td-tl-dot {
  border: 2px solid #fe4c40;
  animation: td-ring 2s ease-in-out infinite;
}
@keyframes td-ring {
  0%,100% { box-shadow: 0 0 0 0 rgba(254,76,64,.3); }
  50%      { box-shadow: 0 0 0 8px transparent; }
}
.td-tl-line { flex: 1; width: 2px; background: rgba(0,0,0,.07); margin-top: 6px; }
.td-tl-ev-title { font-size: 15px; font-weight: 600; color: #16161e; margin-bottom: 5px; }
.td-tl-ev-desc {
  
  font-size: 13.5px; color: #64748b; line-height: 1.45; margin-bottom: 8px;
}
.td-tl-ev-meta {
  display: flex; gap: 16px; flex-wrap: wrap;
  font-size: 12px; color: #aaa;
}

/* ═══ EMPTY ═══ */
.td-empty { padding: 40px 28px 80px; text-align: center; animation: td-up .5s ease both; }
.td-empty-inner { max-width: 620px; margin: 0 auto; }
.td-empty-icon { font-size: 56px; margin-bottom: 18px; opacity: .75; }
.td-empty-title { font-size: 28px; font-weight: 700; margin-bottom: 12px; }
.td-empty-p { font-size: 15.5px; color: #64748b; margin-bottom: 36px; }
.td-tips-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
@media(max-width:600px){ .td-tips-grid { grid-template-columns: 1fr; } }
.td-tip {
  display: flex; align-items: flex-start; gap: 12px;
  background: white; border: 1px solid rgba(0,0,0,.07);
  border-radius: 14px; padding: 18px; text-align: left;
}
.td-tip-icon { font-size: 22px; flex-shrink: 0; }
.td-tip-title { font-size: 14px; font-weight: 600; color: #16161e; margin-bottom: 4px; }
.td-tip-sub   { font-size: 13px; color: #64748b; }

/* ═══ ERROR ═══ */
.td-error { padding: 80px 28px; text-align: center; }
.td-error-inner { max-width: 480px; margin: 0 auto; }
.td-error-icon  { font-size: 52px; margin-bottom: 16px; }
.td-error-title { font-size: 26px; font-weight: 700; margin-bottom: 10px; }
.td-error-p { font-size: 15px; color: #64748b; margin-bottom: 28px; }

/* ═══ FOOTER ═══ */
.td-footer { background: #111116; color: white; padding: 64px 28px 28px; }
.td-footer-inner {
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 40px;
  padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,.07);
}
@media(max-width:900px){ .td-footer-inner { grid-template-columns: 1fr 1fr; } }
@media(max-width:560px){ .td-footer-inner { grid-template-columns: 1fr; } }
.td-footer-tagline { font-size: 13.5px; color: #666; line-height: 1.65; margin-top: 14px; max-width: 280px; }
.td-footer-col-title { font-size: 12px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #555; margin-bottom: 16px; }
.td-footer-col a {
  display: block; 
  font-size: 14px; color: #777; text-decoration: none;
  margin-bottom: 10px; transition: color .15s, transform .15s;
}
.td-footer-col a:hover { color: #fe4c40; transform: translateX(3px); }
.td-footer-hours { font-size: 13px; color: #555; margin-top: 10px; line-height: 1.5; }
.td-footer-bar { max-width: 1100px; margin: 24px auto 0; font-size: 13px; color: #444; text-align: center; }

/* ═══ ANIMATION ═══ */
@keyframes td-up { from { opacity:0; transform: translateY(18px); } to { opacity:1; transform: translateY(0); } }

/* ═══ RESPONSIVE ═══ */
@media(max-width:768px){
  .td-nav-links { display: none; }
  .td-hero { padding-top: 100px; }
  .td-search-wrap { flex-wrap: wrap; border-radius: 12px; }
  .td-search-btn { width: 100%; height: 48px; justify-content: center; border-radius: 0 0 10px 10px; }
  .td-search-icon-wrap { padding: 14px 16px; }
  .td-search-input { padding: 14px 0; }
  .td-party-row { flex-direction: column; }
  .td-party-sep { width: 100%; height: 1px; }
}

/* Scrollbar */
.td-parcels-scroll::-webkit-scrollbar { width: 4px; }
.td-parcels-scroll::-webkit-scrollbar-thumb { background: rgba(254,76,64,.2); border-radius: 4px; }
</style>
