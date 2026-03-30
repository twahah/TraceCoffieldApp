<template>
  <VCard class="delivery-view-dialog">
    <VCardTitle class="dialog-header pa-6">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3">
          <div class="dialog-icon">
            <VIcon icon="tabler-package" size="28" color="primary" />
          </div>
          <div>
            <h2 class="text-h5 font-weight-bold mb-1">Delivery Details</h2>
            <VChip 
              :color="getStatusColor(delivery.status)" 
              variant="tonal"
              size="small"
              class="font-weight-bold"
            >
              <VIcon :icon="getStatusIcon(delivery.status)" size="14" class="mr-1" />
              {{ getStatusText(delivery.status) }}
            </VChip>
          </div>
        </div>
        <VBtn
          icon="tabler-x"
          variant="text"
          size="small"
          @click="$emit('close')"
        />
      </div>
    </VCardTitle>
    
    <VDivider />
    
    <VCardText class="pa-0" style="max-height: 600px; overflow-y: auto;">
      <!-- Tracking & Basic Info -->
      <div class="info-section pa-6">
        <VRow>
          <VCol cols="12" md="6">
            <div class="info-group">
              <h6 class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
                <VIcon icon="tabler-hash" size="18" />
                Tracking Information
              </h6>
              <div class="info-item">
                <span class="label">Tracking Number:</span>
                <span class="value font-mono font-weight-bold text-primary">
                  {{ delivery.tracking_number }}
                </span>
                <VBtn
                  icon="tabler-copy"
                  variant="text"
                  size="x-small"
                  @click="copyTrackingNumber(delivery.tracking_number)"
                  class="ml-2"
                />
              </div>
              <div class="info-item">
                <span class="label">Created On:</span>
                <span class="value">{{ formatDateTime(delivery.created_at) }}</span>
              </div>
            </div>
          </VCol>
          
          <VCol cols="12" md="6">
            <div class="info-group">
              <h6 class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
                <VIcon icon="tabler-calendar" size="18" />
                Delivery Schedule
              </h6>
              <div class="info-item">
                <span class="label">Delivery Date & Time:</span>
                <span class="value">{{ formatDateTime(delivery.delivery_date_time) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Payment Method:</span>
                <VChip 
                  :color="delivery.payment_method === 'delivery' ? 'success' : 'warning'" 
                  variant="tonal"
                  size="x-small"
                >
                  {{ delivery.payment_method === 'delivery' ? 'Pay on Delivery' : 'Pay on Departure' }}
                </VChip>
              </div>
            </div>
          </VCol>
        </VRow>
      </div>
      
      <VDivider />
      
      <!-- Route & Rate Info -->
      <div class="info-section pa-6">
        <VRow>
          <VCol cols="12" md="6">
            <div class="info-group">
              <h6 class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
                <VIcon icon="tabler-route" size="18" />
                Route Information
              </h6>
              <div class="route-display">
                <div class="route-point start">
                  <VIcon icon="tabler-map-pin" size="20" color="primary" />
                  <span class="point-text">{{ delivery.departure }}</span>
                </div>
                <div class="route-middle">
                  <div class="dash-line"></div>
                  <VIcon icon="tabler-arrow-right" size="20" color="primary" class="arrow" />
                </div>
                <div class="route-point end">
                  <VIcon icon="tabler-map-pin-filled" size="20" color="success" />
                  <span class="point-text">{{ delivery.destination }}</span>
                </div>
              </div>
              <div class="route-info mt-3">
                <div class="info-item">
                  <span class="label">Rate per kg:</span>
                  <span class="value text-success font-weight-bold">
                    ${{ delivery.pricerate?.charge || '0.00' }}
                  </span>
                </div>
                <div class="info-item">
                  <span class="label">Instructions:</span>
                  <span class="value">{{ delivery.instructions || 'No special instructions' }}</span>
                </div>
              </div>
            </div>
          </VCol>
          
          <VCol cols="12" md="6">
            <div class="info-group">
              <h6 class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
                <VIcon icon="tabler-calculator" size="18" />
                Payment Summary
              </h6>
              <div class="payment-summary">
                <div class="payment-item">
                  <span class="label">Rate per kg:</span>
                  <span class="value">${{ delivery.pricerate?.charge || '0.00' }}</span>
                </div>
                <div class="payment-item">
                  <span class="label">Total Weight:</span>
                  <span class="value">{{ calculateTotalWeight(delivery.parcels) }} kg</span>
                </div>
                <VDivider class="my-2" />
                <div class="payment-item total">
                  <span class="label font-weight-bold">Total Amount:</span>
                  <span class="value font-weight-bold text-success">
                    ${{ calculateDeliveryAmount(delivery) }}
                  </span>
                </div>
              </div>
            </div>
          </VCol>
        </VRow>
      </div>
      
      <VDivider />
      
      <!-- Client & Courier Info -->
      <div class="info-section pa-6">
        <VRow>
          <VCol cols="12" md="4">
            <div class="info-group">
              <h6 class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
                <VIcon icon="tabler-user" size="18" />
                Sender's Information
              </h6>
              <VCard variant="tonal" class="client-card">
                <VCardText>
                  <div class="d-flex align-center gap-3 mb-3">
                    <VAvatar size="48" color="primary" variant="tonal" class="font-weight-bold">
                      {{ getInitials(delivery.client?.name) }}
                    </VAvatar>
                    <div>
                      <h6 class="font-weight-bold text-primary">{{ delivery.client?.name || 'N/A' }}</h6>
                      <div class="text-caption">{{ delivery.client?.phone || 'N/A' }}</div>
                    </div>
                  </div>
                  <div class="client-details">
                    <div class="detail">
                      <VIcon icon="tabler-mail" size="16" class="mr-2" />
                      <span>{{ delivery.client?.email || 'N/A' }}</span>
                    </div>
                    <div class="detail">
                      <VIcon icon="tabler-map-pin" size="16" class="mr-2" />
                      <span>{{ delivery.client?.address || 'Address not specified' }}</span>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </div>
          </VCol>

          <VCol cols="12" md="4">
            <div class="info-group">
              <h6 class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
                <VIcon icon="tabler-user-edit" size="18" />
                Recipient's Information
              </h6>
              <VCard variant="tonal" class="client-card">
                <VCardText>
                  <div class="d-flex align-center gap-3 mb-3">
                    <VAvatar size="48" color="primary" variant="tonal" class="font-weight-bold">
                      {{ getInitials(delivery.recipient_name) }}
                    </VAvatar>
                    <div>
                      <h6 class="font-weight-bold text-primary">{{ delivery.recipient_name || 'N/A' }}</h6>
                      <div class="text-caption">{{ delivery.recipient_phone || 'N/A' }}</div>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </div>
          </VCol>
          
          <VCol cols="12" md="4">
            <div class="info-group">
              <h6 class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
                <VIcon icon="tabler-truck" size="18" />
                Courier Information
              </h6>
              <VCard variant="tonal" class="courier-card">
                <VCardText>
                  <div class="d-flex align-center gap-3 mb-3">
                    <VAvatar size="48">
                      <VImg :src="delivery.courier?.photo ? `${BASE_URL}/couriers/${delivery.courier.photo}` : '/src/assets/images/user.png'" />
                    </VAvatar>
                    <div>
                      <h6 class="font-weight-bold">{{ delivery.courier?.name || 'N/A' }}</h6>
                      <div class="text-caption">{{ delivery.courier?.phone || 'N/A' }}</div>
                    </div>
                  </div>
                  <div class="courier-details">
                    <div class="detail">
                      <VIcon icon="tabler-car" size="16" class="mr-2" />
                      <span>{{ delivery.courier?.vehicle_no || 'Vehicle not specified' }}</span>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </div>
          </VCol>
        </VRow>
      </div>
      
      <VDivider />
      
      <!-- Parcels Section -->
      <div class="info-section pa-6">
        <div class="info-group">
          <h6 class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
            <VIcon icon="tabler-packages" size="18" />
            Parcel Details ({{ delivery.parcels?.length || 0 }} parcels)
          </h6>
          <div class="parcels-grid">
            <VCard 
              v-for="(parcel, index) in delivery.parcels" 
              :key="parcel.id"
              variant="outlined"
              class="parcel-card"
            >
              <VCardText class="pa-4">
                <div class="d-flex justify-space-between align-center mb-3">
                  <div class="parcel-header">
                    <VChip color="primary" variant="tonal" size="small">
                      Parcel {{ index + 1 }}
                    </VChip>
                    <span class="parcel-weight ml-2">
                      <VIcon icon="tabler-weight" size="16" class="mr-1" />
                      {{ parcel.weight }} kg
                    </span>
                  </div>
                  <VChip color="info" variant="tonal" size="x-small">
                  Value:  ${{ formatNumber(parcel.value) }}
                  </VChip>
                </div>
                <p class="parcel-description mb-0">{{ parcel.description }}</p>
              </VCardText>
            </VCard>
          </div>
          <div class="parcel-summary mt-4">
            <div class="summary-item">
              <span class="label">Total Parcels:</span>
              <span class="value font-weight-bold">{{ delivery.parcels?.length || 0 }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Total Weight:</span>
              <span class="value font-weight-bold">{{ calculateTotalWeight(delivery.parcels) }} kg</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Documents Section (if any) -->
      <div v-if="delivery.documents && delivery.documents.length > 0" class="info-section pa-6">
        <VDivider />
        <div class="info-group">
          <h6 class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
            <VIcon icon="tabler-file-text" size="18" />
            Attached Documents ({{ delivery.documents.length }})
          </h6>
          <div class="documents-grid">
            <VCard 
              v-for="doc in delivery.documents" 
              :key="doc.id"
              variant="outlined"
              class="document-card"
            >
              <VCardText class="pa-4">
                <div class="d-flex align-center gap-3">
                  <div class="document-icon">
                    <VIcon :icon="getFileIcon(doc.file_type)" size="24" color="primary" />
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="font-weight-bold mb-1">{{ doc.file_name }}</h6>
                    <div class="text-caption text-medium-emphasis">
                      {{ formatFileSize(doc.file_size) }} • {{ doc.file_type }}
                    </div>
                  </div>
                  <VBtn
                    icon="tabler-download"
                    variant="text"
                    size="x-small"
                    :href="doc.file_path"
                    target="_blank"
                    :title="'Download document'"
                  />
                </div>
              </VCardText>
            </VCard>
          </div>
        </div>
      </div>
      <div v-if="delivery.payStatus === 'paid'" class="info-section pa-6">
        <VDivider />
        <div class="info-group">
          <h6 class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
            <VIcon icon="tabler-cash" size="18" />
            Payment Details
          </h6>
          <div class="documents-grid">
            <VCard 
              variant="outlined"
              class="document-card"
            >
              <VCardText class="pa-4">
                <div class="d-flex align-center gap-3">
                  <div class="document-icon">
                    <VIcon icon="tabler-check" size="24" color="success" />
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="font-weight-bold mb-1">Payment Confirmed</h6>
                    <div class="text-caption text-medium-emphasis">
                      {{ formatDateTime(delivery.payDate) }} • {{ delivery.paymentMode }}
                    </div>
                    <p v-if="delivery.paymentNotes" class="mt-2">{{ delivery.paymentNotes }}</p>
                  </div>
                </div>
              </VCardText>
            </VCard>
          </div>
        </div>
      </div>
    </VCardText>
    
    <VDivider />
    
    <VCardActions class="pa-6">
      <VSpacer />
      <VBtn
        color="primary"
        variant="outlined"
        @click="$emit('close')"
        prepend-icon="tabler-x"
      >
        Close
      </VBtn>
      <VBtn
        color="primary"
        @click="$emit('print', delivery)"
        prepend-icon="tabler-printer"
      >
        Print Receipt
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
  delivery: {
    type: Object,
    required: true
  }
});

defineEmits(['close', 'print']);
const BASE_URL = (axios.defaults.baseURL || "").replace(/\/api\/?$/, "")

// Utility functions (same as in main component)
const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    accepted: 'info',
    in_transit: 'primary',
    delivered: 'success',
    cancelled: 'error'
  };
  return colors[status] || 'default';
};

