<template>
  <VCard >
    <VCardItem class="project-header d-flex flex-wrap justify-space-between py-2 gap-4">
      <VCardTitle>System Audits</VCardTitle>
      
        <template #append>
          <div style="inline-size: 250px;">
            <AppTextField v-model="searchQuery" placeholder="Search"/></div>
        </template>
      </VCardItem>
      <div class="d-flex flex-wrap justify-space-center py-2 px-5 gap-2">
        <div style="inline-size: 250px;"><AppDateTimePicker v-model="dates" label="Select Dates" placeholder="Select dates" :config="{ mode: 'range' }" :rules="[requiredValidator]"/></div>
        <div style="inline-size: 250px;"><AppSelect v-model="username" :items="users" item-title="full_name" item-value="id" label="Role" variant="underlined" :rules="[requiredValidator]"/></div>
        <VBtn @click="filter()" class="mt-sm-6"><VIcon icon="tabler-filter" color="white"/>Filter</VBtn>
      </div>
      <VDivider />
      <div v-if="audits.length">
        <v-data-table
          :headers="headers"
          :items="audits"
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
          <template v-slot:[`item.addedby`]="{ item }"><td>{{ item.addedby.username }}</td></template>
          <template #bottom>
        <VDivider />

        <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-3 pa-4">
          <p class="text-sm text-disabled mb-0">
            {{ paginationMeta({ page, itemsPerPage }, audits.length) }}
          </p>

          <VPagination v-model="page" :total-visible="Math.ceil(audits.length / itemsPerPage)" :length="Math.ceil(audits.length / itemsPerPage)">
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
            <v-col class="text-subtitle-1 text-center" cols="12"> Fetching Audits </v-col>
            <v-col cols="6">
              <v-progress-linear color="success" height="6" indeterminate rounded ></v-progress-linear>
            </v-col>
          </v-row>
        </v-container>
      </VCard>
  </VCard>

</template>

<script setup >
import axios from "axios"
import { VDataTable } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'
import { useUsersStore } from '@/stores/users';
import { onMounted, ref } from 'vue';

    const usersStore = useUsersStore();
    const headers = [
      { title: 'ID', key: 'id' },
      { title: 'Activity', key: 'activity' },
      { title: 'Added by', key: 'addedby' },
      { title: 'Added on', key: 'addedon' },
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
    
    const user = ref({
      userid: '',
      dateRange: '',
    })

    const username = ref('')
    const dates = ref('')

    const filter = () =>{
      usersStore.filterAudits({user:username.value,dates:dates.value})
    }

    onMounted(() => {
      usersStore.fetchAudits();
      usersStore.fetchUsers();
    });
    const audits = computed(() => usersStore.audits);
    const users = computed(() => usersStore.users);
    
</script>
