<template>
  <div class="td-root">

    <!-- ═══════════════════════ HEADER ═══════════════════════ -->
    <header class="td-header rounded-t-lg">
      <div class="td-header-inner">
        <div class="td-brand">
          <div class="td-brand-icon">
            <VIcon icon="tabler-package" size="20" color="white" />
          </div>
          <div>
            <div class="td-brand-name">DeliveryTrack</div>
            <div class="td-brand-sub">Real-time logistics</div>
          </div>
        </div>
        <VBtn @click="refreshPage" variant="outlined" size="small" class="td-refresh-btn" prepend-icon="tabler-refresh">
          Refresh
        </VBtn>
      </div>
    </header>

    <!-- ═══════════════════════ SEARCH HERO ═══════════════════════ -->
    <section class="td-hero">
      <div class="td-hero-inner">
        <h1 class="td-hero-title">Where is your<br /><span class="td-hero-accent">package?</span></h1>

        <div class="td-search-pill">
          <VIcon icon="tabler-hash" size="16" class="td-search-prefix" />
          <input
            v-model="trackingNumber"
            type="text"
            class="td-search-input"
            placeholder="Enter tracking number…"
            @keyup.enter="searchDelivery"
          />
          <button class="td-search-go" @click="searchDelivery" :disabled="!trackingNumber || searchLoading">
            <VIcon :icon="searchLoading ? 'tabler-loader-2' : 'tabler-arrow-right'" size="18" :class="{ 'spin': searchLoading }" />
          </button>
        </div>

        <p class="td-search-hint">
          <VIcon icon="tabler-shield-check" size="13" /> Secure encrypted tracking
        </p>
      </div>
    </section>

    <!-- ═══════════════════════ CONTENT WRAPPER ═══════════════════════ -->
    <div class="td-content">

      <!-- ── RESULTS ── -->
      <div v-if="delivery" class="td-results">

        <!-- Status Banner -->
        <div class="td-status-bar" :class="`td-status-${delivery.status}`">
          <div class="td-status-left">
            <div class="td-status-icon-wrap">
              <VIcon :icon="getStatusIcon(delivery.status)" size="22" />
              <span class="td-status-ping" v-if="delivery.status === 'in_transit'"></span>
            </div>
            <div>
              <div class="td-status-label">{{ getStatusText(delivery.status) }}</div>
              <div class="td-status-tracking">{{ delivery.tracking_number }}</div>
            </div>
          </div>
          <div class="td-status-right">
            <div class="td-status-date">
              <VIcon icon="tabler-calendar" size="13" />
              {{ formatDate(delivery.created_at) }}
            </div>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="td-grid">

          <!-- Route Card -->
          <div class="td-card td-route-card">
            <div class="td-card-header">
              <VIcon icon="tabler-route" size="16" color="primary" />
              <span>Route</span>
            </div>
            <div class="td-route">
              <div class="td-route-stop">
                <div class="td-route-dot td-route-dot--from"></div>
                <div>
                  <div class="td-route-stop-label">From</div>
                  <div class="td-route-stop-val">{{ delivery.departure }}</div>
                </div>
              </div>
              <div class="td-route-line">
                <div class="td-route-dashes"></div>
                <VIcon icon="tabler-truck" size="18" class="td-route-truck" color="primary" />
              </div>
              <div class="td-route-stop">
                <div class="td-route-dot td-route-dot--to"></div>
                <div>
                  <div class="td-route-stop-label">To</div>
                  <div class="td-route-stop-val">{{ delivery.destination }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Details Card -->
          <div class="td-card">
            <div class="td-card-header">
              <VIcon icon="tabler-info-circle" size="16" color="primary" />
              <span>Details</span>
            </div>
            <div class="td-details-list">
              <div class="td-detail-row">
                <span class="td-detail-key"><VIcon icon="tabler-calendar" size="14" /> Scheduled</span>
                <span class="td-detail-val">{{ formatDateTime(delivery.delivery_date_time) }}</span>
              </div>
              <div class="td-detail-row">
                <span class="td-detail-key"><VIcon icon="tabler-credit-card" size="14" /> Payment</span>
                <span class="td-detail-val">{{ getPaymentMethodLabel(delivery.payment_method) }}</span>
              </div>
              <div class="td-detail-row">
                <span class="td-detail-key"><VIcon icon="tabler-cash" size="14" /> Total</span>
                <span class="td-detail-val td-price">${{ calculateDeliveryPrice(delivery) }}</span>
              </div>
              <div class="td-detail-row" v-if="delivery.instructions">
                <span class="td-detail-key"><VIcon icon="tabler-notes" size="14" /> Notes</span>
                <span class="td-detail-val">{{ delivery.instructions }}</span>
              </div>
            </div>
          </div>

          <!-- Client Card -->
          <div class="td-card">
            <div class="td-card-header">
              <VIcon icon="tabler-user" size="16" color="primary" />
              <span>Sender</span>
            </div>
            <div class="td-party">
              <div class="td-party-avatar td-party-avatar--client">
                {{ (delivery.client?.name || 'C').charAt(0) }}
              </div>
              <div class="td-party-info">
                <div class="td-party-name">{{ delivery.client?.name || 'N/A' }}</div>
                <div class="td-party-meta"><VIcon icon="tabler-phone" size="13" /> {{ delivery.client?.phone || 'N/A' }}</div>
                <div class="td-party-meta"><VIcon icon="tabler-map-pin" size="13" /> {{ delivery.client?.address || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <div class="td-card">
            <div class="td-card-header">
              <VIcon icon="tabler-user-edit" size="16" color="primary" />
              <span>Receiver</span>
            </div>
            <div class="td-party">
              <div class="td-party-avatar td-party-avatar--client">
                {{ (delivery.recipient_name || 'C').charAt(0) }}
              </div>
              <div class="td-party-info">
                <div class="td-party-name">{{ delivery.recipient_name || 'N/A' }}</div>
                <div class="td-party-meta"><VIcon icon="tabler-phone" size="13" /> {{ delivery.recipient_phone || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <!-- Courier Card -->
          <div class="td-card">
            <div class="td-card-header">
              <VIcon icon="tabler-truck" size="16" color="info" />
              <span>Courier</span>
            </div>
            <div class="td-party">
              <div class="td-party-avatar td-party-avatar--courier">
                {{ (delivery.courier?.name || 'D').charAt(0) }}
              </div>
              <div class="td-party-info">
                <div class="td-party-name">{{ delivery.courier?.name || 'N/A' }}</div>
                <div class="td-party-meta"><VIcon icon="tabler-phone" size="13" /> {{ delivery.courier?.phone || 'N/A' }}</div>
                <div class="td-party-meta"><VIcon icon="tabler-truck" size="13" /> {{ delivery.courier?.vehicle_no || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <!-- Parcels Card — full width -->
          <div class="td-card td-card--full">
            <div class="td-card-header">
              <VIcon icon="tabler-package" size="16" color="primary" />
              <span>Parcels</span>
              <span class="td-badge">{{ delivery.parcels?.length || 0 }} items</span>
              <span class="td-badge td-badge--neutral ml-auto">Total: {{ calculateTotalWeight(delivery.parcels) }} kg</span>
            </div>
            <div class="td-parcels">
              <div v-for="(parcel, i) in delivery.parcels" :key="i" class="td-parcel">
                <div class="td-parcel-num">{{ i + 1 }}</div>
                <div class="td-parcel-body">
                  <div class="td-parcel-desc">{{ parcel.description }}</div>
                  <div class="td-parcel-meta">
                    <span><VIcon icon="tabler-weight" size="12" /> {{ parcel.weight }} kg</span>
                    <span v-if="parcel.value"><VIcon icon="tabler-scale" size="13" /> ${{ formatNumber(parcel.value) }}</span>
                  </div>
                </div>
                <VChip v-if="parcel.status" size="x-small" :color="getStatusColor(parcel.status)" variant="tonal">{{ parcel.status }}</VChip>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline + Actions -->
        <div class="td-lower">

          <!-- Timeline -->
          <div class="td-card td-timeline-card">
            <div class="td-card-header">
              <VIcon icon="tabler-timeline" size="16" color="primary" />
              <span>Timeline</span>
              <span class="td-badge">{{ timeline.length }}</span>
            </div>
            <div class="td-timeline">
              <div
                v-for="(ev, i) in timeline"
                :key="i"
                class="td-tl-item"
                :class="{ 'td-tl-item--active': i === 0 }"
              >
                <div class="td-tl-left">
                  <div class="td-tl-dot" :class="`td-tl-dot--${ev.status}`">
                    <VIcon :icon="getStatusIcon(ev.status)" size="13" />
                  </div>
                  <div class="td-tl-connector" v-if="i < timeline.length - 1"></div>
                </div>
                <div class="td-tl-body">
                  <div class="td-tl-title">{{ ev.title }}</div>
                  <div class="td-tl-desc">{{ ev.description }}</div>
                  <div class="td-tl-meta">
                    <span><VIcon icon="tabler-clock" size="11" /> {{ formatDateTime(ev.timestamp) }}</span>
                    <span v-if="ev.location"><VIcon icon="tabler-map-pin" size="11" /> {{ ev.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="td-card td-actions-card" v-if="canUpdateStatus">
            <div class="td-card-header">
              <VIcon icon="tabler-edit" size="16" color="primary" />
              <span>Update Status</span>
            </div>
            <p class="td-actions-sub">Current: <strong>{{ getStatusText(delivery.status) }}</strong></p>
            <div class="td-actions-btns">
              <VBtn
                v-for="action in availableActions"
                :key="action.status"
                @click="updateDeliveryStatus(action.status)"
                :color="action.color"
                variant="tonal"
                size="large"
                :loading="updatingStatus === action.status"
                :disabled="!!updatingStatus"
                class="td-action-btn"
              >
                <VIcon :icon="action.icon" class="mr-2" size="18" />
                {{ action.label }}
              </VBtn>
            </div>
          </div>
        </div>

        <!-- Documents -->
        <div class="td-card td-docs-card" v-if="delivery.documents?.length">
          <div class="td-card-header">
            <VIcon icon="tabler-file-text" size="16" color="primary" />
            <span>Documents</span>
          </div>
          <div class="td-docs-grid">
            <div v-for="(doc, i) in delivery.documents" :key="i" class="td-doc" @click="viewDocument(doc)">
              <div class="td-doc-icon" :class="getFileTypeClass(doc.type)">
                <VIcon :icon="getFileIcon(doc.type)" size="20" />
              </div>
              <div class="td-doc-info">
                <div class="td-doc-name">{{ doc.name || doc.file_name }}</div>
                <div class="td-doc-meta">{{ formatFileSize(doc.size) }}</div>
              </div>
              <VBtn icon="tabler-download" variant="text" size="x-small" @click.stop="downloadDocument(doc)" />
            </div>
          </div>
        </div>

        <!-- ═══════════════════════ RECEIPT (XPrinter 80mm) ═══════════════════════ -->
        <!-- <div class="td-receipt-section">
          <div class="td-receipt-label-bar">
            <div class="td-receipt-label-left">
              <VIcon icon="tabler-printer" size="16" color="primary" />
              <span class="td-receipt-label-text">Thermal Receipt — 80mm</span>
              <span class="td-badge">XPrinter</span>
            </div>
            <VBtn size="small" variant="tonal" color="primary" @click="printReceipt">
              <VIcon icon="tabler-printer" size="15" class="mr-1" /> Print Receipt
            </VBtn>
          </div>

          <div class="td-receipt-stage">
            <div class="td-receipt" id="td-receipt-print">
              <div class="rcpt-header">
                <div class="rcpt-logo"> <VImg :src="logoImg" max-width="100" alt="ParcelHub Logo"/> </div>
                <div class="rcpt-store-name">{{userData?.business || 'ParcelHub'}}</div>
                <div class="rcpt-tagline">Fast · Reliable · Secure</div>
              </div>

              <div class="rcpt-sep rcpt-sep--dash"></div>

              <div class="rcpt-center">
                <div class="rcpt-trk-label">TRACKING NUMBER</div>
                <div class="rcpt-trk-num">{{ delivery.tracking_number }}</div>
                <div class="rcpt-status-badge" :class="`rcpt-st--${delivery.status}`">
                  ● {{ getStatusText(delivery.status).toUpperCase() }}
                </div>
              </div>

              <div class="rcpt-sep rcpt-sep--dash"></div>

              <div class="rcpt-section">ROUTE</div>
              <div class="rcpt-row"><span class="rcpt-k">From</span><span class="rcpt-v">{{ delivery.departure }}</span></div>
              <div class="rcpt-row"><span class="rcpt-k">To</span><span class="rcpt-v">{{ delivery.destination }}</span></div>

              <div class="rcpt-sep rcpt-sep--dash"></div>

              <div class="rcpt-section">PARTIES</div>
              <div class="rcpt-row"><span class="rcpt-k">Client</span><span class="rcpt-v">{{ delivery.client?.name || 'N/A' }}</span></div>
              <div class="rcpt-row"><span class="rcpt-k">Phone</span><span class="rcpt-v">{{ delivery.client?.phone || 'N/A' }}</span></div>
              <div class="rcpt-row"><span class="rcpt-k">Courier</span><span class="rcpt-v">{{ delivery.courier?.name || 'N/A' }}</span></div>
              <div class="rcpt-row"><span class="rcpt-k">Vehicle</span><span class="rcpt-v">{{ delivery.courier?.vehicle_no || 'N/A' }}</span></div>

              <div class="rcpt-sep rcpt-sep--dash"></div>

              <div class="rcpt-section">PARCELS</div>
              <div v-for="(p, i) in delivery.parcels" :key="i" class="rcpt-parcel">
                <div class="rcpt-parcel-title">{{ i + 1 }}. {{ p.description }}</div>
                <div class="rcpt-row rcpt-row--indent">
                  <span class="rcpt-k">Weight</span><span class="rcpt-v">{{ p.weight }} kg</span>
                </div>
                <div class="rcpt-row rcpt-row--indent" v-if="p.dimensions">
                  <span class="rcpt-k">Dims</span><span class="rcpt-v">{{ p.dimensions }}</span>
                </div>
              </div>
              <div class="rcpt-row rcpt-row--bold">
                <span>TOTAL WEIGHT</span><span>{{ calculateTotalWeight(delivery.parcels) }} kg</span>
              </div>

              <div class="rcpt-sep rcpt-sep--dash"></div>

              <div class="rcpt-section">PAYMENT</div>
              <div class="rcpt-row"><span class="rcpt-k">Method</span><span class="rcpt-v">{{ getPaymentMethodLabel(delivery.payment_method) }}</span></div>
              <div class="rcpt-row"><span class="rcpt-k">Scheduled</span><span class="rcpt-v">{{ formatDate(delivery.delivery_date_time) }}</span></div>

              <div class="rcpt-sep rcpt-sep--solid"></div>

              <div class="rcpt-total">
                <span>TOTAL AMOUNT</span>
                <span class="rcpt-total-amt">${{ calculateDeliveryPrice(delivery) }}</span>
              </div>

              <div class="rcpt-sep rcpt-sep--solid"></div>

              <div v-if="delivery.instructions" class="rcpt-instructions">
                <div class="rcpt-section">INSTRUCTIONS</div>
                <div class="rcpt-instructions-text">{{ delivery.instructions }}</div>
                <div class="rcpt-sep rcpt-sep--dash"></div>
              </div>

              <div class="rcpt-footer">
                <div class="rcpt-footer-thanks">★ Thank you for delivering with us! ★</div>
                <div class="rcpt-footer-date">Printed: {{ formatDateTime(new Date().toISOString()) }}</div>
                <div class="rcpt-footer-email">{{userData?.email || 'support@parcelhub.com'}}</div>
                <div class="rcpt-barcode">
                  <div v-for="n in 44" :key="n" class="rcpt-bar" :style="{ height: (10 + ((n * 13 + n * n * 7) % 18)) + 'px' }"></div>
                </div>
                <div class="rcpt-barcode-num">{{ delivery.tracking_number }}</div>
              </div>
            </div>
            <div class="td-receipt-tail"></div>
          </div>
        </div> -->

      </div><!-- /td-results -->

      <!-- ── EMPTY / ERROR STATE ── -->
      <div v-if="showNoResults" class="td-empty">
        <div class="td-empty-icon">
          <VIcon :icon="error ? 'tabler-alert-triangle' : 'tabler-package-off'" size="56" :color="error ? 'error' : 'primary'" />
        </div>
        <h2 class="td-empty-title">{{ error ? 'Not Found' : 'Track a Package' }}</h2>
        <p class="td-empty-sub">{{ error || 'Enter a tracking number above to view delivery status and updates.' }}</p>
      </div>
    </div><!-- /td-content -->

    <!-- ═══════════════════════ STATUS DIALOG ═══════════════════════ -->
    <VDialog v-model="statusDialog" max-width="460px" persistent>
      <VCard class="td-dialog">
        <div class="td-dialog-top" :class="`td-status-${nextStatus}`">
          <div class="td-dialog-icon">
            <VIcon :icon="getStatusIcon(nextStatus)" size="26" />
          </div>
          <div class="td-dialog-title">Confirm Status Update</div>
          <div class="td-dialog-sub">{{ delivery?.tracking_number }}</div>
        </div>

        <VCardText class="td-dialog-body">
          <div class="td-dialog-change">
            <VChip :color="getStatusColor(delivery?.status)" variant="tonal" size="small">{{ getStatusText(delivery?.status) }}</VChip>
            <VIcon icon="tabler-arrow-right" size="18" color="primary" />
            <VChip :color="getStatusColor(nextStatus)" variant="tonal" size="small">{{ getStatusText(nextStatus) }}</VChip>
          </div>
          <VTextarea v-model="statusUpdateNotes" label="Notes (optional)" placeholder="Any notes…" variant="outlined" density="comfortable" rows="2" class="mt-4" />
          <VTextField v-model="statusUpdateLocation" label="Location (optional)" placeholder="Current location" variant="outlined" density="comfortable" prepend-inner-icon="tabler-map-pin" class="mt-3" />
        </VCardText>

        <VCardActions class="td-dialog-actions">
          <VBtn variant="outlined" color="secondary" @click="cancelStatusUpdate" :disabled="!!updatingStatus">Cancel</VBtn>
          <VBtn :color="getStatusColor(nextStatus)" variant="elevated" @click="confirmStatusUpdate" :loading="!!updatingStatus">Update Status</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const trackingNumber      = ref('')
const delivery            = ref(null)
const error               = ref('')
const searchLoading       = ref(false)
const updatingStatus      = ref(false)
const statusDialog        = ref(false)
const nextStatus          = ref('')
const statusUpdateNotes   = ref('')
const statusUpdateLocation= ref('')
const userData = JSON.parse(localStorage.getItem("user"));

const showNoResults = computed(() => !delivery.value && !searchLoading.value)
const canUpdateStatus = computed(() => delivery.value && ['pending','in_transit'].includes(delivery.value.status))

const availableActions = computed(() => {
  if (!delivery.value) return []
  const m = {
    pending:    [{ status:'in_transit', label:'Start In Transit', icon:'tabler-truck', color:'info'    },
                 { status:'cancelled',  label:'Cancel Delivery',  icon:'tabler-x',     color:'error'   }],
    in_transit: [{ status:'delivered',  label:'Mark Delivered',   icon:'tabler-check', color:'success' },
                 { status:'cancelled',  label:'Cancel Delivery',  icon:'tabler-x',     color:'error'   }]
  }
  return m[delivery.value.status] || []
})

const timeline = computed(() => {
  if (!delivery.value) return []
  const events = []
  if (delivery.value.status_history) {
    delivery.value.status_history.forEach(h => events.push({
      status: h.status, title: getStatusText(h.status),
      description: h.notes || `Status changed to ${getStatusText(h.status)}`,
      timestamp: h.created_at, location: h.location
    }))
  } else if (delivery.value.status_updated_at) {
    events.push({ status: delivery.value.status, title: getStatusText(delivery.value.status),
      description: `Delivery is now ${getStatusText(delivery.value.status).toLowerCase()}`,
      timestamp: delivery.value.status_updated_at,
      location: delivery.value.status === 'delivered' ? delivery.value.destination : 'In transit'
    })
  }
  return events.sort((a,b) => new Date(b.timestamp)-new Date(a.timestamp))
})

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
  } catch(e) { error.value = e.response?.data?.message || 'Delivery not found. Please check the tracking number.' }
  finally { searchLoading.value = false }
}

const updateDeliveryStatus = s => { nextStatus.value = s; statusDialog.value = true }

const confirmStatusUpdate = async () => {
  if (!delivery.value || !nextStatus.value) return
  updatingStatus.value = true
  try {
    const res = await axios.post(`/update-delivery-status/${delivery.value.id}`, {
      status: nextStatus.value, notes: statusUpdateNotes.value, location: statusUpdateLocation.value
    })
    if (res.data.success) {
      delivery.value.status = nextStatus.value
      delivery.value.status_updated_at = new Date().toISOString()
      if (!delivery.value.status_history) delivery.value.status_history = []
      delivery.value.status_history.push({ status: nextStatus.value, notes: statusUpdateNotes.value, location: statusUpdateLocation.value, created_at: new Date().toISOString() })
    } else throw new Error(res.data.message)
  } catch(e) { alert(e.message || 'Failed to update status.') }
  finally { updatingStatus.value = false; statusDialog.value = false; statusUpdateNotes.value = ''; statusUpdateLocation.value = '' }
}

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  if (typeof num !== 'number') num = Number(num) || 0
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const cancelStatusUpdate = () => { statusDialog.value = false; statusUpdateNotes.value = ''; statusUpdateLocation.value = '' }
const refreshPage = () => { trackingNumber.value = ''; delivery.value = null; error.value = '' }

const printReceipt = () => {
  const el = document.getElementById('td-receipt-print')
  if (!el) return
  const win = window.open('','','width=420,height=800')
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Receipt</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#eee;display:flex;justify-content:center;padding:20px;font-family:'Courier New',monospace}
    .td-receipt{width:302px;background:#fdfcf7;padding:14px 14px 20px;font-family:'Courier New',monospace;font-size:11px;color:#1a1a1a;border:1px solid #ccc}
    .rcpt-header{text-align:center;padding:8px 0 10px}
    .rcpt-logo{font-size:20px;margin-bottom:3px}
    .rcpt-store-name{font-size:14px;font-weight:900;letter-spacing:3px}
    .rcpt-tagline{font-size:9px;letter-spacing:1px;color:#666;margin-top:2px}
    .rcpt-sep{margin:7px 0}
    .rcpt-sep--dash{border-top:1px dashed #aaa}
    .rcpt-sep--solid{border-top:2px solid #333}
    .rcpt-center{text-align:center;padding:4px 0}
    .rcpt-trk-label{font-size:9px;letter-spacing:1.5px;color:#666}
    .rcpt-trk-num{font-size:13px;font-weight:900;letter-spacing:1px;margin:3px 0}
    .rcpt-status-badge{display:inline-block;font-size:10px;font-weight:700;letter-spacing:1px;padding:3px 10px;border-radius:3px;margin-top:3px}
    .rcpt-st--pending{background:#fff3dc;color:#c47f00;border:1px solid #f0c050}
    .rcpt-st--in_transit{background:#dff5fa;color:#0088aa;border:1px solid #90dff0}
    .rcpt-st--delivered{background:#dff7ec;color:#007040;border:1px solid #80d9b0}
    .rcpt-st--cancelled{background:#fdeaea;color:#aa2020;border:1px solid #f0a0a0}
    .rcpt-section{font-size:9px;font-weight:700;letter-spacing:1.8px;color:#555;text-align:center;margin:5px 0 4px}
    .rcpt-row{display:flex;justify-content:space-between;gap:8px;margin-bottom:2px;font-size:10.5px}
    .rcpt-row--indent{padding-left:10px}
    .rcpt-row--bold{font-weight:700;font-size:11px;margin-top:4px}
    .rcpt-k{color:#666;flex-shrink:0}
    .rcpt-v{text-align:right;word-break:break-word}
    .rcpt-parcel{margin-bottom:5px}
    .rcpt-parcel-title{font-weight:600;margin-bottom:2px;font-size:10.5px}
    .rcpt-total{display:flex;justify-content:space-between;font-size:14px;font-weight:900;padding:3px 0}
    .rcpt-total-amt{font-size:15px}
    .rcpt-instructions-text{font-size:10px;color:#444;line-height:1.4;text-align:center;padding:0 4px}
    .rcpt-footer{text-align:center;padding-top:6px}
    .rcpt-footer-thanks{font-size:11px;font-weight:700;margin-bottom:3px}
    .rcpt-footer-date{font-size:9px;color:#888;margin-bottom:2px}
    .rcpt-footer-email{font-size:9.5px;color:#666;margin-bottom:10px}
    .rcpt-barcode{display:flex;align-items:flex-end;justify-content:center;gap:1.5px;height:36px;margin-bottom:3px}
    .rcpt-bar{background:#1a1a1a;width:2px;border-radius:1px}
    .rcpt-barcode-num{font-size:9px;letter-spacing:2px;color:#555}
  </style></head><body>${el.outerHTML}</body></html>`)
  win.document.close()
  setTimeout(()=>{ win.focus(); win.print(); win.close() }, 500)
}

const formatDate = d => d ? new Date(d).toLocaleDateString('en-US',{weekday:'short',year:'numeric',month:'short',day:'numeric'}) : 'N/A'
const formatDateTime = d => d ? new Date(d).toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}) : 'N/A'
const getStatusColor = s => ({pending:'warning',in_transit:'info',delivered:'success',cancelled:'error'})[s]||'default'
const getStatusText  = s => ({pending:'Pending',in_transit:'In Transit',delivered:'Delivered',cancelled:'Cancelled'})[s]||s
const getStatusIcon  = s => ({pending:'tabler-clock',in_transit:'tabler-truck',delivered:'tabler-check',cancelled:'tabler-x'})[s]||'tabler-package'
const getPaymentMethodLabel = m => ({departure:'Pay on Departure',delivery:'Pay on Delivery'})[m]||m
const calculateTotalWeight = p => (!p||!Array.isArray(p))?'0.00':p.reduce((s,x)=>s+parseFloat(x.weight||0),0).toFixed(2)
const calculateDeliveryPrice = d => { if(!d?.parcels||!d?.price_rate)return'0.00'; return(parseFloat(calculateTotalWeight(d.parcels))*parseFloat(d.price_rate?.charge||0)).toFixed(2) }
const getFileIcon = t => { if(!t)return'tabler-file'; if(t.includes('image'))return'tabler-photo'; if(t.includes('pdf'))return'tabler-file-text'; if(t.includes('word')||t.includes('document'))return'tabler-file-word'; return'tabler-file' }
const getFileTypeClass = t => { if(!t)return''; if(t.includes('image'))return'image-file'; if(t.includes('pdf'))return'pdf-file'; if(t.includes('word')||t.includes('document'))return'doc-file'; return'other-file' }
const formatFileSize = b => { if(!b)return'N/A'; const k=1024,s=['B','KB','MB','GB'],i=Math.floor(Math.log(b)/Math.log(k)); return parseFloat((b/Math.pow(k,i)).toFixed(1))+' '+s[i] }
const viewDocument = d => d.url?window.open(d.url,'_blank'):alert('Preview unavailable')
const downloadDocument = d => { if(!d.url)return alert('Download unavailable'); const a=document.createElement('a');a.href=d.url;a.download=d.name||d.file_name;a.click() }

onMounted(()=>{ const p=new URLSearchParams(window.location.search).get('track'); if(p){trackingNumber.value=p;searchDelivery()} })
</script>

<style scoped>
/* ═══════ ROOT ═══════ */
.td-root { min-height: 100vh; background: #f2f4f8; font-family: 'DM Sans','Segoe UI',sans-serif; }

/* ═══════ HEADER ═══════ */
.td-header { background: rgb(var(--v-theme-primary)); }
.td-header-inner { max-width: 1100px; margin: 0 auto; padding: 13px 20px; display: flex; align-items: center; justify-content: space-between; }
.td-brand { display: flex; align-items: center; gap: 11px; }
.td-brand-icon { width: 36px; height: 36px; background: rgba(255,255,255,0.16); border-radius: 9px; display: flex; align-items: center; justify-content: center; }
.td-brand-name { font-size: 14px; font-weight: 700; color: white; letter-spacing: 0.2px; }
.td-brand-sub  { font-size: 10.5px; color: rgba(255,255,255,0.65); margin-top: 1px; }
.td-refresh-btn { border-color: rgba(255,255,255,0.28) !important; color: white !important; text-transform: none; font-size: 12px; border-radius: 8px !important; }

/* ═══════ HERO ═══════ */
.td-hero {
  background: linear-gradient(155deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.78) 100%);
  padding: 20px 20px 20px; overflow: hidden; position: relative;
  margin-bottom: 40px;
}
.td-hero::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at 75% 40%, rgba(255,255,255,0.07) 0%, transparent 65%);
}
.td-hero-inner { max-width: 540px; margin: 0 auto; text-align: center; }
.td-hero-eyebrow { display: inline-flex; align-items: center; gap: 7px; color: rgba(255,255,255,0.82); font-size: 11.5px; font-weight: 500; letter-spacing: 0.9px; text-transform: uppercase; margin-bottom: 14px; }
.td-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,0.28); animation: blink 1.6s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
.td-hero-title { font-size: 36px; font-weight: 800; color: white; line-height: 1.18; margin-bottom: 26px; }
.td-hero-accent { font-style: italic; font-weight: 300; color: rgba(255,255,255,0.72); }

.td-search-pill { display: flex; align-items: center; background: white; border-radius: 50px; padding: 5px 5px 5px 16px; gap: 10px; box-shadow: 0 10px 44px rgba(0,0,0,0.2); }
.td-search-prefix { color: rgb(var(--v-theme-primary)); flex-shrink: 0; }
.td-search-input { flex: 1; border: none; outline: none; font-size: 14px; color: rgba(var(--v-theme-on-surface), 0.88); background: transparent; font-family: inherit; }
.td-search-input::placeholder { color: rgba(var(--v-theme-on-surface), 0.36); }
.td-search-go { width: 38px; height: 38px; border-radius: 50%; background: rgb(var(--v-theme-primary)); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform .16s, opacity .16s; }
.td-search-go:hover:not(:disabled) { transform: scale(1.08); }
.td-search-go:disabled { opacity: .45; cursor: not-allowed; }
.spin { animation: td-spin .8s linear infinite; }
@keyframes td-spin { to { transform: rotate(360deg); } }
.td-search-hint { display: flex; align-items: center; justify-content: center; gap: 5px; color: rgba(255,255,255,0.62); font-size: 11.5px; margin-top: 13px; }

/* ═══════ CONTENT ═══════ */
.td-content { max-width: 1100px; margin: -24px auto 0; padding: 0 16px 48px; }

/* ═══════ STATUS BANNER ═══════ */
.td-status-bar { border-radius: 16px; padding: 15px 18px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; box-shadow: 0 4px 18px rgba(0,0,0,0.07); }
.td-status-pending    { background: linear-gradient(135deg,#fff9ef,#fff3de); border: 1px solid #FFDA8A; }
.td-status-in_transit { background: linear-gradient(135deg,#e8fafd,#cef5fb); border: 1px solid #8FDFEE; }
.td-status-delivered  { background: linear-gradient(135deg,#edfaf4,#d4f5e6); border: 1px solid #7DDDB0; }
.td-status-cancelled  { background: linear-gradient(135deg,#fff0f0,#fde0e0); border: 1px solid #F4A0A0; }
.td-status-left { display: flex; align-items: center; gap: 13px; }
.td-status-icon-wrap { position: relative; width: 44px; height: 44px; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
.td-status-pending    .td-status-icon-wrap { color: #FF9F43; }
.td-status-in_transit .td-status-icon-wrap { color: #00CFE8; }
.td-status-delivered  .td-status-icon-wrap { color: #28C76F; }
.td-status-cancelled  .td-status-icon-wrap { color: #EA5455; }
.td-status-ping { position: absolute; top: 3px; right: 3px; width: 8px; height: 8px; border-radius: 50%; background: #00CFE8; animation: ping 1.4s ease-in-out infinite; }
@keyframes ping { 0%{box-shadow:0 0 0 0 rgba(0,207,232,.5)} 100%{box-shadow:0 0 0 8px rgba(0,207,232,0)} }
.td-status-label    { font-size: 15px; font-weight: 700; color: #18181b; }
.td-status-tracking { font-family: 'Courier New',monospace; font-size: 11.5px; color: rgba(0,0,0,0.45); margin-top: 2px; }
.td-status-date { display: flex; align-items: center; gap: 4px; font-size: 12px; color: rgba(0,0,0,0.42); }

/* ═══════ CARDS ═══════ */
.td-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; margin-bottom: 13px; }
@media(max-width:720px){ .td-grid { grid-template-columns: 1fr; } }
.td-card { background: white; border-radius: 16px; padding: 18px; border: 1px solid rgba(0,0,0,0.055); box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
.td-card--full { grid-column: 1/-0.5; }
.td-card-header { display: flex; align-items: center; gap: 7px; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.65px; color: rgba(var(--v-theme-on-surface),.5); margin-bottom: 15px; }
.td-badge { background: rgba(var(--v-theme-primary),.1); color: rgb(var(--v-theme-primary)); border-radius: 20px; padding: 2px 8px; font-size: 10.5px; font-weight: 600; }
.td-badge--neutral { background: rgba(0,0,0,.06); color: rgba(var(--v-theme-on-surface),.65); }

/* Route */
.td-route { display: flex; flex-direction: column; }
.td-route-stop { display: flex; align-items: flex-start; gap: 11px; }
.td-route-dot { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.td-route-dot--from { background: rgb(var(--v-theme-primary)); }
.td-route-dot--to   { background: rgb(var(--v-theme-success)); }
.td-route-stop-label { font-size: 10.5px; color: rgba(var(--v-theme-on-surface),.48); text-transform: uppercase; letter-spacing: .4px; }
.td-route-stop-val   { font-size: 13.5px; font-weight: 600; color: rgba(var(--v-theme-on-surface),.9); margin-top: 2px; }
.td-route-line { display: flex; align-items: center; gap: 8px; padding: 7px 0 7px 4px; }
.td-route-dashes { width: 2px; height: 26px; background: repeating-linear-gradient(to bottom, rgba(var(--v-theme-primary),.3) 0 4px, transparent 4px 8px); flex-shrink: 0; }
.td-route-truck { opacity: .65; }

/* Details */
.td-details-list { display: flex; flex-direction: column; gap: 10px; }
.td-detail-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.td-detail-key { display: flex; align-items: center; gap: 4px; font-size: 12px; color: rgba(var(--v-theme-on-surface),.48); flex-shrink: 0; }
.td-detail-val { font-size: 13px; font-weight: 500; color: rgba(var(--v-theme-on-surface),.86); text-align: right; }
.td-price { font-weight: 700; color: rgb(var(--v-theme-success)) !important; font-size: 14px !important; }

/* Party */
.td-party { display: flex; align-items: flex-start; gap: 13px; }
.td-party-avatar { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 700; color: white; flex-shrink: 0; }
.td-party-avatar--client  { background: linear-gradient(135deg,rgb(var(--v-theme-primary)),rgba(var(--v-theme-primary),.65)); }
.td-party-avatar--courier { background: linear-gradient(135deg,rgb(var(--v-theme-info)),rgba(var(--v-theme-info),.65)); }
.td-party-name { font-size: 14px; font-weight: 600; color: rgba(var(--v-theme-on-surface),.9); margin-bottom: 5px; }
.td-party-meta { display: flex; align-items: center; gap: 5px; font-size: 12px; color: rgba(var(--v-theme-on-surface),.52); margin-bottom: 3px; }

/* Parcels */
.td-parcels { display: flex; flex-direction: column; gap: 7px; }
.td-parcel { display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 10px; background: #f8fafc; border: 1px solid rgba(0,0,0,0.05); transition: border-color .14s; }
.td-parcel:hover { border-color: rgba(var(--v-theme-primary),.2); }
.td-parcel-num { width: 26px; height: 26px; border-radius: 7px; background: rgba(var(--v-theme-primary),.1); color: rgb(var(--v-theme-primary)); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.td-parcel-body { flex: 1; }
.td-parcel-desc { font-size: 13px; font-weight: 500; color: rgba(var(--v-theme-on-surface),.88); }
.td-parcel-meta { display: flex; gap: 12px; font-size: 11px; color: rgba(var(--v-theme-on-surface),.5); margin-top: 3px; }
.td-parcel-meta span { display: flex; align-items: center; gap: 3px; }

/* ═══════ LOWER ═══════ */
.td-lower { display: grid; grid-template-columns: 2fr 1fr; gap: 13px; margin-bottom: 13px; }
@media(max-width:720px){ .td-lower { grid-template-columns: 1fr; } }

.td-timeline { display: flex; flex-direction: column; }
.td-tl-item { display: flex; gap: 13px; padding: 13px 0; }
.td-tl-item:not(:last-child) { border-bottom: 1px solid rgba(0,0,0,0.05); }
.td-tl-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.td-tl-dot { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.td-tl-dot--pending    { background: rgba(255,159,67,.12); color: #FF9F43; }
.td-tl-dot--in_transit { background: rgba(0,207,232,.12);  color: #00CFE8; }
.td-tl-dot--delivered  { background: rgba(40,199,111,.12); color: #28C76F; }
.td-tl-dot--cancelled  { background: rgba(234,84,85,.12);  color: #EA5455; }
.td-tl-item--active .td-tl-dot { box-shadow: 0 0 0 4px rgba(var(--v-theme-primary),.12); }
.td-tl-connector { flex: 1; width: 2px; margin-top: 5px; background: rgba(0,0,0,.08); min-height: 18px; }
.td-tl-body { flex: 1; padding-top: 3px; }
.td-tl-title { font-size: 13.5px; font-weight: 600; color: rgba(var(--v-theme-on-surface),.9); margin-bottom: 4px; }
.td-tl-desc  { font-size: 12px; color: rgba(var(--v-theme-on-surface),.58); line-height: 1.4; margin-bottom: 5px; }
.td-tl-meta  { display: flex; gap: 12px; font-size: 11px; color: rgba(var(--v-theme-on-surface),.42); }
.td-tl-meta span { display: flex; align-items: center; gap: 3px; }

.td-actions-sub { font-size: 13px; color: rgba(var(--v-theme-on-surface),.6); margin-bottom: 14px; }
.td-actions-btns { display: flex; flex-direction: column; gap: 9px; }
.td-action-btn { border-radius: 10px !important; text-transform: none !important; font-weight: 600 !important; justify-content: flex-start !important; height: 46px !important; }

/* Docs */
.td-docs-card { margin-bottom: 13px; }
.td-docs-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(210px,1fr)); gap: 11px; }
.td-doc { display: flex; align-items: center; gap: 10px; padding: 11px; border-radius: 10px; background: #f8fafc; border: 1px solid rgba(0,0,0,0.06); cursor: pointer; transition: all .17s; }
.td-doc:hover { background: white; border-color: rgba(var(--v-theme-primary),.2); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.07); }
.td-doc-icon { width: 40px; height: 40px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
.image-file { background: rgba(66,153,225,.1);  color: #4299E1; }
.pdf-file   { background: rgba(234,84,85,.1);   color: #EA5455; }
.doc-file   { background: rgba(45,112,182,.1);  color: #2D70B6; }
.other-file { background: rgba(108,117,125,.1); color: #6C757D; }
.td-doc-info { flex: 1; min-width: 0; }
.td-doc-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.td-doc-meta { font-size: 11px; color: rgba(var(--v-theme-on-surface),.48); margin-top: 2px; }

/* ═══════ EMPTY STATE ═══════ */
.td-empty { text-align: center; padding: 68px 20px; }
.td-empty-icon  { margin-bottom: 18px; opacity: .8; }
.td-empty-title { font-size: 21px; font-weight: 700; color: rgba(var(--v-theme-on-surface),.78); margin-bottom: 9px; }
.td-empty-sub   { font-size: 13.5px; color: rgba(var(--v-theme-on-surface),.48); max-width: 340px; margin: 0 auto; line-height: 1.6; }

/* ═══════ DIALOG ═══════ */
.td-dialog { border-radius: 20px !important; overflow: hidden; }
.td-dialog-top { padding: 26px; text-align: center; background: linear-gradient(135deg,rgba(var(--v-theme-primary),.05),rgba(var(--v-theme-primary),.02)); border-bottom: 1px solid rgba(0,0,0,0.06); }
.td-dialog-icon { width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 11px; }
.td-status-in_transit .td-dialog-icon { background: rgba(0,207,232,.12); color:#00CFE8; }
.td-status-delivered  .td-dialog-icon { background: rgba(40,199,111,.12); color:#28C76F; }
.td-status-cancelled  .td-dialog-icon { background: rgba(234,84,85,.12);  color:#EA5455; }
.td-status-pending    .td-dialog-icon { background: rgba(255,159,67,.12); color:#FF9F43; }
.td-dialog-title { font-size: 17px; font-weight: 700; color: rgba(var(--v-theme-on-surface),.9); }
.td-dialog-sub   { font-size: 11.5px; color: rgba(var(--v-theme-on-surface),.48); margin-top: 3px; font-family: monospace; }
.td-dialog-body  { padding: 18px 22px; }
.td-dialog-change { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 13px; background: #f8fafc; border-radius: 10px; }
.td-dialog-actions { padding: 15px 22px; gap: 10px; display: flex; border-top: 1px solid rgba(0,0,0,.06); }
.td-dialog-actions .v-btn { flex: 1; border-radius: 10px !important; height: 44px !important; text-transform: none !important; font-weight: 600 !important; }

/* ═══════════════════════════════════════════
   RECEIPT SECTION
═══════════════════════════════════════════ */
.td-receipt-section { margin-bottom: 14px; }

.td-receipt-label-bar {
  display: flex; align-items: center; justify-content: space-between;
  background: white; border-radius: 16px 16px 0 0;
  border: 1px solid rgba(0,0,0,.07); border-bottom: none;
  padding: 12px 16px;
}
.td-receipt-label-left { display: flex; align-items: center; gap: 8px; }
.td-receipt-label-text { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; color: rgba(var(--v-theme-on-surface),.52); }

.td-receipt-stage {
  background: #d8d8d8;
  border: 1px solid rgba(0,0,0,.09);
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 20px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.td-receipt-tail {
  width: 302px; height: 18px;
  background: linear-gradient(to bottom, #c8c8c8, #b8b8b8);
  border-radius: 0 0 6px 6px;
  margin-top: 0;
  /* Simulate tear-off shadow */
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  clip-path: polygon(
    0 0, 2.5% 35%, 5% 0, 7.5% 35%, 10% 0, 12.5% 35%, 15% 0, 17.5% 35%,
    20% 0, 22.5% 35%, 25% 0, 27.5% 35%, 30% 0, 32.5% 35%, 35% 0, 37.5% 35%,
    40% 0, 42.5% 35%, 45% 0, 47.5% 35%, 50% 0, 52.5% 35%, 55% 0, 57.5% 35%,
    60% 0, 62.5% 35%, 65% 0, 67.5% 35%, 70% 0, 72.5% 35%, 75% 0, 77.5% 35%,
    80% 0, 82.5% 35%, 85% 0, 87.5% 35%, 90% 0, 92.5% 35%, 95% 0, 97.5% 35%, 100% 0,
    100% 100%, 0 100%
  );
}

/* ═══════════════════════════════════════════
   RECEIPT — XPrinter 80mm Thermal
   Physical: 80mm wide, usable ~72mm, 302px @ 96dpi
═══════════════════════════════════════════ */
.td-receipt {
  width: 302px;
  background: #fdfcf8;
  padding: 16px 16px 20px;
  font-family: 'Courier New','Lucida Console',monospace;
  font-size: 11px;
  color: #1a1a1a;
  line-height: 1.35;
  /* Paper texture lines */
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(0,0,0,.013) 22px, rgba(0,0,0,.013) 23px);
  box-shadow:
    0 0 0 1px rgba(0,0,0,.12),
    0 8px 32px rgba(0,0,0,.18),
    inset 0 0 0 1px rgba(255,255,255,.7);
  /* Torn top edge */
  clip-path: polygon(
    0% 0%, 1.6% 1.4%, 3.3% 0%, 5% 1.8%, 6.6% 0%, 8.3% 1.2%, 10% 0%,
    11.6% 1.6%, 13.3% 0%, 15% 1.4%, 16.6% 0%, 18.3% 1.8%, 20% 0%,
    21.6% 1.2%, 23.3% 0%, 25% 1.6%, 26.6% 0%, 28.3% 1.4%, 30% 0%,
    31.6% 1.8%, 33.3% 0%, 35% 1.2%, 36.6% 0%, 38.3% 1.6%, 40% 0%,
    41.6% 1.4%, 43.3% 0%, 45% 1.8%, 46.6% 0%, 48.3% 1.2%, 50% 0%,
    51.6% 1.6%, 53.3% 0%, 55% 1.4%, 56.6% 0%, 58.3% 1.8%, 60% 0%,
    61.6% 1.2%, 63.3% 0%, 65% 1.6%, 66.6% 0%, 68.3% 1.4%, 70% 0%,
    71.6% 1.8%, 73.3% 0%, 75% 1.2%, 76.6% 0%, 78.3% 1.6%, 80% 0%,
    81.6% 1.4%, 83.3% 0%, 85% 1.8%, 86.6% 0%, 88.3% 1.2%, 90% 0%,
    91.6% 1.6%, 93.3% 0%, 95% 1.4%, 96.6% 0%, 98.3% 1.8%, 100% 0%,
    100% 100%, 0% 100%
  );
}

/* Receipt internals */
.rcpt-header { text-align: center; padding: 10px 0 12px; }
.rcpt-logo   { font-size: 22px; margin-bottom: 4px; }
.rcpt-store-name { font-size: 14px; font-weight: 900; letter-spacing: 3.5px; color: #0d0d0d; }
.rcpt-tagline { font-size: 9px; letter-spacing: 1.6px; color: #666; margin-top: 3px; }

.rcpt-sep { margin: 8px 0; }
.rcpt-sep--dash  { border-top: 1px dashed #aaa; }
.rcpt-sep--solid { border-top: 2px solid #222; }

.rcpt-center { text-align: center; padding: 4px 0; }
.rcpt-trk-label { font-size: 9px; letter-spacing: 1.8px; color: #666; margin-bottom: 3px; }
.rcpt-trk-num   { font-size: 13px; font-weight: 900; letter-spacing: 1.2px; color: #0d0d0d; }

.rcpt-status-badge {
  display: inline-block; font-size: 10px; font-weight: 700;
  letter-spacing: 1.2px; padding: 3px 12px;
  border-radius: 3px; margin-top: 5px;
}
.rcpt-st--pending    { background: #fff3dc; color: #c47f00; border: 1px solid #f0c050; }
.rcpt-st--in_transit { background: #dff5fa; color: #0088aa; border: 1px solid #90dff0; }
.rcpt-st--delivered  { background: #dff7ec; color: #007040; border: 1px solid #80d9b0; }
.rcpt-st--cancelled  { background: #fdeaea; color: #aa2020; border: 1px solid #f0a0a0; }

.rcpt-section { font-size: 9px; font-weight: 700; letter-spacing: 2px; color: #555; text-align: center; margin: 6px 0 5px; }

.rcpt-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 3px; font-size: 10.5px; }
.rcpt-row--indent { padding-left: 10px; }
.rcpt-row--bold   { font-weight: 700; font-size: 11px; margin-top: 5px; }
.rcpt-k { color: #666; flex-shrink: 0; white-space: nowrap; }
.rcpt-v { text-align: right; word-break: break-word; }

.rcpt-parcel { margin-bottom: 6px; }
.rcpt-parcel-title { font-weight: 600; font-size: 10.5px; margin-bottom: 2px; }

.rcpt-total { display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 900; padding: 4px 0; letter-spacing: .3px; }
.rcpt-total-amt { font-size: 16px; }

.rcpt-instructions-text { font-size: 10px; color: #444; line-height: 1.45; text-align: center; padding: 2px 4px; }

.rcpt-footer { text-align: center; padding-top: 6px; }
.rcpt-footer-thanks { font-size: 11px; font-weight: 700; color: #222; margin-bottom: 4px; }
.rcpt-footer-date   { font-size: 9px; color: #888; margin-bottom: 2px; }
.rcpt-footer-email  { font-size: 9.5px; color: #666; margin-bottom: 12px; }

/* Barcode */
.rcpt-barcode { display: flex; align-items: flex-end; justify-content: center; gap: 1.5px; height: 36px; margin-bottom: 5px; }
.rcpt-bar { width: 2px; background: #111; border-radius: 1px; }
.rcpt-barcode-num { font-size: 9px; letter-spacing: 2.5px; color: #555; }

/* ═══════ PRINT ═══════ */
@media print {
  .td-root > *:not(.td-content) { display: none !important; }
  .td-content > *:not(.td-receipt-section) { display: none !important; }
  .td-receipt-section { margin: 0 !important; }
  .td-receipt-label-bar, .td-receipt-stage { border: none !important; background: none !important; padding: 0 !important; }
  .td-receipt-tail { display: none !important; }
  .td-receipt { box-shadow: none !important; clip-path: none !important; background-image: none !important; margin: 0 auto; }
}

/* ═══════ RESPONSIVE ═══════ */
@media(max-width:480px) {
  .td-hero-title { font-size: 26px; }
  .td-receipt-stage { padding: 14px 10px 0; }
  .td-receipt { width: 100%; }
}
</style>
