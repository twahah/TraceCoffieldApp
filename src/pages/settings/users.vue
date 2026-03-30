<template>
  <VCard>
    <VCardItem class="project-header d-flex flex-wrap justify-space-between py-2 gap-4">
      <VCardTitle>System Users</VCardTitle>
            <VBtn @click="addItem()"><VIcon icon="tabler-plus" color="white"/>New</VBtn>
            <div class=""></div>
        <template #append>
          <div style="inline-size: 250px;"><AppTextField v-model="searchQuery" placeholder="Search"/></div>
        </template>
      </VCardItem>
      <VDivider />
      <div v-if="users.length">
        <v-data-table
          :headers="headers"
          :items="users"
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
          <template v-slot:[`item.role`]="{ item }"><td>{{ item.role.name }}</td></template>
          <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="editItem(item)"><VIcon icon="tabler-edit" color="success"/></IconBtn>
            <IconBtn @click="ChangePassword(item)"><VIcon icon="tabler-lock" color="info"/></IconBtn>
            <IconBtn @click="deleteItem(item)"><VIcon icon="tabler-trash" color="error"/></IconBtn>
          </div>
        </template>
          <template #bottom>
        <VDivider />

        <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-3 pa-4">
          <p class="text-sm text-disabled mb-0">
            {{ paginationMeta({ page, itemsPerPage }, users.length) }}
          </p>

          <VPagination v-model="page" :total-visible="Math.ceil(users.length / itemsPerPage)" :length="Math.ceil(users.length / itemsPerPage)">
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
            <v-col class="text-subtitle-1 text-center" cols="12"> Fetching Users </v-col>
            <v-col cols="6">
              <v-progress-linear color="success" height="6" indeterminate rounded ></v-progress-linear>
            </v-col>
          </v-row>
        </v-container>
      </VCard>
  </VCard>

  <VDialog v-model="addDialog" max-width="600px">
<VCard>
  <VCardTitle><span class="headline">New User</span></VCardTitle>
  <VCardText>
    <VContainer>
      <VRow>
        <VCol cols="12" lg="12"><VTextField v-model="editedItem.full_name" label="Full Name" :rules="[requiredValidator]"/></VCol>
        <VCol cols="12" lg="12"><VTextField v-model="editedItem.contact" label="Contact" type="number" :rules="[requiredValidator]"/></VCol>
        <VCol cols="12" lg="12"><VTextField v-model="editedItem.email_address" label="Email Address" type="email" :rules="[requiredValidator,emailValidator]" /></VCol>
        <VCol cols="12" lg="12"><VTextField v-model="editedItem.username" label="Username" :rules="[requiredValidator]"/></VCol>
        <VCol cols="12" lg="12"><VTextField v-model="editedItem.password" label="Password" :rules="[requiredValidator]"/></VCol>
        <VCol cols="12" lg="12"><AppSelect v-model="editedItem.role" :items="roles" item-title="name" item-value="id" label="Role" variant="underlined" :rules="[requiredValidator]"/></VCol>
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
  <VCardTitle><span class="headline">Edit User</span></VCardTitle>
  <VCardText>
    <VContainer>
      <VRow>
        <VCol cols="12" lg="12"><VTextField v-model="editedItem.full_name" label="Full Name" :rules="[requiredValidator]"/></VCol>
        <VCol cols="12" lg="12"><VTextField v-model="editedItem.contact" label="Contact" type="number" :rules="[requiredValidator]"/></VCol>
        <VCol cols="12" lg="12"><VTextField v-model="editedItem.email_address" label="Email Address" type="email" :rules="[requiredValidator, emailValidator]"/></VCol>
        <VCol cols="12" lg="12"><VTextField v-model="editedItem.username" label="Username" :rules="[requiredValidator]"/></VCol>
        <VCol cols="12" lg="12"><AppSelect v-model="editedItem.role" :items="roles" item-title="name" item-value="id" label="Role" variant="underlined" :rules="[requiredValidator]"/></VCol>
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

