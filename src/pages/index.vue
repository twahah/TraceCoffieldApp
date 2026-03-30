<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const features = ref([
  {
    icon: '📍',
    title: 'Field Mapping',
    description: 'Draw precise polygon boundaries for every coffee farm plot using our interactive GPS mapping tool.',
    color: '#4a7c59'
  },
  {
    icon: '💰',
    title: 'Loan Disbursement',
    description: 'Issue coffee harvest advance loans instantly to registered farmers, tracked per plot and season.',
    color: '#6b4226'
  },
  {
    icon: '☕',
    title: 'Harvest Tracking',
    description: 'Record cherry deliveries, weights, and quality grades directly from the collection point.',
    color: '#a0522d'
  },
  {
    icon: '📊',
    title: 'Payment Records',
    description: 'Full audit trail of coffee payments, deductions, and loan repayments per farmer.',
    color: '#2d6a4f'
  }
])

const loanSteps = ref([
  { number: 1, title: 'Farmer Verification', description: 'Confirm farmer identity and registered plot details' },
  { number: 2, title: 'Plot Assessment', description: 'Review mapped farm polygon and estimated yield' },
  { number: 3, title: 'Loan Approval', description: 'Field officer approves advance based on harvest projection' },
  { number: 4, title: 'Disbursement', description: 'Funds issued to farmer against upcoming coffee delivery' },
  { number: 5, title: 'Repayment', description: 'Loan auto-deducted from cherry payment at collection' }
])

const stats = ref([
  { value: '3,200+', label: 'Farmers Enrolled' },
  { value: '18,500', label: 'Acres Mapped' },
  { value: 'UGX 2.4B', label: 'Loans Disbursed' },
  { value: '98.2%', label: 'Repayment Rate' }
])

const testimonials = ref([
  {
    name: 'Agnes Nakato',
    role: 'Field Officer, Masaka District',
    text: 'TraceCoffield cut my farm verification time in half. I can draw a plot polygon, approve a loan, and record delivery all from one app.',
    avatar: 'AN',
    rating: 5
  },
  {
    name: 'James Muwonge',
    role: 'Coffee Farmer, Kiboga',
    text: 'My advance loan came within hours of my field officer visiting. No paperwork, no delays before planting season.',
    avatar: 'JM',
    rating: 5
  },
  {
    name: 'Prossy Namaganda',
    role: 'Regional Manager, Western Uganda',
    text: 'The polygon mapping gives us exact acreage data. Loan amounts are now based on real numbers, not guesses.',
    avatar: 'PN',
    rating: 4
  }
])

const activeTestimonial = ref(0)
const scrollY = ref(0)
const trackingId = ref('')
const router = useRouter()
const mousePosition = ref({ x: 0, y: 0 })

const navigateToSignup = () => router.push('/')
const navigateToLogin = () => router.push('/login')

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY
  })
  window.addEventListener('mousemove', (e) => {
    mousePosition.value = { x: e.clientX, y: e.clientY }
  })
  setInterval(() => {
    activeTestimonial.value = (activeTestimonial.value + 1) % testimonials.value.length
  }, 5000)
})
</script>

