<template>
  <div class="modern-farmer-container">
    <!-- Modern Header -->
    <div class="modern-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon-wrapper">
            <VIcon icon="tabler-user-plus" size="32" color="white" />
          </div>
          <div>
            <h1 class="header-title">Register New Farmer</h1>
            <p class="header-subtitle">Add a new farmer to the cooperative system</p>
          </div>
        </div>
        <VBtn
          @click="resetForm"
          color="white"
          variant="outlined"
          size="small"
          prepend-icon="tabler-refresh"
          class="header-action-btn"
        >
          Reset Form
        </VBtn>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content-wrapper">
      <div class="content-grid">
        <!-- Left Column - Form -->
        <div class="form-column">
          <!-- Personal Information Card -->
          <VCard class="modern-card">
            <div class="card-header">
              <VIcon icon="tabler-user" size="24" color="primary" class="card-icon" />
              <h3 class="card-title">Personal Information</h3>
            </div>
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-user" size="18" class="mr-2" />
                      Full Name
                    </label>
                    <VTextField
                      v-model="farmer.name"
                      placeholder="Enter farmer's full name"
                      variant="outlined"
                      density="comfortable"
                      :rules="[requiredValidator]"
                      class="modern-input"
                    />
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-id" size="18" class="mr-2" />
                      National ID
                    </label>
                    <VTextField
                      v-model="farmer.national_id"
                      placeholder="Enter national ID number"
                      variant="outlined"
                      density="comfortable"
                      :rules="[requiredValidator]"
                      class="modern-input"
                    />
                  </div>
                </VCol>
                <VCol cols="12" md="4">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-gender-bigender" size="18" class="mr-2" />
                      Gender
                    </label>
                    <VSelect
                      v-model="farmer.gender"
                      :items="genderOptions"
                      item-title="label"
                      item-value="value"
                      placeholder="Select gender"
                      variant="outlined"
                      density="comfortable"
                      :rules="[requiredValidator]"
                      class="modern-select"
                    />
                  </div>
                </VCol>
                <VCol cols="12" md="4">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-calendar" size="18" class="mr-2" />
                      Date of Birth
                    </label>
                    <VTextField
                      v-model="farmer.date_of_birth"
                      type="date"
                      placeholder="Select date"
                      variant="outlined"
                      density="comfortable"
                      :rules="[requiredValidator]"
                      :max="new Date().toISOString().split('T')[0]"
                      class="modern-input"
                    />
                  </div>
                </VCol>
                <VCol cols="12" md="4">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-phone" size="18" class="mr-2" />
                      Phone Number
                    </label>
                    <VTextField
                      v-model="farmer.phone"
                      placeholder="+256 XXX XXX XXX"
                      variant="outlined"
                      density="comfortable"
                      :rules="[requiredValidator, phoneValidator]"
                      class="modern-input"
                    />
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- Location & Association Card -->
          <VCard class="modern-card mt-4">
            <div class="card-header">
              <VIcon icon="tabler-map-pin" size="24" color="primary" class="card-icon" />
              <h3 class="card-title">Location & Association</h3>
            </div>
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-building" size="18" class="mr-2" />
                      Depot Committee
                    </label>
                    <VSelect
                      v-model="farmer.depot_committee_id"
                      :items="depotCommittees"
                      item-title="name"
                      item-value="id"
                      placeholder="Select depot committee"
                      variant="outlined"
                      density="comfortable"
                      :rules="[requiredValidator]"
                      class="modern-select"
                      clearable
                    >
                      <template #item="{ props, item }">
                        <VListItem v-bind="props">
                          <template #prepend>
                            <VAvatar size="32" color="primary" variant="tonal">
                              <VIcon icon="tabler-building" size="20" />
                            </VAvatar>
                          </template>
                          <VListItemTitle>
                            {{ item.raw.location }}
                          </VListItemTitle>
                          <template #append>
                            <VChip size="small" color="info" variant="tonal">
                              {{ item.raw.code }}
                            </VChip>
                          </template>
                        </VListItem>
                      </template>
                    </VSelect>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-users-group" size="18" class="mr-2" />
                      Farmer Group
                    </label>
                    <VSelect
                      v-model="farmer.farmer_group_id"
                      :items="filteredFarmerGroups"
                      item-title="name"
                      item-value="id"
                      placeholder="Select farmer group"
                      variant="outlined"
                      density="comfortable"
                      :rules="[requiredValidator]"
                      class="modern-select"
                      :disabled="!farmer.depot_committee_id"
                    >
                      <template #item="{ props, item }">
                        <VListItem v-bind="props">
                          <template #prepend>
                            <VAvatar size="32" color="success" variant="tonal">
                              <VIcon icon="tabler-users-group" size="20" />
                            </VAvatar>
                          </template>
                          <VListItemTitle>
                            {{ item.raw.name }}
                          </VListItemTitle>
                          <template #append>
                            <VChip size="small" color="success" variant="tonal">
                              {{ item.raw.code }}
                            </VChip>
                          </template>
                        </VListItem>
                      </template>
                    </VSelect>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-ruler" size="18" class="mr-2" />
                      Farm Size (Acres)
                    </label>
                    <VTextField
                      v-model="farmer.farm_size_acres"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Enter farm size"
                      variant="outlined"
                      density="comfortable"
                      suffix="acres"
                      class="modern-input"
                    />
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-map" size="18" class="mr-2" />
                      Client UUID
                    </label>
                    <VTextField
                      v-model="farmer.client_uuid"
                      placeholder="Auto-generated if empty"
                      variant="outlined"
                      density="comfortable"
                      class="modern-input"
                      readonly
                    />
                    <small class="text-caption">Auto-generated if left empty</small>
                  </div>
                </VCol>
              </VRow>

              <!-- GPS Coordinates -->
              <VRow class="mt-2">
                <VCol cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-coordinates" size="18" class="mr-2" />
                      Latitude
                    </label>
                    <VTextField
                      v-model="farmer.latitude"
                      type="number"
                      step="0.00000001"
                      placeholder="-1.28333"
                      variant="outlined"
                      density="comfortable"
                      class="modern-input"
                    />
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-coordinates" size="18" class="mr-2" />
                      Longitude
                    </label>
                    <VTextField
                      v-model="farmer.longitude"
                      type="number"
                      step="0.00000001"
                      placeholder="36.81667"
                      variant="outlined"
                      density="comfortable"
                      class="modern-input"
                    />
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- Next of Kin Card -->
          <VCard class="modern-card mt-4">
            <div class="card-header">
              <VIcon icon="tabler-heart" size="24" color="primary" class="card-icon" />
              <h3 class="card-title">Next of Kin</h3>
            </div>
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-user" size="18" class="mr-2" />
                      Next of Kin Name
                    </label>
                    <VTextField
                      v-model="farmer.next_of_kin_name"
                      placeholder="Enter next of kin name"
                      variant="outlined"
                      density="comfortable"
                      :rules="[requiredValidator]"
                      class="modern-input"
                    />
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-phone" size="18" class="mr-2" />
                      Next of Kin Phone
                    </label>
                    <VTextField
                      v-model="farmer.next_of_kin_phone"
                      placeholder="+256 XXX XXX XXX"
                      variant="outlined"
                      density="comfortable"
                      :rules="[requiredValidator, phoneValidator]"
                      class="modern-input"
                    />
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- Additional Information Card -->
          <VCard class="modern-card mt-4">
            <div class="card-header">
              <VIcon icon="tabler-settings" size="24" color="primary" class="card-icon" />
              <h3 class="card-title">Additional Information</h3>
            </div>
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-status-change" size="18" class="mr-2" />
                      Status
                    </label>
                    <VSelect
                      v-model="farmer.status"
                      :items="statusOptions"
                      item-title="label"
                      item-value="value"
                      placeholder="Select status"
                      variant="outlined"
                      density="comfortable"
                      class="modern-select"
                    />
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">
                      <VIcon icon="tabler-brand-hipchat" size="18" class="mr-2" />
                      Quipu Client ID
                    </label>
                    <VTextField
                      v-model="farmer.quipu_client_id"
                      placeholder="Quipu ledger ID"
                      variant="outlined"
                      density="comfortable"
                      class="modern-input"
                    />
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </div>

        <!-- Right Column - Summary -->
        <div class="summary-column">
          <!-- Summary Card -->
          <VCard class="summary-card">
            <div class="summary-header">
              <VIcon icon="tabler-user-check" size="24" color="primary" class="card-icon" />
              <h3 class="card-title">Farmer Summary</h3>
            </div>
            <VCardText>
              <!-- Farmer Details -->
              <div class="summary-section">
                <div class="summary-item">
                  <span class="label">Name</span>
                  <span class="value" v-if="farmer.name">
                    {{ farmer.name }}
                  </span>
                  <span class="value placeholder" v-else>
                    Not provided
                  </span>
                </div>
                <div class="summary-item">
                  <span class="label">National ID</span>
                  <span class="value" v-if="farmer.national_id">
                    {{ farmer.national_id }}
                  </span>
                  <span class="value placeholder" v-else>
                    Not provided
                  </span>
                </div>
                <div class="summary-item">
                  <span class="label">Phone</span>
                  <span class="value" v-if="farmer.phone">
                    {{ farmer.phone }}
                  </span>
                  <span class="value placeholder" v-else>
                    Not provided
                  </span>
                </div>
                <div class="summary-item">
                  <span class="label">Gender</span>
                  <span class="value">
                    {{ getGenderLabel(farmer.gender) }}
                  </span>
                </div>
                <div class="summary-item">
                  <span class="label">Date of Birth</span>
                  <span class="value">
                    {{ farmer.date_of_birth || 'Not provided' }}
                  </span>
                </div>
              </div>

              <!-- Location Summary -->
              <div class="summary-section">
                <div class="summary-item">
                  <span class="label">Depot Committee</span>
                  <span class="value" v-if="selectedDepotCommittee">
                    {{ selectedDepotCommittee.name }}
                  </span>
                  <span class="value placeholder" v-else>
                    Not selected
                  </span>
                </div>
                <div class="summary-item">
                  <span class="label">Farmer Group</span>
                  <span class="value" v-if="selectedFarmerGroup">
                    {{ selectedFarmerGroup.name }}
                  </span>
                  <span class="value placeholder" v-else>
                    Not selected
                  </span>
                </div>
                <div class="summary-item">
                  <span class="label">Farm Size</span>
                  <span class="value">
                    {{ farmer.farm_size_acres ? `${farmer.farm_size_acres} acres` : 'Not specified' }}
                  </span>
                </div>
              </div>

              <!-- Next of Kin -->
              <div class="summary-section">
                <div class="summary-item">
                  <span class="label">Next of Kin</span>
                  <span class="value" v-if="farmer.next_of_kin_name">
                    {{ farmer.next_of_kin_name }}
                  </span>
                  <span class="value placeholder" v-else>
                    Not provided
                  </span>
                </div>
                <div class="summary-item">
                  <span class="label">Kin Phone</span>
                  <span class="value" v-if="farmer.next_of_kin_phone">
                    {{ farmer.next_of_kin_phone }}
                  </span>
                  <span class="value placeholder" v-else>
                    Not provided
                  </span>
                </div>
              </div>

              <!-- Status -->
              <div class="summary-section">
                <div class="status-badge" :class="farmer.status || 'active'">
                  <VIcon :icon="getStatusIcon(farmer.status)" size="16" />
                  {{ getStatusLabel(farmer.status) }}
                </div>
              </div>

              <!-- Register Button -->
              <VBtn
                @click="submitFarmer"
                color="success"
                size="large"
                block
                :disabled="!isFormValid"
                :loading="submitting"
                class="register-btn"
                elevation="2"
              >
                <template #loader>
                  <span class="d-flex align-center">
                    <VProgressCircular indeterminate size="20" width="2" class="mr-2" />
                    Registering...
                  </span>
                </template>
                <VIcon icon="tabler-check" class="mr-2" />
                Register Farmer
              </VBtn>

              <!-- Progress Indicators -->
              <div class="progress-indicators mt-4">
                <div class="indicator" :class="{ active: farmer.name && farmer.national_id }">
                  <div class="indicator-circle">
                    <VIcon :icon="farmer.name && farmer.national_id ? 'tabler-check' : 'tabler-user'" size="16" />
                  </div>
                  <span class="indicator-label">Identity</span>
                </div>
                <div class="indicator" :class="{ active: farmer.depot_committee_id && farmer.farmer_group_id }">
                  <div class="indicator-circle">
                    <VIcon :icon="farmer.depot_committee_id && farmer.farmer_group_id ? 'tabler-check' : 'tabler-map-pin'" size="16" />
                  </div>
                  <span class="indicator-label">Location</span>
                </div>
                <div class="indicator" :class="{ active: farmer.phone }">
                  <div class="indicator-circle">
                    <VIcon :icon="farmer.phone ? 'tabler-check' : 'tabler-phone'" size="16" />
                  </div>
                  <span class="indicator-label">Contact</span>
                </div>
                <div class="indicator" :class="{ active: farmer.next_of_kin_name && farmer.next_of_kin_phone }">
                  <div class="indicator-circle">
                    <VIcon :icon="farmer.next_of_kin_name && farmer.next_of_kin_phone ? 'tabler-check' : 'tabler-heart'" size="16" />
                  </div>
                  <span class="indicator-label">Next of Kin</span>
                </div>
              </div>
            </VCardText>
          </VCard>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <VDialog v-model="successModal" max-width="500px" persistent>
      <VCard class="success-modal-card">
        <div class="success-modal-header">
          <div class="success-icon-wrapper">
            <VIcon icon="tabler-circle-check" size="48" color="success" />
          </div>
          <h2 class="success-title">Farmer Registered Successfully!</h2>
          <p class="success-subtitle">The farmer has been added to the system</p>
        </div>

        <VCardText class="success-details">
          <div class="details-section">
            <div class="details-row">
              <span class="detail-label">
                <VIcon icon="tabler-hash" size="16" class="mr-2" />
                Farmer ID
              </span>
              <span class="detail-value tracking-number">{{ createdFarmer?.id }}</span>
            </div>
            <div class="details-row">
              <span class="detail-label">
                <VIcon icon="tabler-user" size="16" class="mr-2" />
                Name
              </span>
              <span class="detail-value">{{ createdFarmer?.name }}</span>
            </div>
            <div class="details-row">
              <span class="detail-label">
                <VIcon icon="tabler-id" size="16" class="mr-2" />
                National ID
              </span>
              <span class="detail-value">{{ createdFarmer?.national_id }}</span>
            </div>
            <div class="details-row">
              <span class="detail-label">
                <VIcon icon="tabler-phone" size="16" class="mr-2" />
                Phone
              </span>
              <span class="detail-value">{{ createdFarmer?.phone }}</span>
            </div>
          </div>
        </VCardText>

        <VCardActions class="success-actions">
          <VBtn
            color="primary"
            variant="elevated"
            @click="closeSuccessModal"
            size="large"
            class="action-btn"
          >
            <VIcon icon="tabler-check" size="18" class="mr-2" />
            Done
          </VBtn>
          <VBtn
            color="secondary"
            variant="outlined"
            @click="registerAnother"
            size="large"
            class="action-btn"
          >
            <VIcon icon="tabler-plus" size="18" class="mr-2" />
            Register Another
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { useDepotCommitteeStore } from '@/stores/depotCommittees'
import { useFarmerGroupStore } from '@/stores/farmerGroups'
import { v4 as uuidv4 } from 'uuid'

