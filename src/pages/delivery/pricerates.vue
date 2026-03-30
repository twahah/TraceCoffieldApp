<template>
  <div class="pricerates-container">
    <!-- Enhanced Header Section -->
    <VCard class="pricerates-header-card" elevation="2">
      <VCardItem class="pa-6">
        <div class="d-flex flex-column flex-md-row align-center justify-space-between gap-4">
          <div class="header-title-section">
            <VCardTitle class="text-h4 font-weight-bold text-primary d-flex align-center gap-3">
              <VIcon icon="tabler-ruler" size="32" color="primary" />
              Price Rates
            </VCardTitle>
            <p class="text-body-2 text-medium-emphasis mt-2 mb-0">
              Organize your product price rates
            </p>
          </div>
          
          <div class="d-flex flex-column flex-sm-row align-center gap-3">
            <VTextField
              v-model="searchQuery"
              placeholder="Search pricerates..."
              prepend-inner-icon="tabler-search"
              variant="outlined"
              density="compact"
              hide-details
              class="search-field"
              style="min-inline-size: 250px"
              clearable
            />
            <VBtn @click="addItem()" color="primary" size="small" prepend-icon="tabler-plus" class="add-category-btn">
              New Price Rate
            </VBtn>
          </div>
        </div>
      </VCardItem>
    </VCard>

    <!-- Main Content -->
    <VCard class="pricerates-content-card mt-6" elevation="1">
      <div v-if="pricerates.length" class="pricerates-table-container">
        <v-data-table
          :headers="headers"
          :items="pricerates"
          item-key="id"
          class="modern-data-table"
          v-model:page="page"
          :items-per-page="5"
          height="330"
          :search="searchQuery"
          item-value="name"
          @update:options="updateOptions"
          show-select
          hover
        >
          <!-- Custom ID Column -->
          <template v-slot:[`item.id`]="{ index }">
            <VChip size="small" color="primary" variant="tonal">
              #{{ String(index + 1).padStart(3, '0') }}
            </VChip>
          </template>

          <!-- Enhanced Photo Column -->
          <template v-slot:[`item.photo`]="{ item }">
            <VAvatar size="48" class="category-avatar">
              <VImg :src="item.photo" :alt="item.name" cover />
            </VAvatar>
          </template>

          <!-- Enhanced Name Column -->
          <template v-slot:[`item.name`]="{ item }">
            <div class="category-name-cell">
              <span class="font-weight-medium">{{ item.name }}</span>
            </div>
          </template>

          <!-- Enhanced Added By Column -->
          <template v-slot:[`item.addedby`]="{ item }">
              <span class="text-truncate" style="max-inline-size: 150px">{{ item.addedby }}</span>
          </template>

          <!-- Modern Actions Column -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <VBtn
                @click="editItem(item)"
                color="success"
                variant="tonal"
                size="small"
                icon="tabler-edit"
                class="action-btn"
              />
              <VBtn
                @click="deleteItem(item)"
                color="error"
                variant="tonal"
                size="small"
                icon="tabler-trash"
                class="action-btn"
              />
            </div>
          </template>

          <!-- Enhanced Pagination -->
          <template #bottom>
            <VDivider />
            <div class="modern-pagination pa-4">
              <div class="d-flex align-center justify-space-between flex-wrap gap-3">
                <VChip color="surface" variant="tonal" class="pagination-info">
                  {{ paginationMeta({ page, itemsPerPage }, pricerates.length) }}
                </VChip>

                <VPagination 
                  v-model="page" 
                  :total-visible="5"
                  :length="Math.ceil(pricerates.length / itemsPerPage)"
                  color="primary"
                  rounded
                >
                  <template #next="slotProps">
                    <VBtn v-bind="slotProps" variant="tonal" color="primary" prepend-icon="tabler-chevron-right">
                      Next
                    </VBtn>
                  </template>
                  <template #prev="slotProps">
                    <VBtn v-bind="slotProps" variant="tonal" color="primary" append-icon="tabler-chevron-left">
                      Back
                    </VBtn>
                  </template>
                </VPagination>
              </div>
            </div>
          </template>
        </v-data-table>
      </div>
      
      <!-- Enhanced Loading State -->
      <div v-else class="loading-container">
        <VCard variant="tonal" class="text-center pa-8">
          <div class="loading-content">
            <VProgressCircular 
              indeterminate 
              color="success" 
              size="64" 
              width="4"
              class="mb-4"
            />
            <h3 class="text-h6 font-weight-medium mb-2">Loading Price Rates</h3>
            <p class="text-body-2 text-medium-emphasis">
              Please wait while we fetch your price rates...
            </p>
          </div>
        </VCard>
      </div>
    </VCard>

    <!-- Modern Add Dialog -->
    <VDialog v-model="addDialog" max-width="600px" persistent>
      <VCard class="modern-dialog">
        <VCardTitle class="dialog-header pa-6">
          <div class="d-flex align-center gap-3">
            <VIcon icon="tabler-ruler" color="primary" size="24" />
            <span class="text-h5 font-weight-bold">New Price Rate</span>
          </div>
        </VCardTitle>
        
        <VDivider />
        
        <VCardText class="pa-6">
          <VForm ref="addForm">
            <VRow>
              <VCol cols="12">
                <VTextField 
                  v-model="editedItem.departure" 
                  label="Departure Location" 
                  prepend-inner-icon="tabler-map-pin"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <VTextField 
                  v-model="editedItem.destination" 
                  label="Destination Location" 
                  prepend-inner-icon="tabler-map-pin-off"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <VTextField 
                  type="number"
                  v-model="editedItem.charge" 
                  label="Charge / KG" 
                  prepend-inner-icon="tabler-cash"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-6">
          <VSpacer />
          <VBtn 
            color="error" 
            variant="outlined" 
            @click="closeAdd"
            prepend-icon="tabler-x"
          > 
            Cancel 
          </VBtn>
          <VBtn 
            color="success" 
            variant="elevated" 
            @click="submitAdd"
            prepend-icon="tabler-check"
            class="ml-3"
          > 
            Save Price Rate
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Modern Edit Dialog -->
    <VDialog v-model="editDialog" max-width="600px" persistent>
      <VCard class="modern-dialog">
        <VCardTitle class="dialog-header pa-6">
          <div class="d-flex align-center gap-3">
            <VIcon icon="tabler-edit" color="warning" size="24" />
            <span class="text-h5 font-weight-bold">Edit Price Rate</span>
          </div>
        </VCardTitle>
        
        <VDivider />
        
        <VCardText class="pa-6">
          <VForm ref="editForm">
            <VRow>
              <VCol cols="12">
                <VTextField 
                  v-model="editedItem.departure" 
                  label="Departure Location" 
                  prepend-inner-icon="tabler-map-pin"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <VTextField 
                  v-model="editedItem.destination" 
                  label="Destination Location" 
                  prepend-inner-icon="tabler-map-pin-off"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <VTextField 
                  type="number"
                  v-model="editedItem.charge" 
                  label="Charge / KG" 
                  prepend-inner-icon="tabler-cash"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />
                </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-6">
          <VSpacer />
          <VBtn 
            color="error" 
            variant="outlined" 
            @click="closeEdit"
            prepend-icon="tabler-x"
          > 
            Cancel 
          </VBtn>
          <VBtn 
            color="success" 
            variant="elevated" 
            @click="submitEdit"
            prepend-icon="tabler-device-floppy"
            class="ml-3"
          > 
            Save Changes
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Modern Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="500px" persistent>
      <VCard class="modern-dialog delete-dialog">
        <VCardTitle class="dialog-header pa-6 text-center">
          <div class="delete-header">
            <VIcon icon="tabler-alert-triangle" color="error" size="48" class="mb-3" />
            <h3 class="text-h5 font-weight-bold">Confirm Deletion</h3>
          </div>
        </VCardTitle>
        
        <VCardText class="text-center pa-6">
          <p class="text-body-1 mb-2">Are you sure you want to delete this price rate?</p>
          <VChip color="error" variant="tonal" size="large" class="font-weight-bold">
            {{ editedItem.departure }} to {{ editedItem.destination }}
          </VChip>
          <p class="text-caption text-medium-emphasis mt-3 mb-0">
            This action cannot be undone.
          </p>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-6 justify-center">
          <VBtn 
            color="secondary" 
            variant="outlined" 
            @click="closeDelete"
            prepend-icon="tabler-x"
            class="mr-3"
          >
            Cancel
          </VBtn>
          <VBtn 
            color="error" 
            variant="elevated" 
            @click="submitDelete"
            prepend-icon="tabler-trash"
          > 
            Delete Price Rate
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { useDeliveryStore } from '@/stores/depotCommittees';
import { paginationMeta } from '@api-utils/paginationMeta';
import axios from "axios";
import { onMounted } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable';