<template>
  <div class="homepage" :style="{
    '--mouse-x': mousePosition.x + 'px',
    '--mouse-y': mousePosition.y + 'px'
  }">

    <!-- Enhanced Coffee Bean Background -->
    <div class="coffee-ambiance">
      <div class="bean-grid"></div>
      <div class="bean-particles">
        <div v-for="n in 20" :key="n" class="bean-particle" :style="{
          '--delay': n * 0.5 + 's',
          '--size': (20 + n * 2) + 'px',
          '--left': (n * 5) + '%',
          '--rotate': (n * 45) + 'deg'
        }"></div>
      </div>
      <div class="steam-effect"></div>
      <div class="coffee-stain stain-1"></div>
      <div class="coffee-stain stain-2"></div>
    </div>

    <!-- Header -->
    <header class="header" :class="{ scrolled: scrollY > 50 }">
      <div class="container">
        <div class="nav-bar">
          <div class="logo">
            <div class="logo-icon">
              <span class="logo-bean">
                <VImg src="/logo.png" alt="TraceCoffield Logo" width="80" />
              </span>
            </div>
            <div class="logo-text">
              <span class="logo-trace">Trace</span><span class="logo-coffield">Coffield</span>
            </div>
          </div>

          <nav class="nav-links">
            <RouterLink to="/" class="active">Home</RouterLink>
            <RouterLink to="#mapping">Field Mapping</RouterLink>
            <RouterLink to="#loans">Advance Loans</RouterLink>
            <RouterLink to="#support">Support</RouterLink>
          </nav>

          <div class="nav-actions">
            <button class="btn-ghost" @click="navigateToLogin">Sign In</button>
            <button class="btn-primary" @click="navigateToSignup">
              Get the App <span class="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-coffee-beans">
        <div class="floating-bean bean-1"></div>
        <div class="floating-bean bean-2"></div>
        <div class="floating-bean bean-3"></div>
        <div class="floating-bean bean-4"></div>
      </div>
      
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="badge">
              <span class="badge-dot"></span>
              <span>Field Officer Platform · Ugandan Coffee</span>
            </div>
            
            <h1 class="hero-title">
              Finance & Map<br>
              <span class="gradient-text">Coffee Farms.</span><br>
              <span class="typewriter">From the Field.</span>
            </h1>
            
            <p class="hero-subtitle">
              TraceCoffield empowers field officers to draw farm polygons, disburse harvest advance loans, track cherry deliveries, and manage coffee payments, all offline capable, all from your phone.
            </p>

            <div class="hero-actions">
              <button class="btn-primary large" @click="navigateToSignup">
                Start as Field Officer 
                <span class="btn-icon">☕</span>
                <span class="arrow">→</span>
              </button>
            </div>

            <div class="hero-stats">
              <div v-for="stat in stats" :key="stat.label" class="stat-item">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>

          <div class="hero-visual">
            <div class="map-card">
              <div class="map-header">
                <span class="map-badge">
                  <span class="pulse-dot"></span>
                  Live Farm Map
                </span>
                <span class="map-status">● GPS Active</span>
              </div>
              <div class="map-body">
                <svg viewBox="0 0 340 260" xmlns="http://www.w3.org/2000/svg" class="farm-map-svg">
                  <defs>
                    <linearGradient id="farmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#4a7c59" stop-opacity="0.2"/>
                      <stop offset="100%" stop-color="#6b4226" stop-opacity="0.2"/>
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  <!-- Terrain with texture -->
                  <rect width="340" height="260" fill="url(#farmGradient)" rx="12"/>
                  
                  <!-- Topographic lines -->
                  <path d="M0 65 L340 65" stroke="#b8dcbf" stroke-width="0.5" stroke-dasharray="4 4"/>
                  <path d="M0 130 L340 130" stroke="#b8dcbf" stroke-width="0.5" stroke-dasharray="4 4"/>
                  <path d="M0 195 L340 195" stroke="#b8dcbf" stroke-width="0.5" stroke-dasharray="4 4"/>
                  <path d="M85 0 L85 260" stroke="#b8dcbf" stroke-width="0.5" stroke-dasharray="4 4"/>
                  <path d="M170 0 L170 260" stroke="#b8dcbf" stroke-width="0.5" stroke-dasharray="4 4"/>
                  <path d="M255 0 L255 260" stroke="#b8dcbf" stroke-width="0.5" stroke-dasharray="4 4"/>
                  
                  <!-- Farm polygon with glow effect -->
                  <polygon points="60,40 200,30 280,90 260,190 140,210 50,160" 
                           fill="rgba(74,124,89,0.35)" 
                           stroke="#4a7c59" 
                           stroke-width="2.5" 
                           stroke-dasharray="6,3"
                           filter="url(#glow)"/>
                  
                  <!-- Animated corner dots -->
                  <circle cx="60" cy="40" r="6" fill="#4a7c59" class="pulse-dot"/>
                  <circle cx="200" cy="30" r="6" fill="#4a7c59" class="pulse-dot"/>
                  <circle cx="280" cy="90" r="6" fill="#4a7c59" class="pulse-dot"/>
                  <circle cx="260" cy="190" r="6" fill="#4a7c59" class="pulse-dot"/>
                  <circle cx="140" cy="210" r="6" fill="#4a7c59" class="pulse-dot"/>
                  <circle cx="50" cy="160" r="6" fill="#4a7c59" class="pulse-dot"/>
                  
                  <!-- Area label with coffee bean icon -->
                  <text x="158" y="125" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#2d6a4f" font-weight="700">2.4 Acres</text>
                  <text x="158" y="143" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#4a7c59">Plot ID: CF-00428</text>
                  
                  <!-- 3D Pin Marker -->
                  <ellipse cx="158" cy="168" rx="8" ry="3" fill="rgba(106,66,38,0.25)"/>
                  <path d="M158 155 C158 155 148 168 158 168 C168 168 158 155 158 155Z" fill="#6b4226"/>
                  <circle cx="158" cy="153" r="5" fill="#6b4226"/>
                  <circle cx="158" cy="153" r="2.5" fill="#fff"/>
                  
                  <!-- Coffee bean decorations -->
                  <g class="coffee-bean-svg" transform="translate(280, 30)">
                    <ellipse cx="0" cy="0" rx="6" ry="4" transform="rotate(-15)" fill="#6b4226" opacity="0.3"/>
                  </g>
                  <g class="coffee-bean-svg" transform="translate(40, 210)">
                    <ellipse cx="0" cy="0" rx="5" ry="3" transform="rotate(30)" fill="#4a7c59" opacity="0.3"/>
                  </g>
                </svg>
              </div>
              <div class="map-footer">
                <div class="map-farmer">
                  <div class="farmer-avatar">
                    <span>JM</span>
                  </div>
                  <div>
                    <div class="farmer-name">James Muwonge</div>
                    <div class="farmer-meta">Kiboga · Arabica</div>
                  </div>
                </div>
                <div class="loan-chip">
                  <span>Loan: </span>
                  <strong>UGX 480,000</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Loan Process Steps with Coffee Theme -->
    <section class="loan-process" id="loans">
      <div class="coffee-drip"></div>
      <div class="container">
        <div class="section-header">
          <div class="section-badge">
            <span class="badge-icon">💰</span>
            Lending Flow
          </div>
          <h2>Harvest Advance Loans</h2>
          <p>From farm visit to farmer payment in minutes</p>
        </div>
        
        <div class="process-steps">
          <div
            v-for="step in loanSteps"
            :key="step.number"
            class="process-step"
          >
            <div class="step-circle">
              <span class="step-number">{{ step.number }}</span>
              <div class="step-coffee"></div>
            </div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
            <div class="step-connector" v-if="step.number < 5">
              <div class="connector-beans"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section with Coffee Cards -->
    <section id="mapping" class="features">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">
            <span class="badge-icon">🌿</span>
            Capabilities
          </div>
          <h2>Built for the Field</h2>
          <p>Every tool a coffee field officer needs, designed to work even offline</p>
        </div>
        
        <div class="features-grid">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card"
            :style="{ '--card-color': feature.color }"
          >
            <div class="feature-icon-wrapper">
              <span class="feature-emoji">{{ feature.icon }}</span>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <div class="feature-hover-effect">
              <div class="coffee-splash"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing/Rates Section with Coffee Bean Cards -->
    <!-- <section class="services" id="pricing">
      <div class="bean-rain"></div>
      <div class="container">
        <div class="section-header">
          <div class="section-badge">
            <span class="badge-icon">☕</span>
            Coffee Rates
          </div>
          <h2>Current Buying Rates</h2>
          <p>Live coffee purchase prices per kilogram by route</p>
        </div>
        
        <div class="services-grid" v-if="priceRates && priceRates.length">
          <div
            v-for="(priceRate, index) in priceRates"
            :key="index"
            class="service-card"
          >
            <div class="card-coffee-bg"></div>
            <div class="service-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <ellipse cx="24" cy="24" rx="14" ry="9" transform="rotate(-15 24 24)" fill="#4a7c59" opacity="0.2"/>
                <path d="M24 17 Q26 24 24 31" stroke="#6b4226" stroke-width="2"/>
              </svg>
            </div>
            <h3>{{ priceRate.departure }}</h3>
            <p class="route">→ {{ priceRate.destination }}</p>
            <div class="service-price">
              UGX {{ priceRate.charge }} 
              <small>/ KG</small>
            </div>
            <button class="service-btn" @click="navigateToSignup">
              Book Collection 
              <span class="arrow">→</span>
            </button>
          </div>
        </div>
        
        <div class="services-grid" v-else>
          <div class="service-card" v-for="n in 4" :key="n">
            <div class="service-icon">☕</div>
            <div class="skeleton-line wide"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line narrow"></div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Testimonials with Steam Effect -->
    <!-- <section class="testimonials">
      <div class="coffee-cups"></div>
      <div class="container">
        <div class="section-header">
          <div class="section-badge">
            <span class="badge-icon">🌟</span>
            Voices from the Field
          </div>
          <h2>Trusted by Field Officers</h2>
          <p>Feedback from across Uganda's coffee belt</p>
        </div>
        
        <div class="testimonial-container">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="testimonial"
            :class="{ active: index === activeTestimonial }"
          >
            <div class="testimonial-content">
              <div class="quote-steam"></div>
              <div class="quote-icon">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M25 35L15 45L25 55" stroke="#4a7c59" stroke-width="2" stroke-linecap="round"/>
                  <path d="M35 35L45 45L35 55" stroke="#6b4226" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="rating">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{ filled: star <= testimonial.rating }"
                >★</span>
              </div>
              <p>{{ testimonial.text }}</p>
              <div class="testimonial-author">
                <div class="avatar">{{ testimonial.avatar }}</div>
                <div class="author-info">
                  <div class="name">{{ testimonial.name }}</div>
                  <div class="company">{{ testimonial.role }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="testimonial-indicators">
            <button
              v-for="(t, index) in testimonials"
              :key="index"
              :class="{ active: index === activeTestimonial }"
              @click="activeTestimonial = index"
            >
              <span class="indicator-bean"></span>
            </button>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Footer with Coffee Plant Design -->
    <footer class="footer" id="support">
      <div class="coffee-plant"></div>
      <div class="container">
        <div class="footer-content">
          <div class="footer-section brand">
            <div class="footer-logo">
              <div class="footer-bean-icon">
                <VImg src="/logo.png" alt="TraceCoffield Logo" width="60" />
              </div>
              <div>
                <div class="footer-brand-name"><span>Trace</span>Coffield</div>
                <div class="footer-brand-sub">Field Officer Platform</div>
              </div>
            </div>
            <p>Empowering Uganda's coffee field officers with smart tools for farm mapping, harvest lending, and payment management.</p>
          </div>

          <div class="footer-section">
            <h4>Platform</h4>
            <RouterLink to="#">Farm Polygon Mapping</RouterLink>
            <RouterLink to="#">Loan Disbursement</RouterLink>
            <RouterLink to="#">Cherry Collection</RouterLink>
            <RouterLink to="#">Payment Records</RouterLink>
          </div>

          <div class="footer-section">
            <h4>Company</h4>
            <RouterLink to="#">About TraceCoffield</RouterLink>
            <RouterLink to="#">Field Officer Guide</RouterLink>
            <RouterLink to="#">Partner Cooperatives</RouterLink>
            <RouterLink to="#">Blog</RouterLink>
          </div>

          <div class="footer-section contact">
            <h4>Contact & Support</h4>
            <a href="tel:+256700000000">
              <span class="contact-icon">📞</span> +256 700 000 000
            </a>
            <a href="mailto:support@tracecoffield.ug">
              <span class="contact-icon">✉️</span> support@tracecoffield.ug
            </a>
            <div class="business-hours">
              <strong>Support Hours:</strong><br>
              Mon–Fri: 7AM–8PM EAT<br>
              Sat: 8AM–4PM EAT
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2024 TraceCoffield. Built for Uganda's coffee belt.</p>
          <div class="footer-links">
            <RouterLink to="#">Privacy Policy</RouterLink>
            <span class="separator">·</span>
            <RouterLink to="#">Terms</RouterLink>
          </div>
          <div class="footer-social">
            <a href="#" aria-label="Twitter" class="social-link">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M18.9 4.3c-0.6 0.3-1.3 0.5-2 0.6 0.7-0.4 1.3-1.1 1.5-1.9 -0.7 0.4-1.4 0.7-2.2 0.9 -0.6-0.7-1.5-1.1-2.5-1.1 -1.9 0-3.4 1.5-3.4 3.4 0 0.3 0 0.5 0.1 0.8 -2.8-0.1-5.3-1.5-7-3.6 -0.3 0.5-0.5 1.1-0.5 1.7 0 1.2 0.6 2.2 1.5 2.8 -0.6 0-1.1-0.2-1.6-0.4 0 0 0 0 0 0 0 1.7 1.2 3.1 2.8 3.4 -0.3 0.1-0.6 0.1-0.9 0.1 -0.2 0-0.4 0-0.6-0.1 0.4 1.3 1.6 2.3 3.1 2.3 -1.1 0.9-2.5 1.4-4.1 1.4 -0.3 0-0.5 0-0.8-0.1 1.5 1 3.3 1.5 5.2 1.5 6.2 0 9.6-5.1 9.6-9.6 0-0.1 0-0.3 0-0.4 0.7-0.5 1.3-1.1 1.7-1.8z"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" class="social-link">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2C5.6 2 2 5.6 2 10c0 4 2.9 7.3 6.7 8v-5.7H6.7V10h2v-1.7c0-2.2 1.3-3.4 3.3-3.4 1 0 2 0.2 2 0.2v2.2h-1.1c-1.1 0-1.4 0.7-1.4 1.4V10h2.4l-0.4 2.3h-2V18c3.8-0.7 6.7-4 6.7-8 0-4.4-3.6-8-8-8z"/>
              </svg>
            </a>
            <a href="#" aria-label="WhatsApp" class="social-link">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2C5.6 2 2 5.6 2 10c0 1.5 0.4 2.9 1.2 4.1L2.3 17.1c-0.1 0.4 0.2 0.8 0.6 0.8 0 0 0 0 0 0l3-0.9C7.1 17.7 8.5 18 10 18c4.4 0 8-3.6 8-8S14.4 2 10 2zM8.1 7.3c0.1 0 0.2-0.1 0.3-0.1 0.2 0 0.4 0 0.6 0 0.2 0 0.4 0.2 0.5 0.4 0.1 0.3 0.6 1.4 0.6 1.5 0.1 0.2 0.1 0.5-0.1 0.7 -0.2 0.3-0.3 0.4-0.5 0.6 -0.2 0.2-0.2 0.4-0.1 0.6 0.2 0.3 0.8 1.4 1.7 2.1 1 0.8 1.7 1 2 1.1 0.3 0.1 0.6 0 0.8-0.2 0.2-0.2 0.8-0.9 1-1.2 0.2-0.3 0.5-0.3 0.8-0.2 0.3 0.1 2 0.9 2.3 1.1 0.3 0.2 0.5 0.3 0.6 0.5 0.1 0.3 0.1 1.1-0.4 1.9 -0.4 0.8-1.3 1.3-2 1.4 -1.5 0.2-3.1-0.5-4.3-1.3 -1.7-1.1-3.1-2.7-4.1-4.6 -0.7-1.2-1-2.4-0.9-3.5 0-0.6 0.3-1.2 0.8-1.6C7.5 7.5 7.8 7.4 8.1 7.3z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style >
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

/* ===================== VARIABLES ===================== */
:root {
  --green-dark: #1b4332;
  --green-mid: #266B4C;
  --green-main: #4a7c59;
  --green-light: #74b88a;
  --green-pale: #d4edda;
  --brown-dark: #3d2008;
  --brown-mid: #6b4226;
  --brown-light: #a0522d;
  --brown-cream: #f5ede3;
  --cream: #faf6f0;
  --text-dark: #1a120b;
  --text-mid: #4a4035;
  --text-light: #7a6f65;
  --bean-shadow: rgba(0, 0, 0, 0.1);
  --coffee-steam: rgba(255, 255, 255, 0.6);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.homepage {
  position: relative;
  background: var(--cream);
  color: var(--text-dark);
  font-family : Arial, sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
}

/* ===================== COFFEE AMBIANCE ===================== */
.coffee-ambiance {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bean-grid {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 30% 40%, rgba(74, 124, 89, 0.03) 0%, transparent 30%),
    radial-gradient(circle at 70% 60%, rgba(107, 66, 38, 0.03) 0%, transparent 30%),
    repeating-linear-gradient(45deg, 
      rgba(74, 124, 89, 0.02) 0px, 
      rgba(74, 124, 89, 0.02) 2px,
      transparent 2px, 
      transparent 8px
    );
}

.bean-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bean-particle {
  position: absolute;
  width: var(--size);
  height: calc(var(--size) * 0.7);
  background: linear-gradient(135deg, var(--green-mid), var(--brown-mid));
  border-radius: 50%;
  transform: rotate(var(--rotate));
  left: var(--left);
  top: -10%;
  opacity: 0.03;
  animation: floatDown 20s linear infinite;
  animation-delay: var(--delay);
}

@keyframes floatDown {
  from { transform: translateY(-10%) rotate(0deg); }
  to { transform: translateY(110vh) rotate(360deg); }
}

.steam-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
  animation: steam 8s ease-in-out infinite;
}

@keyframes steam {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
}

.coffee-stain {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(107, 66, 38, 0.05) 0%, transparent 70%);
  filter: blur(20px);
}

