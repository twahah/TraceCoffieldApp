<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { VCard } from "vuetify/lib/components/index.mjs";
const userData = JSON.parse(localStorage.getItem("user"));
const currentDate = new Date();
const currentMonth = ref(currentDate.toLocaleString('default', { month: 'long' }));
const chartOptions = ref({
  chart: { type: 'bar',},
  xaxis: { categories: [],  title: { text: "Services", }, },
  title: { text: 'Appointments this Month', align: 'center',},
  colors: ['#28C76F'],
});

const chartSeries = ref([ { name: 'appointments', data: [], }, ]);

const chartOptions1 = ref({
  chart: { type: 'bar',},
  xaxis: { categories: [],  title: { text: "Drugs", }, },
  title: { text: 'Drug Orders this Month ', align: 'center',},
  colors: ['#FFA500'],
});

const chartSeries1 = ref([ { name: 'orders', data: [], }, ]);

const totalappointments = ref("0");
const pendingappointments = ref("0");
const totalorders = ref("0");
const pendingorders = ref("0");

// Fetch data and update state
const fetchDashboardItems = async () => {
  try {
    const response = await axios.get("/analysis");
    if (response.status === 200) {
      totalappointments.value = response.data.totalappointments;
      pendingappointments.value = response.data.pendingappointments;
      totalorders.value = response.data.totalorders;
      pendingorders.value = response.data.pendingorders;

      const bookings = response.data.bookings;
      const categories = bookings.map(item => item.name);
      const data = bookings.map(item => item.count);
      chartSeries.value[0].data = data;
      chartOptions.value = { ...chartOptions.value, xaxis: { ...chartOptions.value.xaxis, categories, },};

      const orders = response.data.drugorders;
      const categories1 = orders.map(item => item.name);
      const data1 = orders.map(item => item.count);
      chartSeries1.value[0].data = data1;
      chartOptions1.value = { ...chartOptions1.value, xaxis: { ...chartOptions1.value.xaxis, categories: categories1, },};

    }
  } catch (error) {
    console.error("Error fetching dashboard items:", error);
  }
};

onMounted(() => {
  fetchDashboardItems();
});
</script>

<template>
  <VCard class="mx-0 my-0 px-2 py-2" v-if="userData.permissions['view_dashboard']">
    <VRow >
      <VCol md="3">
        <VCard color="primary">
          <VCardText>
            <h6 class="text-h6 text-white mb-1">Total Appointments</h6>
            <div class="d-flex justify-content-between">
              <VChip label variant="flat" color="rgba(var(--v-theme-on-surface), 0.12)" size="large" class="font-weight-bold text-white rounded me-2">
                {{ totalappointments }}
              </VChip>
              <small class="mt-3">appointments</small>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol md="3">
        <VCard color="info">
          <VCardText>
            <h6 class="text-h6 text-white mb-1">Pending Appointments</h6>
            <div class="d-flex justify-content-between">
              <VChip label variant="flat" color="rgba(var(--v-theme-on-surface), 0.12)" size="large" class="font-weight-bold text-white rounded me-2">
                {{ pendingappointments }}
              </VChip>
              <small class="mt-3">appointments</small>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol md="3">
        <VCard color="secondary">
          <VCardText>
            <h6 class="text-h6 text-white mb-1">Total Drug Orders</h6>
            <div class="d-flex justify-content-between">
              <VChip label variant="flat" color="rgba(var(--v-theme-on-surface), 0.12)" size="large" class="font-weight-bold text-white rounded me-2">
                {{ totalorders }}
              </VChip>
              <small class="mt-3">orders</small>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol md="3">
        <VCard color="success">
          <VCardText>
            <h6 class="text-h6 text-white mb-1">Pending Drug Orders</h6>
            <div class="d-flex justify-content-between">
              <VChip label variant="flat" color="rgba(var(--v-theme-on-surface), 0.12)" size="large" class="font-weight-bold text-white rounded me-2">
                {{ pendingorders }}
              </VChip>
              <small class="mt-3">orders</small>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol md="6">
        <VueApexCharts :options="chartOptions" :series="chartSeries" height="260" />
      </VCol>
      <VCol md="6">
        <VueApexCharts :options="chartOptions1" :series="chartSeries1" height="260" />
      </VCol>
    </VRow>
  </VCard>
 <VCard v-else>
  <VCardItem class="project-header d-flex flex-wrap justify-space-between py-2 gap-4">
    <VCardTitle>Dashboard</VCardTitle>
  </VCardItem>
  <VDivider />
  <VCardText>
    <p>You do not have permission to view this page</p>
  </VCardText>
 </VCard>

</template>