const depotCommitteeStore = useDepotCommitteeStore()
const farmerGroupStore = useFarmerGroupStore()

// Load data on mount
onMounted(() => {
  depotCommitteeStore.fetchDepotCommittees()
  farmerGroupStore.fetchFarmerGroups()
  generateClientUUID()
})

// Data
const farmer = ref({
  client_uuid: '',
  depot_committee_id: null,
  farmer_group_id: null,
  name: '',
  national_id: '',
  gender: null,
  date_of_birth: '',
  phone: '',
  next_of_kin_name: '',
  next_of_kin_phone: '',
  status: 'active',
  farm_size_acres: null,
  latitude: null,
  longitude: null,
  quipu_client_id: ''
})

const submitting = ref(false)
const successModal = ref(false)
const createdFarmer = ref(null)

// Options
const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' }
]

// Computed properties
const depotCommittees = computed(() => depotCommitteeStore.depotCommittees)

const filteredFarmerGroups = computed(() => {

  if (!farmer.value.depot_committee_id) return []
  return farmerGroupStore.farmerGroups.filter(
    group => group.depot_committee.id == farmer.value.depot_committee_id
  )
})

const selectedDepotCommittee = computed(() => {
  return depotCommittees.value.find(dc => dc.id == farmer.value.depot_committee_id)
})