.stain-1 {
  width: 300px;
  height: 300px;
  top: 20%;
  left: 10%;
  animation: stainFloat 15s ease-in-out infinite;
}

.stain-2 {
  width: 400px;
  height: 400px;
  bottom: 10%;
  right: 5%;
  background: radial-gradient(circle, rgba(74, 124, 89, 0.05) 0%, transparent 70%);
  animation: stainFloat 18s ease-in-out infinite reverse;
}

@keyframes stainFloat {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
}

/* ===================== HEADER ===================== */
.header {
  position: fixed;
  inset-inline: 0;
  inset-block-start: 0;
  z-index: 1000;
  background: rgba(250, 246, 240, 0.85);
  backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(74, 124, 89, 0.15);
  padding: 10px 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.header.scrolled {
  background: rgba(250, 246, 240, 0.95);
  box-shadow: 0 8px 32px rgba(27, 67, 50, 0.15);
  padding: 8px 0;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 50px;
  height: 50px;
  /* background: linear-gradient(135deg, var(--green-mid), var(--brown-mid)); */
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(45, 106, 79, 0.2);
  transition: transform 0.3s ease;
}

.logo:hover .logo-icon {
  transform: rotate(-5deg) scale(1.05);
}

.logo-bean svg {
  width: 28px;
  height: 28px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.logo-text {
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 24px;
  line-height: 1;
}

.logo-trace {
  color: var(--green-dark);
  font-weight: 800;
}

.logo-coffield {
  color: var(--brown-mid);
  font-weight: 800;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  color: var(--text-mid);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  position: relative;
  padding: 6px 0;
  transition: color 0.3s;
}

.nav-links a::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  inset-block-end: 0;
  inline-size: 0;
  block-size: 2px;
  background: var(--green-main);
  transition: inline-size 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--green-mid);
}

