<template>
  <div class="clients-container">
    <!-- Header Section with Enhanced Design -->
    <VCard class="clients-header-card" elevation="2">
      <VCardItem class="pa-6">
        <div class="d-flex flex-column flex-md-row align-center justify-space-between gap-4">
          <div class="header-title-section">
            <VCardTitle class="text-h4 font-weight-bold text-primary d-flex align-center gap-3">
              <VIcon icon="tabler-users" size="32" color="primary" />
              Senders Management
            </VCardTitle>
            <p class="text-body-2 text-medium-emphasis mt-2 mb-0">
              Manage your senders and their information
            </p>
          </div>
          
          <div class="d-flex flex-column flex-sm-row align-center gap-3">
            <VTextField
              v-model="searchQuery"
              placeholder="Search senders..."
              prepend-inner-icon="tabler-search"
              variant="outlined"
              density="compact"
              hide-details
              class="search-field"
              style="min-inline-size: 250px"
              clearable
            />
            <VBtn @click="addItem()" color="success" size="small" prepend-icon="tabler-plus" class="add-client-btn">
              Add Sender
            </VBtn>
          </div>
        </div>
      </VCardItem>
    </VCard>

    <!-- Main Content -->
    <VCard class="clients-content-card mt-6" elevation="1">
      <div v-if="clients.length" class="clients-table-container">
        <v-data-table
          :headers="headers"
          :items="clients"
          item-key="id"
          class="modern-data-table"
          v-model:page="page"
          :items-per-page="itemsPerPage"
          height="330"
          :search="searchQuery"
          item-value="name"
          @update:options="updateOptions"
          hover
          show-select
        >
          <!-- Custom ID Column -->
          <template v-slot:[`item.id`]="{ index }">
            <VChip size="small" color="primary" variant="tonal">
              #{{ String(index + 1).padStart(3, '0') }}
            </VChip>
          </template>

          <!-- Enhanced Name Column -->
          <template v-slot:[`item.name`]="{ item }">
            <div class="client-name-cell">
              <span class="font-weight-medium">{{ item.name }}</span>
            </div>
          </template>

          <!-- Enhanced Phone Column -->
          <template v-slot:[`item.phone`]="{ item }">
            <div class="d-flex align-center gap-1">
              <VIcon icon="tabler-phone" size="12" color="danger" />
              <span class="text-truncate" style="max-inline-size: 200px">{{ item.phone }}</span>
            </div>
          </template>

          <!-- Enhanced email Column -->
          <template v-slot:[`item.email`]="{ item }">
            <div class="d-flex align-center gap-1">
              <VIcon icon="tabler-mail" size="12" color="warning" />
              <span class="text-truncate" style="max-inline-size: 200px">{{ item.email }}</span>
            </div>
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

          <!-- Enhanced Expanded Row -->
          <template #expanded-row="slotProps">
            <tr class="expanded-row">
              <td :colspan="headers.length" class="pa-4">
                <VCard variant="tonal" color="surface">
                  <VCardText>
                    <div class="d-flex align-start gap-3">
                      <VIcon icon="tabler-user-circle" color="primary" size="20" />
                      <div>
                        <h6 class="text-subtitle-2 font-weight-bold mb-2">Biography</h6>
                        <p class="text-body-2 mb-0">{{ slotProps.item.bio }}</p>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </td>
            </tr>
          </template>

          <!-- Enhanced Pagination -->
          <template #bottom>
            <VDivider />
            <div class="modern-pagination pa-4">
              <div class="d-flex align-center justify-space-between flex-wrap gap-3">
                <VChip color="surface" variant="tonal" class="pagination-info">
                  {{ paginationMeta({ page, itemsPerPage }, clients.length) }}
                </VChip>

                <VPagination 
                  v-model="page" 
                  :total-visible="5"
                  :length="Math.ceil(clients.length / itemsPerPage)"
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
                      Previous
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
            <h3 class="text-h6 font-weight-medium mb-2">Loading Senders</h3>
            <p class="text-body-2 text-medium-emphasis">
              Please wait while we fetch the sender information...
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
            <VIcon icon="tabler-user-plus" color="success" size="24" />
            <span class="text-h5 font-weight-bold">Add New Sender</span>
          </div>
        </VCardTitle>
        
        <VDivider />
        
        <VCardText class="pa-6">
          <VForm ref="addForm">
            <VRow>
              <VCol cols="12">
                <VTextField 
                  v-model="editedItem.name" 
                  label="Full Name" 
                  prepend-inner-icon="tabler-user"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <VTextField 
                  v-model="editedItem.phone" 
                  label="Phone Number" 
                  type="tel"
                  prepend-inner-icon="tabler-phone"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <VTextField 
                  v-model="editedItem.email" 
                  label="Email Address" 
                  prepend-inner-icon="tabler-mail"
                  variant="outlined"
                  :rules="[requiredValidator]" 
                />
              </VCol>
              <VCol cols="12">
                <VTextField 
                  v-model="editedItem.address" 
                  label="Address" 
                  prepend-inner-icon="tabler-map-pin"
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
            Add Sender
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
            <span class="text-h5 font-weight-bold">Edit Sender</span>
          </div>
        </VCardTitle>
        
        <VDivider />
        
        <VCardText class="pa-6">
          <VForm ref="editForm">
            <VRow>
              <VCol cols="12">
                <VTextField 
                  v-model="editedItem.name" 
                  label="Full Name" 
                  prepend-inner-icon="tabler-user"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <VTextField 
                  v-model="editedItem.phone" 
                  label="Phone Number" 
                  type="tel"
                  prepend-inner-icon="tabler-phone"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <VTextField 
                  v-model="editedItem.email" 
                  label="Email Address" 
                  prepend-inner-icon="tabler-mail"
                  variant="outlined"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="editedItem.address" 
                  label="Address" 
                  variant="outlined"
                  prepend-inner-icon="tabler-map-pin"
                  placeholder="Enter the client's address..."
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
          <p class="text-body-1 mb-2">Are you sure you want to delete this client?</p>
          <VChip color="error" variant="tonal" size="large" class="font-weight-bold">
            {{ editedItem.name }}
          </VChip>
          <p class="text-caption text-medium-emphasis mt-3 mb-0">
            This action cannot be undone.
          </p>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-6 justify-center">
          <VBtn 
            color="surface" 
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
            Delete Sender
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { useClientStore } from '@/stores/clients';
import { paginationMeta } from '@api-utils/paginationMeta';
import axios from "axios";
import { onMounted } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable';