const selectedFarmerGroup = computed(() => {
  return filteredFarmerGroups.value.find(fg => fg.id === farmer.value.farmer_group_id)
})

const isFormValid = computed(() => {
  return (
    farmer.value.name &&
    farmer.value.national_id &&
    farmer.value.gender &&
    farmer.value.date_of_birth &&
    farmer.value.phone &&
    farmer.value.depot_committee_id &&
    farmer.value.farmer_group_id &&
    farmer.value.next_of_kin_name &&
    farmer.value.next_of_kin_phone
  )
})

// Validators
const requiredValidator = v => !!v || 'This field is required'

const phoneValidator = v => {
  if (!v) return true
  const phoneRegex = /^\+?[0-9]{10,15}$/
  return phoneRegex.test(v.replace(/\s+/g, '')) || 'Invalid phone number format'
}

// Methods
const generateClientUUID = () => {
  farmer.value.client_uuid = uuidv4()
}

const getGenderLabel = (gender) => {
  const option = genderOptions.find(g => g.value === gender)
  return option ? option.label : 'Not specified'
}

const getStatusLabel = (status) => {
  const option = statusOptions.find(s => s.value === status)
  return option ? option.label : 'Active'
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'active': return 'tabler-circle-check'
    case 'inactive': return 'tabler-circle-minus'
    case 'suspended': return 'tabler-circle-x'
    default: return 'tabler-circle'
  }
}