.nav-links a:hover::before,
.nav-links a.active::before {
  inline-size: 100%;
}

/* ===================== BUTTONS ===================== */
.btn-ghost {
  border: none;
  background: transparent;
  color: var(--text-mid);
  cursor: pointer;
  font-weight: 600;
  font-family: 'Arial', 'Helvetica', sans-serif;
  padding: 10px 20px;
  border-radius: 12px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.btn-ghost::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--green-pale);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
  z-index: -1;
}

.btn-ghost:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}

.btn-ghost:hover {
  color: var(--green-dark);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 14px;
  background: #266B4C;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-family: Arial, Helvetica, sans-serif;
  padding: 12px 24px;
  font-size: 15px;
  box-shadow: 0 8px 20px rgba(45, 106, 79, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.btn-primary:hover::after {
  transform: translateX(100%);
}

.btn-primary.large {
  padding: 16px 32px;
  font-size: 17px;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(45, 106, 79, 0.4);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 2px solid var(--green-main);
  border-radius: 14px;
  background: transparent;
  color: var(--green-dark);
  cursor: pointer;
  font-weight: 600;
  font-family: Arial, Helvetica, sans-serif;
  padding: 12px 24px;
  font-size: 15px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-outline::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--green-pale);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s ease;
  z-index: -1;
}

.btn-outline:hover::before {
  transform: scaleY(1);
  transform-origin: bottom;
}

.btn-outline.large {
  padding: 15px 30px;
  font-size: 17px;
}

.btn-outline:hover {
  border-color: var(--green-mid);
  transform: translateY(-2px);
}

.btn-outline.white {
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.btn-outline.white:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.btn-icon {
  font-size: 18px;
  transition: transform 0.3s;
}

.btn-primary:hover .btn-icon {
  transform: rotate(-10deg) scale(1.2);
}

.arrow {
  display: inline-block;
  transition: transform 0.3s;
}

.btn-primary:hover .arrow,
.btn-outline:hover .arrow {
  transform: translateX(6px);
}

/* ===================== HERO ===================== */
.hero {
  position: relative;
  /* min-height: 100vh; */
  padding: 100px 0 50px;
  overflow: hidden;
  background: linear-gradient(160deg, 
    rgba(240, 247, 242, 0.9) 0%, 
    rgba(250, 246, 240, 0.95) 60%, 
    rgba(245, 237, 227, 0.9) 100%
  );
}

.hero-coffee-beans {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-bean {
  position: absolute;
  width: 60px;
  height: 40px;
  background: linear-gradient(135deg, var(--green-mid), var(--brown-mid));
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(4px);
  animation: float 10s ease-in-out infinite;
}

.bean-1 {
  top: 20%;
  left: 10%;
  transform: rotate(-15deg);
  animation-delay: 0s;
}

.bean-2 {
  top: 60%;
  right: 15%;
  width: 80px;
  height: 50px;
  transform: rotate(25deg);
  animation-delay: 2s;
}

.bean-3 {
  bottom: 20%;
  left: 20%;
  width: 40px;
  height: 25px;
  transform: rotate(-45deg);
  animation-delay: 4s;
}

.bean-4 {
  top: 40%;
  right: 25%;
  width: 70px;
  height: 45px;
  transform: rotate(15deg);
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(var(--rotate)); }
  50% { transform: translateY(-20px) rotate(var(--rotate)); }
}

.hero-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 50px;
  align-items: center;
  position: relative;
}

.hero-text {
  animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(74, 124, 89, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(74, 124, 89, 0.25);
  border-radius: 40px;
  color: var(--green-mid);
  font-size: 14px;
  font-weight: 600;
  padding: 8px 18px;
  margin-bottom: 28px;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green-main);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.hero-title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 25px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-dark);
}