<VDialog v-model="passwordDialog" max-width="500px">
<VCard>
  <VCardTitle class="text-center"> Change Password for <b>{{editedItem.username}}</b> ?</VCardTitle>
    <VCardText>
    <VContainer>
      <VRow>
      <VCol cols="12" lg="12"><VTextField v-model="editedItem.password" label="Password" :rules="[requiredValidator]"/></VCol>
    </VRow>
    </VContainer>
    </VCardText>
  <VCardActions>
    <VSpacer />
    <VBtn color="error" variant="outlined" @click="closePassword">Cancel</VBtn>
    <VBtn color="success" variant="elevated" @click="submitPassword"> OK </VBtn>
    <VSpacer />
  </VCardActions>
</VCard>
</VDialog>

<VDialog v-model="deleteDialog" max-width="500px">
<VCard>
  <VCardTitle class="text-center"> Are you sure you want to delete this user <br> <b>{{editedItem.username}}</b> ?</VCardTitle>
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
  import { emailValidator } from "@/@core/utils/validators";

    const usersStore = useUsersStore();
    onMounted(() => {
      usersStore.fetchUsers();
      usersStore.fetchRoles();
    });
    const users = computed(() => usersStore.users);
    const roles = computed(() => usersStore.roles);

    const headers = [
      { title: 'ID', key: 'id' },
      { title: 'Full Name', key: 'full_name' },
      { title: 'Telephone', key: 'contact' },
      // { title: 'Email address', key: 'email_address' },
      { title: 'Username', key: 'username' },
      { title: 'Role', key: 'role' },
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
    
    const defaultItem = ref({ id: '', full_name: '',  contact: '', email_address: '', username: '', role:'', password:'',})

    const editedItem = ref(defaultItem.value)
    const editedIndex = ref(-1)
    const addDialog = ref(false)
    const editDialog = ref(false)
    const deleteDialog = ref(false)
    const passwordDialog = ref(false)

    const addItem = () =>{ addDialog.value = true }

    const editItem = item => {
      editedIndex.value = users.value.indexOf(item)
      editedItem.value = { ...item }
      editDialog.value = true
    }

    const deleteItem = item => {
      editedIndex.value = users.value.indexOf(item)
      editedItem.value = { ...item }
      deleteDialog.value = true
    }

    const ChangePassword = item => {
      editedIndex.value = users.value.indexOf(item)
      editedItem.value = { ...item }
      passwordDialog.value = true
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

    const closePassword = () => {
      passwordDialog.value = false
      editedIndex.value = -1
      editedItem.value = { ...defaultItem.value }
    }

    const submitAdd = async () =>{ 
      let formData = new FormData();
      formData.append("role", editedItem.value.role.id ?? editedItem.value.role);
      formData.append("full_name", editedItem.value.full_name);
      formData.append("contact", editedItem.value.contact);
      formData.append("email_address", editedItem.value.email_address);
      formData.append("username", editedItem.value.username);
      formData.append("password", editedItem.value.password);
      let url = "/addsystemuser";
      await axios.post(url, formData).then((response) => {
      // if (response.status == 201) {
        usersStore.fetchUsers();
        closeAdd()
      // }
      });
    }

    const submitEdit = async () =>{ 
      let formData = new FormData();
      formData.append("id", editedItem.value.id);
      formData.append("role", editedItem.value.role.id ?? editedItem.value.role);
      formData.append("full_name", editedItem.value.full_name);
      formData.append("contact", editedItem.value.contact);
      formData.append("email_address", editedItem.value.email_address);
      formData.append("username", editedItem.value.username);
      let url = "/updatesystemuser";
      await axios.post(url, formData).then((response) => {
      if (response.status == 200) {
        usersStore.fetchUsers();
        closeEdit()
      }
      });
    }

    const submitPassword = async() =>{ 
      let formData = new FormData();
      formData.append("id", editedItem.value.id);
      formData.append("password", editedItem.value.password);
      let url = "/updateuserpassword";
      await axios.post(url, formData).then((response) => {
        if (response.status == 200) {
          usersStore.fetchUsers();
          closePassword()
        }
      });
     }

    const submitDelete = async() =>{ 
      let formData = new FormData();
      formData.append("id", editedItem.value.id);
      let url = "/removesystemuser";
      await axios.post(url, formData).then((response) => {
        if (response.status == 200) {
          usersStore.fetchUsers();
          closeDelete()
        }
      });
     }
    
</script>