const resetForm = () => {
  farmer.value = {
    client_uuid: uuidv4(),
    depot_committee_id: null,
    farmer_group_id: null,
    name: '',
    national_id: '',
    gender: null,
    date_of_birth: '',
    phone: '',
    next_of_kin_name: '',
    next_of_kin_phone: '',
    status: 'active',
    farm_size_acres: null,
    latitude: null,
    longitude: null,
    quipu_client_id: ''
  }
}

const submitFarmer = async () => {
  if (!isFormValid.value) return
  
  submitting.value = true
  
  try {
    const response = await axios.post('/farmers', farmer.value)
    
    if (response.status === 201 || response.status === 200) {
      createdFarmer.value = response.data.data
      successModal.value = true
    }
  } catch (error) {
    console.error('Error registering farmer:', error)
    
    // Handle validation errors
    if (error.response?.status === 422) {
      const errors = error.response.data.errors
      let errorMessage = 'Validation failed:\n'
      Object.keys(errors).forEach(key => {
        errorMessage += `- ${errors[key][0]}\n`
      })
      alert(errorMessage)
    } else {
      alert('Error registering farmer. Please try again.')
    }
  } finally {
    submitting.value = false
  }
}

const closeSuccessModal = () => {
  successModal.value = false
  resetForm()
  createdFarmer.value = null
}