.gradient-text {
  background: linear-gradient(135deg, var(--green-dark) 0%, var(--brown-mid) 50%, var(--brown-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradientShift 5s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.typewriter {
  position: relative;
  display: inline-block;
}

.typewriter::after {
  content: '';
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background: var(--green-main);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-subtitle {
  color: var(--text-mid);
  font-size: 16px;
  line-height: 1.4;
  margin-bottom: 20px;
  max-width: 520px;
  position: relative;
  padding-left: 20px;
  border-left: 3px solid var(--green-main);
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(27, 67, 50, 0.1);
  border: 1px solid rgba(74, 124, 89, 0.15);
}

.stat-item {
  padding: 20px 16px;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
}

.stat-item:hover {
  background: white;
  transform: translateY(-2px);
}

.stat-value {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: var(--green-dark);
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: var(--text-light);
  margin-top: 6px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* ===================== MAP CARD ===================== */
.hero-visual {
  animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.map-card {
  background: white;
  border-radius: 28px;
  box-shadow: 0 30px 80px rgba(27, 67, 50, 0.2);
  overflow: hidden;
  border: 1px solid rgba(74, 124, 89, 0.15);
  transition: all 0.4s;
}

.map-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 40px 100px rgba(27, 67, 50, 0.3);
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  background: linear-gradient(135deg, var(--green-dark), #2a4f3a);
  color: white;
}

.map-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.map-status {
  font-size: 13px;
  color: var(--green-light);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.map-body {
  padding: 0;
  position: relative;
  overflow: hidden;
}

.farm-map-svg {
  width: 100%;
  display: block;
  transition: transform 0.5s;
}

.map-card:hover .farm-map-svg {
  transform: scale(1.02);
}

.map-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  background: linear-gradient(90deg, #f9fdf9, white);
  border-top: 1px solid var(--green-pale);
}

.map-farmer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.farmer-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--green-mid), var(--brown-mid));
  color: white;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3);
  transition: all 0.3s;
}

.map-farmer:hover .farmer-avatar {
  transform: scale(1.1) rotate(5deg);
}

.farmer-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-dark);
}

.farmer-meta {
  font-size: 12px;
  color: var(--text-light);
  font-weight: 500;
}

.loan-chip {
  background: linear-gradient(135deg, rgba(74, 124, 89, 0.1), rgba(107, 66, 38, 0.1));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(74, 124, 89, 0.2);
  border-radius: 30px;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--green-dark);
  transition: all 0.3s;
}