const deliveryStore = useDeliveryStore();
onMounted(() => {
  deliveryStore.fetchPriceRates();
});

const pricerates = computed(() => deliveryStore.pricerates);
const image = ref(null);

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '80px' },
  { title: 'Departure', key: 'departure', sortable: true },
  { title: 'Destination', key: 'destination', sortable: true },
  { title: 'Charge / KG', key: 'charge', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px' },
];

const searchQuery = ref('')
const itemsPerPage = ref(5)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const updateOptions = options => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const defaultItem = ref({ id: '', departure: '', destination: '', charge: '' })
const requiredValidator = v => !!v || 'This field is required'

const editedItem = ref(defaultItem.value)
const editedIndex = ref(-1)
const addDialog = ref(false)
const editDialog = ref(false)
const deleteDialog = ref(false)

const addItem = () => {
  editedItem.value = { ...defaultItem.value }
  addDialog.value = true
}
const editItem = item => {
  editedIndex.value = pricerates.value.indexOf(item)
  editedItem.value = { ...item }
  editDialog.value = true
}
const deleteItem = item => {
  editedIndex.value = pricerates.value.indexOf(item)
  editedItem.value = { ...item }
  deleteDialog.value = true
}

const closeAdd = () => { 
  addDialog.value = false
  editedItem.value = { ...defaultItem.value }
}
const closeEdit = () => {
  editDialog.value = false
  editedIndex.value = -1
  editedItem.value = { ...defaultItem.value }
}
const closeDelete = () => {
  deleteDialog.value = false
  editedIndex.value = -1
  editedItem.value = { ...defaultItem.value }
}