const registerAnother = () => {
  successModal.value = false
  resetForm()
  createdFarmer.value = null
}

// Watch for depot committee change to reset farmer group
watch(() => farmer.value.depot_committee_id, () => {
  farmer.value.farmer_group_id = null
})
</script>

<style scoped>
.modern-farmer-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Modern Header */
.modern-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.9) 100%);
  padding: 24px 32px;
  color: white;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon-wrapper {
  background: rgba(255, 255, 255, 0.15);
  padding: 12px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: white; 
  line-height: 1.2;
}

.header-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 4px 0 0 0;
}

.header-action-btn {
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 500;
  border-radius: 10px;
  text-transform: none;
}

/* Main Content */
.main-content-wrapper {
  max-width: 1200px;
  margin: 32px auto;
  padding: 0 24px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

/* Modern Cards */
.modern-card, .summary-card {
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.modern-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.card-icon {
  flex-shrink: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  margin: 0;
}

/* Form Elements */
.form-group {
  margin-bottom: 10px;
}

.form-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-dark), 0.8);
  margin-bottom: 8px;
}

.modern-select, .modern-input {
  border-radius: 10px;
  background: white;
}

.modern-select :deep(.v-field__outline),
.modern-input :deep(.v-field__outline) {
  border-color: rgba(0, 0, 0, 0.12);
  border-radius: 10px;
}