.loan-chip:hover {
  background: linear-gradient(135deg, rgba(74, 124, 89, 0.2), rgba(107, 66, 38, 0.2));
  transform: translateX(-2px);
}

.loan-chip strong {
  color: var(--green-mid);
  font-size: 16px;
}

/* ===================== SECTION HEADERS ===================== */
.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(74, 124, 89, 0.1);
  backdrop-filter: blur(8px);
  color: var(--green-mid);
  border-radius: 40px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 18px;
  border: 1px solid rgba(74, 124, 89, 0.2);
}

.badge-icon {
  font-size: 18px;
}

.section-header h2 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 40px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 12px;
  line-height: 1.2;
}

.section-header p {
  color: var(--text-mid);
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
}

/* ===================== LOAN PROCESS ===================== */
.loan-process {
  position: relative;
  padding: 50px 0;
  background: linear-gradient(180deg, var(--green-pale) 0%, transparent 100%);
  overflow: hidden;
}

.coffee-drip {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(circle at 50% 0%, rgba(107, 66, 38, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.process-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  gap: 20px;
}

.process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  text-align: center;
  padding: 0 10px;
}

.step-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  border: 4px solid var(--green-main);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 12px 32px rgba(74, 124, 89, 0.2);
  position: relative;
  z-index: 2;
  transition: all 0.4s;
}

.process-step:hover .step-circle {
  transform: scale(1.1) rotate(5deg);
  border-color: var(--brown-mid);
}

.step-number {
  font-family: Arial, sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: var(--green-mid);
  transition: all 0.4s;
}

.process-step:hover .step-number {
  color: var(--brown-mid);
}