const clientStore = useClientStore();
onMounted(() => {
  clientStore.fetchClients();
});

const clients = computed(() => clientStore.clients);

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '80px' },
  { title: 'Full Name', key: 'name', sortable: true },
  { title: 'Phone', key: 'phone', sortable: false, width: '160px' },
  { title: 'Address', key: 'address', sortable: false },
  { title: 'Email Address', key: 'email', sortable: false },
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

const defaultItem = ref({ 
  id: '', 
  name: '', 
  phone: '', 
  address: '', 
  email: '',
})

const requiredValidator = v => !!v || 'This field is required'

const image = ref(null)
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
  editedIndex.value = clients.value.indexOf(item)
  editedItem.value = { ...item }
  editDialog.value = true
}

const deleteItem = item => {
  editedIndex.value = clients.value.indexOf(item)
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
  formData.append("name", editedItem.value.name);
  formData.append("phone", editedItem.value.phone);
  formData.append("email", editedItem.value.email);
  formData.append("address", editedItem.value.address);
  
  let url = "/addclient";
  await axios.post(url, formData).then((response) => {
    if (response.status == 200) {
      clientStore.fetchClients();
      closeAdd()
    }
  });
}

const submitEdit = async () => { 
  let formData = new FormData();
  formData.append("id", editedItem.value.id);
  formData.append("name", editedItem.value.name);
  formData.append("phone", editedItem.value.phone);
  formData.append("email", editedItem.value.email);
  formData.append("address", editedItem.value.address);
  
  let url = "/updateclient";
  await axios.post(url, formData).then((response) => {
    if (response.status == 200) {
      clientStore.fetchClients();
      closeEdit()
    }
  });
}

const submitDelete = async() => { 
  let formData = new FormData();
  formData.append("id", editedItem.value.id);
  
  let url = "/removeclient";
  await axios.post(url, formData).then((response) => {
    if (response.status == 200) {
      clientStore.fetchClients();
      closeDelete()
    }
  });
}

const onPhotoChange = (e) => { 
  image.value = e.target.files[0]; 
}
</script>

<style scoped>
.clients-container {
  margin-inline: 0 auto;
  max-inline-size: 1200px;
}

.clients-header-card {
  border-radius: 16px !important;
}

.clients-content-card {
  overflow: hidden;
  border-radius: 16px !important;
}

.header-title-section {
  flex: 1;
}

.search-field {
  border-radius: 12px;
}

.add-client-btn {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(var(--v-theme-success), 0.8);
  font-weight: 600;
  text-transform: none;
}

.modern-data-table {
  border-radius: 0;
}



.client-avatar {
  border: 2px solid rgba(var(--v-theme-primary), 0.1);
}

.client-name-cell {
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

.expanded-row {
  background: rgba(var(--v-theme-surface), 0.5) !important;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .clients-container {
    padding: 16px;
  }
  
  .header-title-section {
    margin-block-end: 16px;
    text-align: center;
  }
  
  .search-field {
    min-inline-size: 100% !important;
  }
}
</style>