.modern-select :deep(.v-field--focused .v-field__outline),
.modern-input :deep(.v-field--focused .v-field__outline) {
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
}

/* Summary Column */
.summary-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.summary-card {
  position: sticky;
  top: 24px;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.summary-section {
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.value {
  font-size: 14px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.9);
  text-align: right;
}

.value.placeholder {
  color: rgba(var(--v-theme-on-surface), 0.5);
  font-style: italic;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  width: fit-content;
}

.status-badge.active {
  background: rgba(var(--v-theme-success), 0.1);
  color: rgb(var(--v-theme-success));
}

.status-badge.inactive {
  background: rgba(var(--v-theme-warning), 0.1);
  color: rgb(var(--v-theme-warning));
}

.status-badge.suspended {
  background: rgba(var(--v-theme-error), 0.1);
  color: rgb(var(--v-theme-error));
}

.register-btn {
  height: 56px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  text-transform: none;
  margin-top: 10px;
}

/* Progress Indicators */
.progress-indicators {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.indicator.active {
  opacity: 1;
}

.indicator-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-primary));
}

.indicator.active .indicator-circle {
  background: rgb(var(--v-theme-primary));
  color: white;
}

.indicator-label {
  font-size: 10px;
  color: rgba(var(--v-theme-on-surface), 0.7);
  text-align: center;
  font-weight: 500;
}

/* Success Modal */
.success-modal-card {
  border-radius: 20px !important;
  overflow: hidden;
  border: 2px solid rgba(var(--v-theme-success), 0.2);
}

.success-modal-header {
  text-align: center;
  padding: 40px 30px 20px;
  background: linear-gradient(135deg, rgba(var(--v-theme-success), 0.05) 0%, rgba(var(--v-theme-success), 0.02) 100%);
}

.success-icon-wrapper {
  width: 80px;
  height: 80px;
  background: rgba(var(--v-theme-success), 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 3px solid rgba(var(--v-theme-success), 0.2);
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: rgb(var(--v-theme-success));
  margin: 0 0 8px 0;
}

.success-subtitle {
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin: 0;
  line-height: 1.4;
}

.success-details {
  padding: 30px;
}

.details-section {
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.details-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.details-row:last-child {
  border-bottom: none;
}

.detail-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.9);
  text-align: right;
}

.tracking-number {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.05);
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px dashed rgba(var(--v-theme-primary), 0.3);
}

.success-actions {
  padding: 20px 30px;
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  border-radius: 12px;
  height: 48px;
  font-weight: 500;
  text-transform: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-header {
    padding: 20px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .main-content-wrapper {
    padding: 0 16px;
    margin: 24px auto;
  }
  
  .progress-indicators {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .success-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-card, .summary-card {
  animation: fadeIn 0.3s ease-out;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-primary), 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-primary), 0.5);
}
</style>