.step-coffee {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(107, 66, 38, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.process-step:hover .step-coffee {
  opacity: 1;
}

.step-content h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.step-content p {
  font-size: 13px;
  color: var(--text-light);
  line-height: 1.6;
  max-width: 180px;
  margin: 0 auto;
}

.step-connector {
  position: absolute;
  inset-block-start: 40px;
  inset-inline-start: calc(50% + 40px);
  inline-size: calc(100% - 80px);
  block-size: 2px;
  background: linear-gradient(90deg, var(--green-main), var(--green-pale));
  z-index: 1;
}

.connector-beans {
  position: relative;
  width: 100%;
  height: 100%;
}

.connector-beans::before,
.connector-beans::after {
  content: '☕';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0.3;
  animation: moveBean 3s linear infinite;
}

.connector-beans::before {
  left: 0;
}

.connector-beans::after {
  right: 0;
  animation-delay: 1.5s;
}

@keyframes moveBean {
  0% { transform: translateY(-50%) translateX(0); opacity: 0.3; }
  50% { transform: translateY(-50%) translateX(10px); opacity: 0.6; }
  100% { transform: translateY(-50%) translateX(0); opacity: 0.3; }
}

/* ===================== FEATURES ===================== */
.features {
  padding: 50px 0;
  position: relative;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 32px;
}

.feature-card {
  position: relative;
  overflow: hidden;
  padding: 30px 20px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 28px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 30px 60px rgba(74, 124, 89, 0.15);
  border-color: var(--green-main);
}

.feature-icon-wrapper {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(74, 124, 89, 0.1), rgba(107, 66, 38, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
  transition: all 0.4s;
  border: 1px solid rgba(74, 124, 89, 0.2);
}

.feature-card:hover .feature-icon-wrapper {
  transform: scale(1.1) rotate(-5deg);
  background: linear-gradient(135deg, rgba(74, 124, 89, 0.2), rgba(107, 66, 38, 0.2));
}

.feature-emoji {
  font-size: 32px;
  transition: all 0.4s;
}

.feature-card:hover .feature-emoji {
  transform: scale(1.1);
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-dark);
  transition: all 0.4s;
}

.feature-card:hover h3 {
  color: var(--green-mid);
}

.feature-card p {
  color: var(--text-mid);
  line-height: 1.7;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

.feature-hover-effect {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.coffee-splash {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
              rgba(107, 66, 38, 0.05) 0%, 
              transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.feature-card:hover .coffee-splash {
  opacity: 1;
}

/* ===================== SERVICES ===================== */
.services {
  padding: 100px 0;
  background: linear-gradient(180deg, transparent, rgba(74, 124, 89, 0.05));
  position: relative;
  overflow: hidden;
}

.bean-rain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(45deg, 
    rgba(107, 66, 38, 0.02) 0px,
    rgba(107, 66, 38, 0.02) 20px,
    transparent 20px,
    transparent 40px
  );
  animation: rainMove 20s linear infinite;
}

@keyframes rainMove {
  from { background-position: 0 0; }
  to { background-position: 100px 100px; }
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.service-card {
  position: relative;
  padding: 32px 24px;
  border: 1px solid rgba(74, 124, 89, 0.12);
  border-radius: 24px;
  background: white;
  text-align: center;
  transition: all 0.4s;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 48px rgba(74, 124, 89, 0.15);
  border-color: var(--green-main);
}

.card-coffee-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 30%, rgba(74, 124, 89, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(107, 66, 38, 0.03) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.service-card:hover .card-coffee-bg {
  opacity: 1;
}

.service-icon {
  font-size: 42px;
  margin-bottom: 18px;
  transition: all 0.4s;
}

.service-card:hover .service-icon {
  transform: rotate(-10deg) scale(1.1);
}

.service-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--text-dark);
}

.route {
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 16px;
  font-weight: 500;
}

.service-price {
  color: var(--green-mid);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 20px;
  transition: all 0.4s;
}

.service-card:hover .service-price {
  color: var(--brown-mid);
  transform: scale(1.05);
}

.service-price small {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--text-light);
}

.service-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  border: 2px solid var(--green-main);
  border-radius: 14px;
  background: white;
  color: var(--green-dark);
  cursor: pointer;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
  padding: 12px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.service-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--green-mid), var(--green-main));
  transform: translateX(-100%);
  transition: transform 0.3s;
  z-index: 0;
}

.service-btn:hover::before {
  transform: translateX(0);
}

.service-btn span,
.service-btn .arrow {
  position: relative;
  z-index: 1;
  transition: all 0.3s;
}

.service-btn:hover {
  color: white;
  border-color: transparent;
}

.service-btn:hover .arrow {
  transform: translateX(6px);
}

/* Skeleton Loader */
.skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, #eee 0%, #f5f5f5 50%, #eee 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  margin: 12px auto;
}

.skeleton-line.wide { width: 80%; }
.skeleton-line.narrow { width: 50%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ===================== TESTIMONIALS ===================== */
.testimonials {
  padding: 100px 0;
  position: relative;
}

.coffee-cups {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(74, 124, 89, 0.03) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(107, 66, 38, 0.03) 0%, transparent 30%);
  pointer-events: none;
}

.testimonial-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  min-height: 340px;
}

.testimonial {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  transform: translateX(40px) scale(0.95);
  pointer-events: none;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.testimonial.active {
  opacity: 1;
  transform: translateX(0) scale(1);
  pointer-events: all;
}

.testimonial-content {
  background: white;
  border-radius: 32px;
  padding: 48px;
  box-shadow: 0 24px 64px rgba(27, 67, 50, 0.1);
  border: 1px solid rgba(74, 124, 89, 0.1);
  position: relative;
  overflow: hidden;
}

.quote-steam {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.8) 0%, transparent 50%);
  opacity: 0;
  animation: steamRise 8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes steamRise {
  0%, 100% { opacity: 0; transform: translateY(0); }
  50% { opacity: 0.3; transform: translateY(-10px); }
}

.quote-icon {
  position: absolute;
  top: 24px;
  left: 32px;
  opacity: 0.1;
  transition: all 0.4s;
}

.testimonial.active .quote-icon {
  opacity: 0.2;
  transform: rotate(5deg);
}