const submitAdd = async () => { 
  let formData = new FormData();
  formData.append("departure", editedItem.value.departure);
  formData.append("destination", editedItem.value.destination);
  formData.append("charge", editedItem.value.charge);
  let url = "/addpricerate";
  await axios.post(url, formData,).then((response) => {
  if (response.status == 200) {
    deliveryStore.fetchPriceRates();
    closeAdd()
  }
  });
}

const submitEdit = async () => { 
  let formData = new FormData();
  formData.append("id", editedItem.value.id);
  formData.append("departure", editedItem.value.departure);
  formData.append("destination", editedItem.value.destination);
  formData.append("charge", editedItem.value.charge);
  let url = "/updatepricerate";
  await axios.post(url, formData).then((response) => {
  if (response.status == 200) {
    deliveryStore.fetchPriceRates();
    closeEdit()
  }
  });
}

const submitDelete = async() => { 
  let formData = new FormData();
  formData.append("id", editedItem.value.id);
  let url = "/removepricerate";
  await axios.post(url, formData).then((response) => {
    if (response.status == 200) {
      deliveryStore.fetchPriceRates();
      closeDelete()
    }
  });
 }

</script>

<style scoped>
.pricerates-container {
  margin-inline: 0 auto;
  max-inline-size: 1200px;
}

.pricerates-header-card {
  border-radius: 16px !important;
}

.pricerates-content-card {
  overflow: hidden;
  border-radius: 16px !important;
}

.header-title-section {
  flex: 1;
}

.search-field {
  border-radius: 12px;
}

.foods-btn,
.add-category-btn {
  border-radius: 20px;
  font-weight: 600;
  text-transform: none;
}

.add-category-btn {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.8);
}

.modern-data-table {
  border-radius: 0;
}

.category-avatar {
  border: 2px solid rgba(var(--v-theme-primary), 0.1);
  border-radius: 28px;
}

.category-name-cell {
  display: flex;
  flex-direction: column;
}

.action-btn {
  border-radius: 8px !important;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.modern-pagination {
  background: rgba(var(--v-theme-surface), 0.3);
}

.pagination-info {
  font-weight: 500;
}

.loading-container {
  padding-inline: 60px 20px;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modern-dialog {
  border-radius: 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-header {
  border-radius: 16px 16px 0 0 !important;
  background: rgba(var(--v-theme-surface), 0.7);
}

.delete-dialog .dialog-header {
  background: rgba(var(--v-theme-error), 0.05);
}

.delete-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo-edit-section {
  padding: 16px;
  border: 1px solid rgba(var(--v-theme-outline), 0.1);
  border-radius: 20px;
  background: rgba(var(--v-theme-surface), 0.5);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .pricerates-container {
    padding: 16px;
  }
  
  .header-title-section {
    margin-block-end: 16px;
    text-align: center;
  }
  
  .search-field {
    min-inline-size: 100% !important;
  }
  
  .foods-btn,
  .add-category-btn {
    inline-size: 100%;
  }
}

/* Table hover effects */
.v-data-table tbody tr:hover {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}

/* Enhanced chip styling */
.v-chip {
  font-weight: 500;
  letter-spacing: 0.025em;
}

/* Form field focus states */
.v-text-field:focus-within .v-field__outline {
  border-width: 2px !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}

/* Button hover effects */
.v-btn:hover {
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.3);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Avatar hover effects */
.category-avatar:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* Card hover effects */
.pricerates-header-card:hover,
.pricerates-content-card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>