const getStatusIcon = (status) => {
  const icons = {
    pending: 'tabler-clock',
    accepted: 'tabler-check',
    in_transit: 'tabler-truck',
    delivered: 'tabler-circle-check',
    cancelled: 'tabler-x'
  };
  return icons[status] || 'tabler-help';
};

const getStatusText = (status) => {
  const texts = {
    pending: 'Pending',
    accepted: 'Accepted',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return texts[status] || 'Unknown';
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const calculateTotalWeight = (parcels) => {
  if (!parcels || !Array.isArray(parcels)) return '0.00';
  return parcels.reduce((sum, parcel) => sum + parseFloat(parcel.weight || 0), 0).toFixed(2);
};

const calculateDeliveryAmount = (delivery) => {
  if (!delivery || !delivery.parcels || !delivery.pricerate) return '0.00';
  const totalWeight = calculateTotalWeight(delivery.parcels);
  const rate = parseFloat(delivery.pricerate.charge || 0);
  return (totalWeight * rate).toFixed(2);
};

const getFileIcon = (fileType) => {
  if (!fileType) return 'tabler-file';
  if (fileType.includes('image')) return 'tabler-photo';
  if (fileType.includes('pdf')) return 'tabler-file-text';
  if (fileType.includes('word')) return 'tabler-file-word';
  return 'tabler-file';
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  if (typeof num !== 'number') num = Number(num) || 0
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
const copyTrackingNumber = (trackingNumber) => {
  navigator.clipboard.writeText(trackingNumber).then(() => {
    // You can add a toast notification here
  });
};
</script>

<style scoped>
.delivery-view-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.dialog-icon {
  width: 56px;
  height: 56px;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
}

.info-section {
  background: rgba(var(--v-theme-surface), 0.3);
}

.info-group {
  margin-bottom: 0;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  min-width: 140px;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-weight: 500;
}

.value {
  color: rgba(var(--v-theme-on-surface), 0.9);
  font-weight: 500;
}

.route-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
}

.route-point {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.route-middle {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.dash-line {
  flex: 1;
  height: 2px;
  background: rgba(var(--v-theme-primary), 0.2);
  position: relative;
}

.arrow {
  position: absolute;
  background: white;
  padding: 4px;
  border-radius: 50%;
}

.point-text {
  font-size: 14px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.payment-summary {
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 12px;
  padding: 20px;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.payment-item.total {
  border-top: 1px solid rgba(var(--v-theme-outline), 0.2);
  margin-top: 8px;
  padding-top: 12px;
}

.client-card, .courier-card {
  border-radius: 12px;
}

.client-details, .courier-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail {
  display: flex;
  align-items: center;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 12px;
}

.parcels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.parcel-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.parcel-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.parcel-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.parcel-weight {
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 14px;
  display: flex;
  align-items: center;
}

.parcel-description {
  color: rgba(var(--v-theme-on-surface), 0.8);
  line-height: 1.6;
}

.parcel-summary {
  display: flex;
  gap: 24px;
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 12px;
  padding: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.document-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.document-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.document-icon {
  width: 48px;
  height: 48px;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 960px) {
  .parcels-grid,
  .documents-grid {
    grid-template-columns: 1fr;
  }
  
  .parcel-summary {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .label {
    min-width: auto;
  }
  
  .payment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .route-display {
    flex-direction: column;
    gap: 16px;
  }
  
  .route-middle {
    width: 100%;
  }
  
  .dash-line {
    width: 100%;
  }
}
</style>