.rating {
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  justify-content: center;
}

.star {
  font-size: 22px;
  color: #ddd;
  transition: all 0.3s;
  cursor: default;
}

.star.filled {
  color: #f4b942;
  animation: starPulse 1s ease;
}

@keyframes starPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.testimonial-content p {
  color: var(--text-dark);
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--green-mid), var(--brown-mid));
  color: white;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(45, 106, 79, 0.3);
  transition: all 0.4s;
}

.testimonial.active .avatar {
  transform: scale(1.1) rotate(5deg);
}

.name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.company {
  font-size: 14px;
  color: var(--text-light);
  font-style: italic;
}

.testimonial-indicators {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 48px;
}

.testimonial-indicators button {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: none;
  background: #cde0d2;
  cursor: pointer;
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
}

.indicator-bean {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, var(--green-mid), var(--brown-mid));
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.testimonial-indicators button.active {
  width: 40px;
  border-radius: 20px;
  background: var(--green-mid);
}

.testimonial-indicators button.active .indicator-bean {
  opacity: 0.3;
}

/* ===================== CTA ===================== */
.cta {
  padding: 100px 0;
  position: relative;
}

.coffee-pour {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(180deg, 
    rgba(107, 66, 38, 0.1) 0%,
    transparent 100%
  );
  pointer-events: none;
}

.cta-content {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, 
    var(--green-dark) 0%, 
    #2d6a4f 40%, 
    var(--brown-dark) 100%
  );
  border-radius: 40px;
  padding: 100px 60px;
  text-align: center;
  box-shadow: 0 40px 80px rgba(27, 67, 50, 0.3);
}

.cta-beans {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background-image: 
    radial-gradient(circle at 20% 30%, white 0%, transparent 20%),
    radial-gradient(circle at 80% 70%, white 0%, transparent 20%);
  background-size: 60px 60px;
  animation: rotateBeans 30s linear infinite;
}

@keyframes rotateBeans {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bean-group {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cellipse cx='30' cy='30' rx='16' ry='10' fill='rgba(255,255,255,0.1)' transform='rotate(-30 30 30)'/%3E%3C/svg%3E");
  background-size: 60px 60px;
}

.cta-content h2 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 52px;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cta-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  margin-bottom: 42px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.cta-content .btn-primary {
  background: white;
  color: var(--green-dark);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.cta-content .btn-primary:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

/* ===================== FOOTER ===================== */
.footer {
  position: relative;
  background: linear-gradient(135deg, var(--brown-dark) 0%, #4a2c1a 100%);
  color: white;
  padding: 100px 0 40px;
  overflow: hidden;
}

.coffee-plant {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 80%, rgba(74, 124, 89, 0.1) 0%, transparent 40%),
              radial-gradient(circle at 80% 20%, rgba(107, 66, 38, 0.1) 0%, transparent 40%);
  pointer-events: none;
}

.footer-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr;
  gap: 48px;
  margin-bottom: 60px;
}

.footer-section.brand {
  max-width: 360px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
}

.footer-bean-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.4s;
}

.footer-bean-icon:hover {
  transform: rotate(-5deg) scale(1.05);
}

.footer-bean-icon svg {
  width: 32px;
  height: 32px;
}

.footer-brand-name {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: white;
}

.footer-brand-name span {
  color: var(--green-light);
}

.footer-brand-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-top: 2px;
}

.footer-section p {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.8;
  font-size: 14px;
}

.footer-section h4 {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin-bottom: 22px;
  position: relative;
  display: inline-block;
}

.footer-section h4::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--green-light), transparent);
}

.footer-section a {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.footer-section a:hover {
  color: var(--green-light);
  transform: translateX(8px);
}

.contact-icon {
  font-size: 16px;
  opacity: 0.7;
}

.business-hours {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  line-height: 1.8;
  margin-top: 18px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.business-hours strong {
  color: rgba(255, 255, 255, 0.9);
}

.footer-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 32px;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

.footer-links {
  display: flex;
  gap: 8px;
  align-items: center;
}

.footer-links a {
  color: var(--green-light);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
}

.footer-links a:hover {
  color: white;
  text-decoration: underline;
}

.separator {
  color: rgba(255, 255, 255, 0.2);
}

.footer-social {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-link:hover {
  background: var(--green-mid);
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.social-link svg {
  width: 20px;
  height: 20px;
}

/* ===================== RESPONSIVE ===================== */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  
  .hero-title {
    font-size: 48px;
  }
  
  .process-steps {
    flex-direction: column;
    align-items: flex-start;
    gap: 40px;
  }
  
  .step-connector {
    display: none;
  }
  
  .process-step {
    flex-direction: row;
    gap: 24px;
    text-align: left;
  }
  
  .step-content p {
    max-width: 300px;
  }
  
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
  
  .footer-section.brand {
    grid-column: 1 / -1;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .container {
    padding: 0 20px;
  }
  
  .hero {
    padding: 140px 0 80px;
  }
  
  .hero-title {
    font-size: 38px;
  }
  
  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .section-header h2 {
    font-size: 34px;
  }
  
  .features-grid,
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .testimonial-content {
    padding: 32px 24px;
  }
  
  .testimonial-content p {
    font-size: 16px;
  }
  
  .cta-content {
    padding: 60px 24px;
  }
  
  .cta-content h2 {
    font-size: 34px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .footer-links {
    justify-content: center;
  }
}
</style>
