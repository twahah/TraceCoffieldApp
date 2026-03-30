<template>
  <VCard >
    <VCardItem class="project-header d-flex flex-wrap justify-space-between py-2 gap-4">
      <VCardTitle>System Roles</VCardTitle>
            <VBtn @click="addItem()"><VIcon icon="tabler-plus" color="white"/>New</VBtn>
            <div class=""></div>
        <template #append>
          <div style="inline-size: 250px;">
            <AppTextField v-model="searchQuery" placeholder="Search"/></div>
        </template>
      </VCardItem>
      <VDivider />
      <div v-if="roles.length">
        <v-data-table
          :headers="headers"
          :items="roles"
          item-key="id"
          class="elevation-1 text-no-wrap"
          v-model:page="page"
          :items-per-page="5"
          show-select
          height="330"
          :search="searchQuery"
          item-value="name"
          @update:options="updateOptions"
        >
          <template v-slot:[`item.id`]="{ index }"><td> {{index+1}}</td></template>
          <template v-slot:[`item.category`]="{ item }"><td>{{ item.category.name }}</td></template>
          <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="editItem(item)"><VIcon icon="tabler-edit" color="success"/></IconBtn>
            <IconBtn @click="deleteItem(item)"><VIcon icon="tabler-trash" color="error"/></IconBtn>
          </div>
        </template>
          <template #bottom>
        <VDivider />

        <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-3 pa-4">
          <p class="text-sm text-disabled mb-0">
            {{ paginationMeta({ page, itemsPerPage }, roles.length) }}
          </p>

          <VPagination v-model="page" :total-visible="Math.ceil(roles.length / itemsPerPage)" :length="Math.ceil(roles.length / itemsPerPage)">
            <template #next="slotProps">
              <VBtn v-bind="slotProps" :icon="false" variant="tonal" color="default"> Next</VBtn>
            </template>
            <template #prev="slotProps">
              <VBtn v-bind="slotProps" :icon="false" variant="tonal" color="default"> Previous</VBtn>
            </template>
          </VPagination>
        </div>
      </template>
        </v-data-table>
      </div>
      
      <VCard v-else class="text-center">
        <v-container >
          <v-row align-content="center" class="fill-height" justify="center">
            <v-col class="text-subtitle-1 text-center" cols="12"> Fetching Roles </v-col>
            <v-col cols="6">
              <v-progress-linear color="success" height="6" indeterminate rounded ></v-progress-linear>
            </v-col>
          </v-row>
        </v-container>
      </VCard>
  </VCard>

  <VDialog v-model="addDialog" max-width="600px">
<VCard>
  <VCardTitle><span class="headline">New Role</span></VCardTitle>
  <VCardText>
    <VContainer>
      <VRow>
        <VCol cols="12" lg="12"><VTextField v-model="editedItem.name" label="Role Name" :rules="[requiredValidator]"/></VCol>
      </VRow>
    </VContainer>
  </VCardText>

  <VCardActions>
    <VSpacer />
    <VBtn color="error" variant="outlined" @click="closeAdd"> Cancel </VBtn>
    <VBtn color="success" variant="elevated" @click="submitAdd"> Save</VBtn>
  </VCardActions>
</VCard>
</VDialog>

<VDialog v-model="editDialog" max-width="600px">
<VCard>
  <VCardTitle><span class="headline">Edit Role</span></VCardTitle>
  <VCardText>
    <VContainer>
      <VRow>
        <VCol cols="12" lg="12"><VTextField v-model="editedItem.name" label="Role Name" :rules="[requiredValidator]"/></VCol>
      </VRow>
    </VContainer>
  </VCardText>

  <VCardActions>
    <VSpacer />
    <VBtn color="error" variant="outlined" @click="closeEdit"> Cancel </VBtn>
    <VBtn color="success" variant="elevated" @click="submitEdit"> Save</VBtn>
  </VCardActions>
</VCard>
</VDialog>

<VDialog v-model="deleteDialog" max-width="500px">
<VCard>
  <VCardTitle class="text-center"> Are you sure you want to delete this role <br> <b>{{editedItem.name}}</b> ?</VCardTitle>
  <VCardActions>
    <VSpacer />
    <VBtn color="error" variant="outlined" @click="closeDelete">Cancel</VBtn>
    <VBtn color="success" variant="elevated" @click="submitDelete"> OK </VBtn>
    <VSpacer />
  </VCardActions>
</VCard>
</VDialog>

</template>

<script setup >
import axios from "axios"
import { VDataTable } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'
import { useUsersStore } from '@/stores/users';
import { onMounted } from 'vue';

    const usersStore = useUsersStore();
    const headers = [
      { title: 'ID', key: 'id' },
      { title: 'Name', key: 'name' },
      { title: 'Added by', key: 'addedby' },
      { title: 'Actions', key: 'actions' },
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
    })

    const editedItem = ref(defaultItem.value)
    const editedIndex = ref(-1)
    const addDialog = ref(false)
    const editDialog = ref(false)
    const deleteDialog = ref(false)

    const addItem = () =>{
      addDialog.value = true
    }

    const editItem = item => {
      editedIndex.value = roles.value.indexOf(item)
      editedItem.value = { ...item }
      editDialog.value = true
    }

    const deleteItem = item => {
      editedIndex.value = roles.value.indexOf(item)
      editedItem.value = { ...item }
      deleteDialog.value = true
    }

    const closeAdd = () => { addDialog.value = false }

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

    const submitAdd = async () =>{ 
      let formData = new FormData();
      formData.append("name", editedItem.value.name);
      let url = "/addsystemrole";
      await axios.post(url, formData).then((response) => {
      if (response.status == 200) {
        usersStore.fetchRoles();
        closeAdd()
      }
      });
    }

    const submitEdit = async () =>{ 
      let formData = new FormData();
      formData.append("id", editedItem.value.id);
      formData.append("name", editedItem.value.name);
      let url = "/updatesystemrole";
      await axios.post(url, formData).then((response) => {
      if (response.status == 200) {
        usersStore.fetchRoles();
        closeEdit()
      }
      });
    }
    const submitDelete = async() =>{ 
      let formData = new FormData();
      formData.append("id", editedItem.value.id);
      let url = "/removesystemrole";
      await axios.post(url, formData).then((response) => {
        if (response.status == 200) {
          usersStore.fetchRoles();
          closeDelete()
        }
      });
     }

    onMounted(() => {
      usersStore.fetchRoles();
    });
    const roles = computed(() => usersStore.roles);
    
</script>
