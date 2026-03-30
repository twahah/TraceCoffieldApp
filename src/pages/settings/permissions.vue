<template>
  <VCard class="px-3 py-3">
    <VCardItem class="project-header d-flex flex-wrap justify-space-between py-2 gap-4">
      <VCardTitle>System Permissions</VCardTitle></VCardItem>
      <VDivider />
      <v-data-table class="text-no-wrap" :items="permissions" :headers="modules"  item-key="id">
        <template v-slot:[`item.view_dashboard`]="{ item }"><td> <VSwitch :model-value="item.view_dashboard==1" @change="changePermission(item.role, 'view_dashboard')"/> </td></template>
        <template v-slot:[`item.view_newdeliveries`]="{ item }"><td> <VSwitch :model-value="item.view_newdeliveries==1" @change="changePermission(item.role, 'view_newdeliveries')"/> </td></template>
        <template v-slot:[`item.view_trackdeliveries`]="{ item }"><td> <VSwitch :model-value="item.view_trackdeliveries==1" @change="changePermission(item.role, 'view_trackdeliveries')"/> </td></template>
        <template v-slot:[`item.view_deliveries`]="{ item }"><td> <VSwitch :model-value="item.view_deliveries==1" @change="changePermission(item.role, 'view_deliveries')"/> </td></template>
        <template v-slot:[`item.view_clients`]="{ item }"><td> <VSwitch :model-value="item.view_clients==1" @change="changePermission(item.role, 'view_clients')"/> </td></template>
        <template v-slot:[`item.view_pricerates`]="{ item }"><td> <VSwitch :model-value="item.view_pricerates==1" @change="changePermission(item.role, 'view_pricerates')"/> </td></template>
        <template v-slot:[`item.view_couriers`]="{ item }"><td> <VSwitch :model-value="item.view_couriers==1" @change="changePermission(item.role, 'view_couriers')"/> </td></template>
      
        <template v-slot:[`item.view_users`]="{ item }"><td> <VSwitch :model-value="item.view_users==1" @change="changePermission(item.role, 'view_users')"/> </td></template>
        <template v-slot:[`item.view_roles`]="{ item }"><td> <VSwitch :model-value="item.view_roles==1" @change="changePermission(item.role, 'view_roles')"/> </td></template>
        <template v-slot:[`item.view_permissions`]="{ item }"><td> <VSwitch :model-value="item.view_permissions==1" @change="changePermission(item.role, 'view_permissions')"/> </td></template>
        <template v-slot:[`item.view_audits`]="{ item }"><td> <VSwitch :model-value="item.view_audits==1" @change="changePermission(item.role, 'view_audits')"/> </td></template>
      
      </v-data-table>
  </VCard>
</template>

<script setup >
import axios from "axios"
import { VDataTable } from 'vuetify/labs/VDataTable'
import { useUsersStore } from '@/stores/users';
import { onMounted } from 'vue';

    const usersStore = useUsersStore();
    const currentTab = ref()
    
    const defaultItem = ref({
      id: '',
      name: '',
    })

    const modules = [
      { title: 'Role', key: 'rolename' },
      { title: 'Dashboard', key: 'view_dashboard' },
      { title: 'New Delivery', key: 'view_newdeliveries' },
      { title: 'Track Delivery', key: 'view_trackdeliveries' },
      { title: 'Deliveries', key: 'view_deliveries' },
      { title: 'Clients', key: 'view_clients'},
      { title: 'Price Rates', key: 'view_pricerates'},
      { title: 'Couriers', key: 'view_couriers'},
      { title: 'System Users', key: 'view_users'},
      { title: 'Roles', key: 'view_roles'},
      { title: 'Permissions', key: 'view_permissions'},
      { title: 'Audits', key: 'view_audits'},
    ];

    const changePermission = async (role,permission) =>{ 
      let formData = new FormData();
      formData.append("role", role);
      formData.append("permission", permission);
      let url = "/updatepermission";
      await axios.post(url, formData).then((response) => {
      if (response.status == 200) {
        usersStore.fetchPermissions();
      }
      });
    }
   
    onMounted(() => {
      usersStore.fetchPermissions();
    });
    const permissions = computed(() => usersStore.permissions);
    
</script>
