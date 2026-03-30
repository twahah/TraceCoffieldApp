<template>
  <div class="dm-root">

    <!-- ═══════════════════════ HEADER ═══════════════════════ -->
    <div class="dm-header">
      <div class="dm-header-inner">
        <div class="dm-brand">
          <div class="dm-brand-icon">
            <VIcon icon="tabler-truck-delivery" size="22" color="white" />
          </div>
          <div>
            <div class="dm-brand-title">Delivery Management</div>
            <div class="dm-brand-sub">Track and manage all deliveries</div>
          </div>
        </div>
        <div class="dm-header-chips">
          <div v-for="s in deliveryStats" :key="s.label" class="dm-stat-chip" :class="`dm-chip--${s.color}`">
            <VIcon :icon="s.icon" size="14" />
            <span class="dm-chip-val">{{ s.value }}</span>
            <span class="dm-chip-label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════ QUICK STATS ═══════════════════════ -->
    <div class="dm-stats-row">
      <div v-for="s in quickStats" :key="s.label" class="dm-stat-card" :class="s.class">
        <div class="dm-stat-icon">
          <VIcon :icon="s.icon" size="22" />
        </div>
        <div class="dm-stat-body">
          <div class="dm-stat-val">{{ s.value }}</div>
          <div class="dm-stat-lbl">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════ FILTER BAR ═══════════════════════ -->
    <div class="dm-filter-bar">
      <div class="dm-filter-left">
        <div class="dm-search-wrap">
          <VIcon icon="tabler-search" size="16" class="dm-search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            class="dm-search-input"
            placeholder="Search tracking, sender, courier…"
          />
          <button v-if="searchQuery" class="dm-search-clear" @click="searchQuery = ''">
            <VIcon icon="tabler-x" size="14" />
          </button>
        </div>

        <VSelect
          v-model="statusFilter"
          :items="statusOptions"
          label="Status"
          variant="outlined"
          density="compact"
          item-title="text"
          item-value="value"
          hide-details
          clearable
          class="dm-filter-select"
          style="min-inline-size:150px"
        />

        <AppDateTimePicker
          v-model="dateRange"
          placeholder="Date range"
          :config="{ mode: 'range', dateFormat: 'Y-m-d' }"
          density="compact"
          class="dm-filter-select"
          style="min-inline-size:180px"
        />

        <VSelect
          v-model="courierFilter"
          :items="uniqueCouriers"
          label="Courier"
          variant="outlined"
          density="compact"
          item-title="name"
          item-value="id"
          hide-details
          clearable
          class="dm-filter-select"
          style="min-inline-size:150px"
        >
          <template #item="{ props, item }">
            <VListItem v-bind="props">
              <template #prepend>
                <VAvatar size="26">
                  <VImg :src="`${BASE_URL}/couriers/${item.raw.photo}`" cover />
                </VAvatar>
              </template>
            </VListItem>
          </template>
        </VSelect>

        <VSelect
          v-model="paymentModeFilter"
          :items="paymentModeOptions"
          label="Payment Mode"
          variant="outlined"
          density="compact"
          item-title="text"
          item-value="value"
          hide-details
          clearable
          class="dm-filter-select"
          style="min-inline-size:150px"
        />
      </div>

      <div class="dm-filter-right">
        <VBtn size="small" variant="tonal" color="secondary" prepend-icon="tabler-refresh" @click="resetFilters" class="dm-btn">Reset</VBtn>

        <VMenu>
          <template #activator="{ props }">
            <VBtn size="small" variant="tonal" color="success" prepend-icon="tabler-download" v-bind="props" class="dm-btn">Export</VBtn>
          </template>
          <VList>
            <VListItem @click="exportToExcel">
              <VListItemTitle class="d-flex align-center gap-2"><VIcon icon="tabler-file-spreadsheet" color="success" size="16"/>Excel</VListItemTitle>
            </VListItem>
            <VListItem @click="exportToPDF">
              <VListItemTitle class="d-flex align-center gap-2"><VIcon icon="tabler-file-text" color="error" size="16"/>PDF</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>

        <VBtn size="small" color="primary" prepend-icon="tabler-refresh" @click="refreshDeliveries" :loading="loading" class="dm-btn">Refresh</VBtn>
      </div>
    </div>

    <!-- ═══════════════════════ TABLE ═══════════════════════ -->
    <div class="dm-table-wrap">
      <div v-if="filteredDeliveries.length > 0">
        <v-data-table
          :headers="headers"
          :items="filteredDeliveries"
          item-key="id"
          class="dm-table"
          v-model:page="page"
          :items-per-page="itemsPerPage"
          :search="searchQuery"
          hover
          mobile-breakpoint="0"
        >
          <!-- Tracking -->
          <template #item.tracking_number="{ item }">
            <div
              class="dm-tracking-chip"
              @click="copyTrackingNumber(item.tracking_number)"
              title="Click to copy"
            >
              <VIcon icon="tabler-hash" size="12" />
              {{ item.tracking_number }}
              <VIcon icon="tabler-copy" size="12" class="dm-copy-icon" />
            </div>
          </template>

          <!-- Client -->
          <template #item.client="{ item }">
            <div class="dm-person-cell">
              <div class="dm-avatar dm-avatar--primary">{{ getInitials(item.client?.name) }}</div>
              <div>
                <div class="dm-person-name">{{ item.client?.name }}</div>
                <div class="dm-person-sub">{{ item.client?.phone }}</div>
              </div>
            </div>
          </template>

          <!-- Courier -->
          <template #item.courier="{ item }">
            <div class="dm-person-cell">
              <VAvatar size="32" class="dm-courier-avatar">
                <VImg :src="`${BASE_URL}/couriers/${item.courier?.photo}`" cover />
              </VAvatar>
              <div>
                <div class="dm-person-name">{{ item.courier?.name }}</div>
                <div class="dm-person-sub">{{ item.courier?.vehicle_no }}</div>
              </div>
            </div>
          </template>

          <!-- Route -->
          <template #item.route="{ item }">
            <div class="dm-route-cell">
              <div class="dm-route-from">{{ item.departure }}</div>
              <div class="dm-route-arrow">
                <div class="dm-route-line"></div>
                <VIcon icon="tabler-arrow-right" size="13" color="primary" />
              </div>
              <div class="dm-route-to">{{ item.destination }}</div>
            </div>
            <div class="dm-route-rate">${{ item.pricerate?.charge }}/kg</div>
          </template>

          <!-- Parcels -->
          <template #item.parcels="{ item }">
            <div class="dm-parcel-cell">
              <span class="dm-parcel-count">{{ item.parcels?.length }}</span>
              <span class="dm-parcel-lbl">parcel{{ item.parcels?.length !== 1 ? 's' : '' }}</span>
            </div>
            <div class="dm-parcel-weight">{{ calculateTotalWeight(item.parcels) }} kg</div>
          </template>

          <!-- Date -->
          <template #item.delivery_date_time="{ item }">
            <div class="dm-date-val">{{ formatDate(item.delivery_date_time) }}</div>
            <div class="dm-time-val">{{ formatTime(item.delivery_date_time) }}</div>
          </template>

          <!-- Amount -->
          <template #item.amount="{ item }">
            <div class="dm-amount">${{ calculateDeliveryAmount(item) }}</div>
          </template>
          
          <template #item.payment_status="{ item }">
            <div class="dm-payment-badge" :class="`dm-payment--${item.payStatus || 'pending'}`">
              <VIcon :icon="getPaymentIcon(item.payStatus)" size="12" />
              {{ getPaymentStatusText(item.payStatus) }}
              <br> <span v-if="item.payDate" class="dm-payment-date">
              <VIcon icon="tabler-calendar" size="10" />
                {{ formatDate(item.payDate) }}
              </span>
            </div>
          </template>

          <!-- Status -->
          <template #item.status="{ item }">
            <div class="dm-status-badge" :class="`dm-status--${item.status}`">
              <VIcon :icon="getStatusIcon(item.status)" size="12" />
              {{ getStatusText(item.status) }}
            </div>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
          <div class="dm-actions">
            <button class="dm-action-btn dm-action-btn--view" @click="viewDelivery(item)" title="View">
              <VIcon icon="tabler-eye" size="15" />
            </button>
            
            <!-- Payment button based on conditions -->
            <button 
              v-if="item.payStatus !== 'paid' && item.payment_method === 'delivery' && item.status !== 'cancelled' && item.status !== 'pending'"
              class="dm-action-btn dm-action-btn--pay" 
              @click="openPaymentDialog(item)" 
              title="Process Payment"
            >
              <VIcon icon="tabler-cash" size="15" />
            </button>

            <button 
              v-if="item.payStatus !== 'paid' && item.payment_method === 'departure' && item.status !== 'cancelled'"
              class="dm-action-btn dm-action-btn--pay" 
              @click="openPaymentDialog(item)" 
              title="Process Payment"
            >
              <VIcon icon="tabler-cash" size="15" />
            </button>
            
            <button class="dm-action-btn dm-action-btn--print" @click="printReceipt(item)" title="Print receipt">
              <VIcon icon="tabler-printer" size="15" />
            </button>
          </div>
        </template>

          <!-- Footer -->
          <template #bottom>
            <div class="dm-table-footer">
              <span class="dm-footer-info">
                Showing {{ getPaginationInfo().from }}–{{ getPaginationInfo().to }}
                of {{ filteredDeliveries.length }}
                <span v-if="searchQuery || statusFilter || courierFilter || dateRange" class="dm-footer-filter">(filtered)</span>
              </span>
              <div class="dm-footer-right">
                <div class="dm-ipp">
                  <span>Per page:</span>
                  <VSelect v-model="itemsPerPage" :items="[5,10,25,50]" density="compact" variant="outlined" hide-details style="inline-size:90px" />
                </div>
                <VPagination
                  v-model="page"
                  :length="Math.ceil(filteredDeliveries.length / itemsPerPage)"
                  :total-visible="5"
                  color="primary"
                  rounded="circle"
                  size="small"
                />
              </div>
            </div>
          </template>
        </v-data-table>
      </div>

      <!-- Empty state -->
      <div v-else class="dm-empty">
        <div class="dm-empty-icon">
          <VIcon icon="tabler-package-off" size="52" color="primary" />
        </div>
        <div class="dm-empty-title">No Deliveries Found</div>
        <div class="dm-empty-sub">
          {{ searchQuery || statusFilter || courierFilter || dateRange
            ? 'Try adjusting your filters'
            : 'No deliveries have been created yet' }}
        </div>
        <VBtn v-if="searchQuery || statusFilter || courierFilter || dateRange" @click="resetFilters" color="primary" variant="tonal" size="small" prepend-icon="tabler-refresh" class="mt-4">Reset Filters</VBtn>
      </div>
    </div>

    <!-- ═══════════════════════ VIEW DIALOG ═══════════════════════ -->
    <VDialog v-model="viewDialog" max-width="800px" persistent>
      <DeliveryViewDialog
        v-if="selectedDelivery"
        :delivery="selectedDelivery"
        @close="closeViewDialog"
        @print="printReceipt"
      />
    </VDialog>

    <!-- ═══════════════════════ DELETE DIALOG ═══════════════════════ -->
    <VDialog v-model="deleteDialog" max-width="460px" persistent>
      <VCard class="dm-delete-dialog">
        <div class="dm-delete-top">
          <div class="dm-delete-icon-wrap">
            <VIcon icon="tabler-alert-triangle" size="32" color="error" />
          </div>
          <div class="dm-delete-title">Delete Delivery?</div>
          <div class="dm-delete-sub">
            This will permanently remove
            <strong>{{ selectedDelivery?.tracking_number }}</strong>
            and all associated data.
          </div>
        </div>
        <VCardActions class="dm-delete-actions">
          <VBtn variant="outlined" color="secondary" @click="deleteDialog = false" :disabled="deleting">Cancel</VBtn>
          <VBtn color="error" variant="elevated" @click="confirmDelete" :loading="deleting" prepend-icon="tabler-trash">Delete</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Payment Dialog -->
    <PaymentDialog
      v-model="paymentDialog"
      :delivery="selectedForPayment"
      @payment-completed="handlePaymentCompleted"
    />

    <!-- Toast -->
    <VSnackbar v-model="showToast" :color="toastColor" :timeout="3000" location="top right">
      {{ toastMessage }}
    </VSnackbar>
  </div>
</template>

<script setup>
import { useDeliveryStore } from '@/stores/depotCommittees';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { computed, onMounted, ref, watch } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable';
import * as XLSX from 'xlsx';
import DeliveryViewDialog from './DeliveryViewDialog.vue';
import PaymentDialog from './PaymentDialog.vue';

const deliveriesStore = useDeliveryStore();
const deliveries = computed(() => deliveriesStore.deliveries || []);
const loading    = ref(false);
const deleting   = ref(false);
const page       = ref(1);
const itemsPerPage   = ref(10);
const searchQuery    = ref('');
const statusFilter   = ref('');
const courierFilter  = ref('');
const dateRange      = ref('');
const selectedDelivery = ref(null);
const viewDialog   = ref(false);
const deleteDialog = ref(false);
const showToast    = ref(false);
const toastMessage = ref('');
const toastColor   = ref('success');
const BASE_URL = (axios.defaults.baseURL || '').replace(/\/api\/?$/, '');

const statusOptions = [
  { text:'Pending',    value:'pending',    color:'warning' },
  { text:'Accepted',   value:'accepted',   color:'info'    },
  { text:'In Transit', value:'in_transit', color:'primary' },
  { text:'Delivered',  value:'delivered',  color:'success' },
  { text:'Cancelled',  value:'cancelled',  color:'error'   }
];

const headers = [
  { title:'Tracking #',    key:'tracking_number',  sortable:true,  width:'150px' },
  { title:'Sender',        key:'client',            sortable:true,  width:'170px' },
  { title:'Courier',       key:'courier',           sortable:true,  width:'170px' },
  { title:'Route',         key:'route',             sortable:false, width:'200px' },
  { title:'Parcels',       key:'parcels',           sortable:false, width:'110px' },
  { title:'Delivery Time', key:'delivery_date_time',sortable:true,  width:'140px' },
  { title:'Amount',        key:'amount',            sortable:false, width:'100px' },
  { title:'Payment',       key:'payment_status',    sortable:true,  width:'120px' },
  { title:'Status',        key:'status',            sortable:true,  width:'130px' },
  { title:'Actions',       key:'actions',           sortable:false, width:'120px' },
];

// Add to your script setup
const paymentModeFilter = ref('');

const paymentModeOptions = [
  { text: 'All Methods', value: '' },
  { text: 'Cash', value: 'cash' },
  { text: 'Card', value: 'card' },
  { text: 'Bank Transfer', value: 'bank_transfer' },
  { text: 'Mobile Money', value: 'mobile_money' },
];

// Add to filteredDeliveries computed

// Add to script setup
const paymentDialog = ref(false);
const selectedForPayment = ref(null);

const openPaymentDialog = (delivery) => {
  selectedForPayment.value = delivery;
  paymentDialog.value = true;
};

const handlePaymentCompleted = (updatedDelivery) => {
  // Update the delivery in your store
  const index = deliveries.value.findIndex(d => d.id === updatedDelivery.id);
  if (index !== -1) {
    deliveries.value[index] = updatedDelivery;
  }
  showToastMessage('Payment processed successfully', 'success');
};

const getPaymentIcon = (status) => {
  const icons = {
    paid: 'tabler-check',
    pending: 'tabler-clock',
    overdue: 'tabler-alert-circle',
    partial: 'tabler-cash'
  };
  return icons[status] || 'tabler-cash';
};

const getPaymentStatusText = (status) => {
  const texts = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
    partial: 'Partial'
  };
  return texts[status] || 'Pending';
};

const uniqueCouriers = computed(() => {
  const m = new Map();
  deliveries.value.forEach(d => { if (d.courier && !m.has(d.courier.id)) m.set(d.courier.id, d.courier); });
  return Array.from(m.values());
});

const filteredDeliveries = computed(() => {
  let f = deliveries.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    f = f.filter(d =>
      d.tracking_number.toLowerCase().includes(q) ||
      d.client?.name.toLowerCase().includes(q) ||
      d.client?.phone?.includes(q) ||
      d.courier?.name.toLowerCase().includes(q) ||
      d.departure.toLowerCase().includes(q) ||
      d.destination.toLowerCase().includes(q)
    );
  }
  if (statusFilter.value)  f = f.filter(d => d.status === statusFilter.value);
  if (courierFilter.value) f = f.filter(d => d.courier_id === courierFilter.value);
  if (dateRange.value) {
    const parts = dateRange.value.split(' to ');
    const s = new Date(parts[0]);
    const e = new Date(parts[1] || parts[0]);
    e.setHours(23,59,59,999);
    f = f.filter(d => { const dt = new Date(d.delivery_date_time); return dt >= s && dt <= e; });
  }
  if (paymentModeFilter.value) f = f.filter(d => d.paymentMode === paymentModeFilter.value);
  return f;
});

const deliveryStats = computed(() => {
  const total     = deliveries.value.length;
  const pending   = deliveries.value.filter(d=>d.status==='pending').length;
  const inTransit = deliveries.value.filter(d=>d.status==='in_transit').length;
  const delivered = deliveries.value.filter(d=>d.status==='delivered').length;
  const unpaid    = deliveries.value.filter(d=>d.payStatus === 'pending').length;
  
  return [
    { label:'Total',      value:total,     icon:'tabler-package',       color:'neutral'  },
    { label:'Pending',    value:pending,   icon:'tabler-clock',         color:'warning'  },
    { label:'In Transit', value:inTransit, icon:'tabler-truck',         color:'info'     },
    { label:'Delivered',  value:delivered, icon:'tabler-circle-check',  color:'success'  },
    { label:'Unpaid',     value:unpaid,    icon:'tabler-cash-off',      color:'error'     },
  ];
});

const quickStats = computed(() => {
  const tw = deliveries.value.reduce((s,d)=>s+d.parcels.reduce((ps,p)=>ps+parseFloat(p.weight||0),0),0);
  const tr = deliveries.value.reduce((s,d)=>s+parseFloat(calculateDeliveryAmount(d)),0);
  const uc = new Set(deliveries.value.map(d=>d.client_id)).size;
  
  const pendingPayments = deliveries.value.filter(d => d.payStatus === 'pending').length;
  const totalPaid = deliveries.value
    .filter(d => d.payStatus === 'paid')
    .reduce((s,d) => s + parseFloat(calculateDeliveryAmount(d)), 0);
  
  return [
    { label:'Total Deliveries', value:deliveries.value.length,      icon:'tabler-packages',         class:'dm-qs--primary'  },
    { label:'Total Weight',     value:`${tw.toFixed(1)} kg`,         icon:'tabler-weight',           class:'dm-qs--success'  },
    { label:'Total Revenue',    value:`$${tr.toFixed(2)}`,           icon:'tabler-currency-dollar',  class:'dm-qs--success'  },
    { label:'Active Clients',   value:uc,                            icon:'tabler-users',            class:'dm-qs--info'     },
    { label:'Pending Payments', value:pendingPayments,               icon:'tabler-clock-dollar',     class:'dm-qs--warning'  },
    { label:'Collected',        value:`$${totalPaid.toFixed(2)}`,    icon:'tabler-cash',             class:'dm-qs--success'  },
  ];
});

// Methods
const refreshDeliveries = async () => {
  loading.value = true;
  try { await deliveriesStore.fetchDeliveries(); showToastMessage('Refreshed','success'); }
  catch { showToastMessage('Error refreshing','error'); }
  finally { loading.value = false; }
};
const resetFilters = () => { searchQuery.value=''; statusFilter.value=''; courierFilter.value=''; dateRange.value=''; page.value=1; };
const viewDelivery = d => { selectedDelivery.value=d; viewDialog.value=true; };
const closeViewDialog = () => { viewDialog.value=false; selectedDelivery.value=null; };
const deleteDelivery = d => { selectedDelivery.value=d; deleteDialog.value=true; };
const confirmDelete = async () => {
  if (!selectedDelivery.value) return;
  deleting.value = true;
  try {
    const fd = new FormData(); fd.append('id',selectedDelivery.value.id);
    const res = await axios.post('/removedelivery',fd);
    if (res.status===200) { await deliveriesStore.fetchDeliveries(); showToastMessage('Deleted','success'); deleteDialog.value=false; selectedDelivery.value=null; }
  } catch { showToastMessage('Error deleting','error'); }
  finally { deleting.value=false; }
};

const getInitials = n => n ? n.split(' ').map(w=>w[0]).join('').toUpperCase().substring(0,2) : '?';
const formatDate = d => d ? new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : 'N/A';
const formatTime = d => d ? new Date(d).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : 'N/A';
const formatDateTime = d => d ? new Date(d).toLocaleString() : 'N/A';
const calculateTotalWeight = p => (!p||!Array.isArray(p))?'0.00':p.reduce((s,x)=>s+parseFloat(x.weight||0),0).toFixed(2);
const calculateTotalValue = p => (!p||!Array.isArray(p))?'0.00':p.reduce((s,x)=>s+parseFloat(x.value||0),0).toFixed(2);
const calculateDeliveryAmount = d => { if(!d?.parcels||!d?.pricerate)return'0.00'; return(parseFloat(calculateTotalWeight(d.parcels))*parseFloat(d.pricerate.charge||0)).toFixed(2); };
const getStatusColor = s => ({pending:'warning',accepted:'info',in_transit:'primary',delivered:'success',cancelled:'error'})[s]||'default';
const getStatusIcon  = s => ({pending:'tabler-clock',accepted:'tabler-check',in_transit:'tabler-truck',delivered:'tabler-circle-check',cancelled:'tabler-x'})[s]||'tabler-help';
const getStatusText  = s => ({pending:'Pending',accepted:'Accepted',in_transit:'In Transit',delivered:'Delivered',cancelled:'Cancelled'})[s]||'Unknown';
const getFileIcon = t => { if(!t)return'tabler-file'; if(t.includes('image'))return'tabler-photo'; if(t.includes('pdf'))return'tabler-file-text'; if(t.includes('word'))return'tabler-file-word'; return'tabler-file'; };
const formatFileSize = b => { if(!b)return'0 B'; const k=1024,s=['B','KB','MB','GB'],i=Math.floor(Math.log(b)/Math.log(k)); return parseFloat((b/Math.pow(k,i)).toFixed(1))+' '+s[i]; };
const getPaginationInfo = () => { const from=(page.value-1)*itemsPerPage.value+1; const to=Math.min(page.value*itemsPerPage.value,filteredDeliveries.value.length); return{from,to}; };
const copyTrackingNumber = t => { navigator.clipboard.writeText(t).then(()=>showToastMessage('Copied!','success')); };
const showToastMessage = (msg,color) => { toastMessage.value=msg; toastColor.value=color; showToast.value=true; };

const userData = (() => { try { return JSON.parse(localStorage.getItem('user')||'{}'); } catch { return {}; } })();

// Export
const exportToExcel = () => {
  const data = filteredDeliveries.value.map(d=>({
    'Tracking #':d.tracking_number,'Sender':d.client?.name,'Sender Phone':d.client?.phone,
    'Courier':d.courier?.name,'Route':`${d.departure} → ${d.destination}`,
    'Parcels':d.parcels.length,'Weight':calculateTotalWeight(d.parcels),
    'Date':formatDate(d.delivery_date_time),'Amount':`$${calculateDeliveryAmount(d)}`,
    'Status':getStatusText(d.status),'Payment':d.payment_method==='delivery'?'Pay on Delivery':'Pay on Departure',
  }));
  const ws=XLSX.utils.json_to_sheet(data); const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Deliveries');
  XLSX.writeFile(wb,`Deliveries_${new Date().toISOString().split('T')[0]}.xlsx`);
  showToastMessage('Exported to Excel','success');
};

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18); doc.text('Delivery Report',14,22);
  doc.setFontSize(11); doc.text(`Generated: ${new Date().toLocaleDateString()}`,14,30);
  doc.autoTable({
    head:[['Tracking #','Sender','Courier','Route','Parcels','Date','Amount','Status']],
    body:filteredDeliveries.value.map(d=>[d.tracking_number,d.client?.name,d.courier?.name,`${d.departure}→${d.destination}`,d.parcels.length,formatDate(d.delivery_date_time),`$${calculateDeliveryAmount(d)}`,getStatusText(d.status)]),
    startY:36,theme:'striped',headStyles:{fillColor:[var_primary_rgb()]}
  });
  doc.save(`Deliveries_${new Date().toISOString().split('T')[0]}.pdf`);
  showToastMessage('Exported to PDF','success');
};
const var_primary_rgb = () => [66,133,244];
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  if (typeof num !== 'number') num = Number(num) || 0
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
// ═══════════════════════════════════════════════
// RECEIPT — 58mm thermal paper (219px @ 96dpi)
// ═══════════════════════════════════════════════
const printReceipt = (delivery) => {
  if (!delivery) delivery = selectedDelivery.value;
  if (!delivery) return;

  const parcelsRows = delivery.parcels.map((p, i) => `
    <div class="r-parcel">
      <div class="r-parcel-title">${i+1}. ${p.description}</div>
      <div class="r-row r-row--indent">Weight<span class="r-v">${p.weight} kg</span></div>
      ${p.value ? `<div class="r-row r-row--indent"><span class="r-k">Value</span><span class="r-v">$${formatNumber(p.value)}</span></div>` : ''}
    </div>
  `).join('');

  // 58mm fits ~32 bars comfortably
  const barsHTML = Array.from({length:32},(_,n)=>`<div class="r-bar" style="height:${8+((n*11+n*n*5)%14)}px"></div>`).join('');

  const statusMap = {pending:'rcpt-st--pending',in_transit:'rcpt-st--transit',delivered:'rcpt-st--delivered',cancelled:'rcpt-st--cancelled',accepted:'rcpt-st--accepted'};
  const statusClass = statusMap[delivery.status]||'';

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Receipt ${delivery.tracking_number}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#b0b0b0;display:flex;flex-direction:column;align-items:center;padding:16px;font-family:'Courier New',monospace}

    /* ── 58mm stage: 219px wide (58mm × 96dpi / 25.4) ── */
    .r-stage{width:219px}

    /* Torn top edge */
    .r-torn-top{
      width:219px;height:11px;background:#fdfcf8;
      clip-path:polygon(
        0% 100%,2.3% 15%,4.6% 100%,6.8% 15%,9.1% 100%,11.4% 15%,13.7% 100%,
        16% 15%,18.3% 100%,20.5% 15%,22.8% 100%,25.1% 15%,27.4% 100%,
        29.7% 15%,32% 100%,34.2% 15%,36.5% 100%,38.8% 15%,41.1% 100%,
        43.4% 15%,45.7% 100%,47.9% 15%,50.2% 100%,52.5% 15%,54.8% 100%,
        57.1% 15%,59.4% 100%,61.6% 15%,63.9% 100%,66.2% 15%,68.5% 100%,
        70.8% 15%,73.1% 100%,75.3% 15%,77.6% 100%,79.9% 15%,82.2% 100%,
        84.5% 15%,86.8% 100%,89% 15%,91.3% 100%,93.6% 15%,95.9% 100%,
        98.2% 15%,100% 100%,100% 100%,0% 100%
      );
    }

    /* Receipt body */
    .r-body{
      width:219px;background:#fdfcf8;
      padding:3px 10px 16px;
      font-size:9.5px;color:#1a1a1a;line-height:1.35;
      background-image:repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(0,0,0,.011) 20px,rgba(0,0,0,.011) 21px);
      border-left:1px solid rgba(0,0,0,.08);border-right:1px solid rgba(0,0,0,.08);
    }

    /* Tear-off tail */
    .r-tail{
      width:219px;height:16px;background:#d4d4d4;
      clip-path:polygon(
        0 0,3.2% 52%,6.4% 0,9.6% 52%,12.8% 0,16% 52%,19.2% 0,22.4% 52%,
        25.6% 0,28.8% 52%,32% 0,35.2% 52%,38.4% 0,41.6% 52%,44.8% 0,
        48% 52%,51.2% 0,54.4% 52%,57.6% 0,60.8% 52%,64% 0,67.2% 52%,
        70.4% 0,73.6% 52%,76.8% 0,80% 52%,83.2% 0,86.4% 52%,89.6% 0,
        92.8% 52%,96% 0,99.2% 52%,100% 0,100% 100%,0 100%
      );
      box-shadow:0 5px 16px rgba(0,0,0,.22);
    }

    /* Header */
    .r-header{text-align:center;padding:9px 0 7px}
    .r-logo{font-size:18px;margin-bottom:3px}
    .r-biz{font-size:11px;font-weight:900;letter-spacing:2.5px;color:#0d0d0d}
    .r-tagline{font-size:7.5px;letter-spacing:1.2px;color:#666;margin-top:2px}
    .r-contact{font-size:7.5px;color:#777;margin-top:3px;line-height:1.45}

    /* Separators */
    .r-sep{margin:5px 0}
    .r-sep--dash{border-top:1px dashed #aaa}
    .r-sep--solid{border-top:1.5px solid #222}

    /* Tracking block */
    .r-center{text-align:center;padding:3px 0}
    .r-trk-lbl{font-size:7.5px;letter-spacing:1.6px;color:#666}
    .r-trk-num{font-size:10.5px;font-weight:900;letter-spacing:.8px;margin:2px 0;word-break:break-all}
    .r-status{display:inline-block;font-size:8.5px;font-weight:700;letter-spacing:.8px;padding:2px 8px;border-radius:2px;margin-top:3px}
    .rcpt-st--pending  {background:#fff3dc;color:#c47f00;border:1px solid #f0c050}
    .rcpt-st--transit  {background:#dff5fa;color:#0088aa;border:1px solid #90dff0}
    .rcpt-st--delivered{background:#dff7ec;color:#007040;border:1px solid #80d9b0}
    .rcpt-st--cancelled{background:#fdeaea;color:#aa2020;border:1px solid #f0a0a0}
    .rcpt-st--accepted {background:#e8eeff;color:#3355cc;border:1px solid #aabbff}

    /* Section labels */
    .r-section{font-size:7.5px;font-weight:700;letter-spacing:1.8px;color:#555;text-align:center;margin:5px 0 3px}

    /* Data rows */
    .r-row{display:flex;justify-content:space-between;gap:4px;margin-bottom:2px;font-size:9px}
    .r-row--indent{padding-left:8px}
    .r-row--bold{font-weight:700;font-size:9.5px;margin-top:3px}
    .r-k{color:#555;flex-shrink:0;white-space:nowrap;max-width:45%}
    .r-v{text-align:right;word-break:break-word;font-weight:500}

    /* Parcels */
    .r-parcel{margin-bottom:5px}
    .r-parcel-title{font-weight:700;font-size:9px;margin-bottom:1px}

    /* Total */
    .r-total{display:flex;justify-content:space-between;align-items:baseline;font-size:11.5px;font-weight:900;padding:3px 0}
    .r-total-amt{font-size:12.5px}

    /* Instructions */
    .r-instr{font-size:8.5px;color:#444;line-height:1.38;text-align:center;padding:1px 2px}

    /* Signature */
    .r-sig{margin-top:12px;border-top:1px solid #bbb;padding-top:4px;text-align:center;font-size:8px;color:#666}
    .r-sig-line{margin-bottom:28px}

    /* Footer */
    .r-footer{text-align:center;padding-top:6px}
    .r-footer-thanks{font-size:9px;font-weight:700;margin-bottom:2px}
    .r-footer-date{font-size:7.5px;color:#888;margin-bottom:1px}
    .r-footer-email{font-size:8px;color:#666;margin-bottom:10px}
    .r-barcode{display:flex;align-items:flex-end;justify-content:center;gap:1px;height:28px;margin-bottom:3px}
    .r-bar{width:1.5px;background:#111;border-radius:.5px}
    .r-barcode-num{font-size:7.5px;letter-spacing:1.8px;color:#555;word-break:break-all}

    /* Print overrides */
    @media print{
      @page{size:58mm auto;margin:0}
      body{background:none;padding:0}
      .r-stage{margin:0}
      .r-torn-top,.r-tail{display:none}
      .r-body{border:none;background-image:none;padding-top:2mm}
    }
  </style></head><body>
  <div class="r-stage">
    <div class="r-torn-top"></div>
    <div class="r-body">

      <div class="r-header">
        <div class="r-logo">📦</div>
        <div class="r-biz">${userData?.business || 'DELIVERY TRACK'}</div>
        <div class="r-tagline">${userData?.website || 'Fast · Reliable · Secure'}</div>
        <div class="r-contact">
          ${userData?.location ? `📍 ${userData.location}` : ''}
          ${userData?.contact ? `<br>📞 ${userData.contact}` : ''}
          ${userData?.email   ? `<br>✉️ ${userData.email}`   : ''}
        </div>
      </div>

      <div class="r-sep r-sep--solid"></div>

      <div class="r-center">
        <div class="r-trk-lbl">DELIVERY RECEIPT</div>
        <div class="r-trk-num">${delivery.tracking_number}</div>
        <div class="r-status ${statusClass}">● ${getStatusText(delivery.status).toUpperCase()}</div>
      </div>

      <div class="r-sep r-sep--dash"></div>

      <div class="r-section">── ROUTE ──</div>
      <div class="r-row"><span class="r-k">From</span><span class="r-v">${delivery.departure}</span></div>
      <div class="r-row"><span class="r-k">To</span><span class="r-v">${delivery.destination}</span></div>
      <div class="r-row"><span class="r-k">Date</span><span class="r-v">${formatDateTime(delivery.delivery_date_time)}</span></div>

      <div class="r-sep r-sep--dash"></div>

      <div class="r-section">── SENDER ──</div>
      <div class="r-row"><span class="r-k">Name</span><span class="r-v">${delivery.client?.name||'N/A'}</span></div>
      <div class="r-row"><span class="r-k">Phone</span><span class="r-v">${delivery.client?.phone||'N/A'}</span></div>
      ${delivery.client?.email ? `<div class="r-row"><span class="r-k">Email</span><span class="r-v">${delivery.client.email}</span></div>` : ''}

      <div class="r-sep r-sep--dash"></div>

      <div class="r-section">── RECIPIENT ──</div>
      <div class="r-row"><span class="r-k">Name</span><span class="r-v">${delivery.recipient_name||'N/A'}</span></div>
      <div class="r-row"><span class="r-k">Phone</span><span class="r-v">${delivery.recipient_phone||'N/A'}</span></div>
      <div class="r-sep r-sep--dash"></div>

      <div class="r-section">── COURIER ──</div>
      <div class="r-row"><span class="r-k">Name</span><span class="r-v">${delivery.courier?.name||'N/A'}</span></div>
      <div class="r-row"><span class="r-k">Phone</span><span class="r-v">${delivery.courier?.phone||'N/A'}</span></div>
      <div class="r-row"><span class="r-k">Vehicle</span><span class="r-v">${delivery.courier?.vehicle_no||'N/A'}</span></div>

      <div class="r-sep r-sep--dash"></div>

      <div class="r-section">── PARCELS ──</div>
      ${parcelsRows}
      <div class="r-row r-row--bold"><span>PARCELS</span><span>${delivery.parcels.length}</span></div>
      <div class="r-row r-row--bold"><span>TOTAL WT</span><span>${calculateTotalWeight(delivery.parcels)} kg</span></div>
      <div class="r-row r-row--bold"><span>TOTAL VALUE</span><span>$${calculateTotalValue(delivery.parcels)}</span></div>

      <div class="r-sep r-sep--dash"></div>

      <div class="r-section">── PAYMENT ──</div>
      <div class="r-row"><span class="r-k">Method</span><span class="r-v">${delivery.payment_method==='delivery'?'On Delivery':'On Departure'}</span></div>
      <div class="r-row"><span class="r-k">Rate/kg</span><span class="r-v">$${delivery.pricerate?.charge||'0.00'}</span></div>
      <div class="r-row"><span class="r-k">Weight</span><span class="r-v">${calculateTotalWeight(delivery.parcels)} kg</span></div>

      <div class="r-section">── PAYMENT STATUS ──</div>
      <div class="r-row"><span class="r-k">Status</span><span class="r-v">${delivery.payStatus=='paid'?'Paid':'Pending'}</span></div>
      <div class="r-row"><span class="r-k">Date</span><span class="r-v">${delivery.payDate ||'--/--/--'}</span></div>
      <div class="r-row"><span class="r-k">Mode</span><span class="r-v">${delivery.paymentMode || 'N/A'}</span></div>
      <div class="r-row"><span class="r-k">Notes</span><span class="r-v">${delivery.paymentNotes || ''}</span></div>

      <div class="r-sep r-sep--solid"></div>
      <div class="r-total"><span>TOTAL</span><span class="r-total-amt">$${calculateDeliveryAmount(delivery)}</span></div>
      <div class="r-sep r-sep--solid"></div>

      ${delivery.instructions ? `
        <div class="r-section">── INSTRUCTIONS ──</div>
        <div class="r-instr">${delivery.instructions}</div>
        <div class="r-sep r-sep--dash"></div>
      ` : ''}

      <div class="r-sig">
        <div class="r-sig-line"></div>
        ___________________
        <div style="margin-top:3px">Recipient Signature</div>
      </div>

      <div class="r-footer">
        <div class="r-footer-thanks">★ Thank you! ★</div>
        <div class="r-footer-date">Printed: ${new Date().toLocaleString()}</div>
        <div class="r-footer-email">${userData?.email||''}</div>
        <div class="r-barcode">${barsHTML}</div>
        <div class="r-barcode-num">${delivery.tracking_number}</div>
      </div>

    </div>
    <div class="r-tail"></div>
  </div>
  <script>setTimeout(()=>{window.print();},400)<\/script>
  </body></html>`;

  const w = window.open('','_blank','width=320,height=900');
  w.document.write(html);
  w.document.close();
};

onMounted(async () => {
  loading.value = true;
  try { await deliveriesStore.fetchDeliveries(); }
  catch { showToastMessage('Error loading deliveries','error'); }
  finally { loading.value = false; }
});

watch([searchQuery, statusFilter, courierFilter, dateRange], () => { page.value = 1; });
</script>

<style scoped>
/* ═══════ ROOT ═══════ */
.dm-root {
  padding: 18px;
  background: #f2f4f8;
  font-family: 'DM Sans','Segoe UI',sans-serif;
  min-block-size: 100vh;
}

/* ═══════ HEADER ═══════ */
.dm-header {
  border-radius: 18px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.85) 100%);
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.2);
  margin-block-end: 14px;
  padding-block: 20px;
  padding-inline: 24px;
}
.dm-header-inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; }
.dm-brand { display: flex; align-items: center; gap: 13px; }
.dm-brand-icon { display: flex; align-items: center; justify-content: center; border-radius: 12px; backdrop-filter: blur(6px); background: rgba(255,255,255,18%); block-size: 44px; inline-size: 44px; }
.dm-brand-title { color: white; font-size: 18px; font-weight: 700; }
.dm-brand-sub   { color: rgba(255,255,255,72%); font-size: 12px; margin-block-start: 2px; }
.dm-header-chips { display: flex; flex-wrap: wrap; gap: 8px; }

.dm-stat-chip {
  display: flex; align-items: center; border-radius: 20px;
  backdrop-filter: blur(4px);
  background: rgba(255,255,255,15%); color: white; font-size: 12px; font-weight: 500; gap: 5px;
  padding-block: 5px;
  padding-inline: 12px;
}
.dm-chip-val   { font-weight: 700; }
.dm-chip-label { opacity: 0.85; }
.dm-chip--warning { background: rgba(255,159,67,25%); }
.dm-chip--info    { background: rgba(0,207,232,25%); }
.dm-chip--success { background: rgba(40,199,111,25%); }
.dm-chip--neutral { background: rgba(255,255,255,12%); }

/* ═══════ QUICK STATS ═══════ */
.dm-stats-row {
  display: grid; gap: 12px; grid-template-columns: repeat(4,1fr); margin-block-end: 14px;
}

@media(max-width:900px){ .dm-stats-row { grid-template-columns: repeat(2,1fr); } }

@media(max-width:480px){ .dm-stats-row { grid-template-columns: 1fr; } }

.dm-stat-card {
  display: flex; align-items: center;
  border: 1px solid rgba(0,0,0,5.5%); border-radius: 14px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,4%); gap: 14px; padding-block: 16px; padding-inline: 18px;
  transition: transform .18s, box-shadow .18s;
}
.dm-stat-card:hover { box-shadow: 0 6px 18px rgba(0,0,0,8%); transform: translateY(-2px); }
.dm-stat-icon { display: flex; flex-shrink: 0; align-items: center; justify-content: center; border-radius: 12px; block-size: 46px; inline-size: 46px; }
.dm-qs--primary .dm-stat-icon { background: rgba(var(--v-theme-primary),.1); color: rgb(var(--v-theme-primary)); }
.dm-qs--success .dm-stat-icon { background: rgba(var(--v-theme-success),.1); color: rgb(var(--v-theme-success)); }
.dm-qs--info    .dm-stat-icon { background: rgba(var(--v-theme-info),.1);    color: rgb(var(--v-theme-info));    }
.dm-stat-val { color: rgba(var(--v-theme-on-surface),.9); font-size: 20px; font-weight: 700; line-height: 1.1; }
.dm-stat-lbl { color: rgba(var(--v-theme-on-surface),.5); font-size: 11.5px; letter-spacing: .4px; margin-block-start: 3px; text-transform: uppercase; }

/* ═══════ FILTER BAR ═══════ */
.dm-filter-bar {
  display: flex;
  flex-wrap: wrap; align-items: center; justify-content: space-between;
  border: 1px solid rgba(0,0,0,5.5%); border-radius: 14px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,3%); gap: 12px; margin-block-end: 14px; padding-block: 14px; padding-inline: 18px;
}
.dm-filter-left  { display: flex; flex: 1; flex-wrap: wrap; align-items: center; gap: 10px; }
.dm-filter-right { display: flex; align-items: center; gap: 8px; }

.dm-search-wrap {
  display: flex; align-items: center;
  border: 1px solid rgba(0,0,0,7%); border-radius: 10px;
  background: #f4f6fa; block-size: 38px; gap: 8px; min-inline-size: 240px;
  padding-block: 0;
  padding-inline: 12px;
  transition: border-color .15s;
}
.dm-search-wrap:focus-within { border-color: rgba(var(--v-theme-primary),.4); background: white; }
.dm-search-icon { flex-shrink: 0; color: rgba(var(--v-theme-on-surface),.4); }
.dm-search-input { flex: 1; border: none; background: transparent; color: rgba(var(--v-theme-on-surface),.88); font-family: inherit; font-size: 13.5px; outline: none; }
.dm-search-input::placeholder { color: rgba(var(--v-theme-on-surface),.36); }
.dm-search-clear { display: flex; padding: 2px; border: none; background: none; color: rgba(var(--v-theme-on-surface),.4); cursor: pointer; }
.dm-filter-select :deep(.v-field) { border-radius: 10px; }
.dm-btn { border-radius: 9px !important; font-weight: 600 !important; text-transform: none !important; }

/* ═══════ TABLE ═══════ */
.dm-table-wrap {
  overflow: hidden;
  border: 1px solid rgba(0,0,0,5.5%); border-radius: 16px;
  background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,4%);
}

.dm-table :deep(.v-data-table__th) {
  background: #f8fafc !important;
  border-block-end: 1px solid rgba(0,0,0,7%) !important;
  color: rgba(var(--v-theme-on-surface),.55) !important; font-size: 11.5px !important;
  font-weight: 700 !important; letter-spacing: .5px;
  text-transform: uppercase;
  white-space: nowrap;
}
.dm-table :deep(.v-data-table__tr:hover > td) { background: rgba(var(--v-theme-primary),.025) !important; }
.dm-table :deep(td) { border-block-end: 1px solid rgba(0,0,0,4%) !important; font-size: 13.5px; padding-block: 10px !important; padding-inline: 16px !important; vertical-align: middle; }

/* Tracking chip */
.dm-tracking-chip {
  display: inline-flex; align-items: center;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary),.08);
  color: rgb(var(--v-theme-primary));
  cursor: pointer;
  font-family: 'Courier New',monospace;
  font-size: 12.5px; font-weight: 700; gap: 5px; padding-block: 4px; padding-inline: 10px; transition: all .15s;
  white-space: nowrap;
}
.dm-tracking-chip:hover { background: rgba(var(--v-theme-primary),.15); }
.dm-copy-icon { opacity: 0; transition: opacity .15s; }
.dm-tracking-chip:hover .dm-copy-icon { opacity: 1; }

/* Person cell */
.dm-person-cell { display: flex; align-items: center; gap: 10px; }
.dm-avatar { display: flex; flex-shrink: 0; align-items: center; justify-content: center; border-radius: 9px; background: rgba(var(--v-theme-primary),.12); block-size: 32px; color: rgb(var(--v-theme-primary)); font-size: 11px; font-weight: 700; inline-size: 32px; }
.dm-courier-avatar { flex-shrink: 0; border-radius: 9px !important; }
.dm-person-name { color: rgba(var(--v-theme-on-surface),.88); font-size: 13px; font-weight: 600; white-space: nowrap; }
.dm-person-sub  { color: rgba(var(--v-theme-on-surface),.48); font-size: 11.5px; margin-block-start: 1px; }

/* Route cell */
.dm-route-cell { display: flex; align-items: center; gap: 6px; }
.dm-route-from,.dm-route-to { overflow: hidden; color: rgba(var(--v-theme-on-surface),.82); font-size: 12.5px; font-weight: 500; max-inline-size: 70px; text-overflow: ellipsis; white-space: nowrap; }
.dm-route-arrow { display: flex; flex-shrink: 0; align-items: center; gap: 3px; }
.dm-route-line  { background: rgba(var(--v-theme-primary),.3); block-size: 1px; inline-size: 16px; }
.dm-route-rate  { color: rgba(var(--v-theme-on-surface),.42); font-size: 11px; margin-block-start: 3px; }

/* Parcel cell */
.dm-parcel-cell { display: flex; align-items: center; gap: 5px; }
.dm-parcel-count { color: rgb(var(--v-theme-info)); font-size: 15px; font-weight: 700; }
.dm-parcel-lbl   { color: rgba(var(--v-theme-on-surface),.5); font-size: 12px; }
.dm-parcel-weight { color: rgba(var(--v-theme-on-surface),.45); font-size: 11.5px; margin-block-start: 2px; }

/* Date/time cell */
.dm-date-val { color: rgba(var(--v-theme-on-surface),.82); font-size: 12.5px; font-weight: 500; }
.dm-time-val { color: rgba(var(--v-theme-on-surface),.45); font-size: 11.5px; margin-block-start: 2px; }

/* Amount */
.dm-amount { color: rgb(var(--v-theme-success)); font-size: 14px; font-weight: 700; }

/* Status badge */
.dm-status-badge {
  display: inline-flex; align-items: center; border-radius: 20px;
  font-size: 11.5px; font-weight: 600; gap: 5px;
  padding-block: 4px;
  padding-inline: 10px; white-space: nowrap;
}
.dm-status--pending    { background: rgba(255,159,67,12%); color:#c47f00; }
.dm-status--accepted   { background: rgba(0,207,232,12%);  color:#008faa; }
.dm-status--in_transit { background: rgba(var(--v-theme-primary),.1); color:rgb(var(--v-theme-primary)); }
.dm-status--delivered  { background: rgba(40,199,111,12%); color:#147048; }
.dm-status--cancelled  { background: rgba(234,84,85,12%);  color:#b52020; }

/* Payment badge */
.dm-payment-badge {align-items: center;
  justify-content: center; border-radius: 16px;
  font-size: 11px; font-weight: 600; gap: 5px;
  padding-block: 4px;
  padding-inline: 8px;
}
.dm-payment--paid { background: rgba(40,199,111,12%); color: #147048; }
.dm-payment--pending { background: rgba(255,159,67,12%); color: #c47f00; }
.dm-payment--overdue { background: rgba(234,84,85,12%); color: #b52020; }
.dm-payment--partial { background: rgba(0,207,232,12%); color: #008faa; }

.dm-payment-date {
  font-size: 9px; margin-inline-start: 4px; opacity: 0.7;
}

/* Actions */
.dm-actions { display: flex; gap: 6px; }

.dm-action-btn {
  display: flex; align-items: center; justify-content: center; border: none; border-radius: 8px; block-size: 30px; cursor: pointer;
  inline-size: 30px;
  transition: transform .15s, box-shadow .15s;
}
.dm-action-btn:hover { box-shadow: 0 4px 10px rgba(0,0,0,10%); transform: translateY(-2px); }
.dm-action-btn--view  { background: rgba(var(--v-theme-info),.1); color: rgb(var(--v-theme-info)); }
.dm-action-btn--print { background: rgba(var(--v-theme-primary),.1); color: rgb(var(--v-theme-primary)); }
.dm-action-btn--pay { background: rgba(var(--v-theme-success),.1); color: rgb(var(--v-theme-success)); }

/* Footer */
.dm-table-footer {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  background: #f8fafc; border-block-start: 1px solid rgba(0,0,0,6%); gap: 10px;
  padding-block: 12px;
  padding-inline: 16px;
}
.dm-footer-info { color: rgba(var(--v-theme-on-surface),.55); font-size: 13px; }
.dm-footer-filter { color: rgba(var(--v-theme-primary),.7); }
.dm-footer-right { display: flex; align-items: center; gap: 14px; }
.dm-ipp { display: flex; align-items: center; color: rgba(var(--v-theme-on-surface),.5); font-size: 12.5px; gap: 8px; }

/* Empty */
.dm-empty { padding-block: 64px; padding-inline: 20px; text-align: center; }
.dm-empty-icon { margin-block-end: 16px; opacity: .8; }
.dm-empty-title { color: rgba(var(--v-theme-on-surface),.75); font-size: 18px; font-weight: 700; margin-block-end: 8px; }
.dm-empty-sub   { color: rgba(var(--v-theme-on-surface),.46); font-size: 13.5px; margin-block: 0; margin-inline: auto; max-inline-size: 340px; }

/* Delete Dialog */
.dm-delete-dialog { overflow: hidden; border-radius: 18px !important; }
.dm-delete-top { padding: 32px; background: linear-gradient(135deg,rgba(var(--v-theme-error),.05),rgba(var(--v-theme-error),.02)); border-block-end: 1px solid rgba(0,0,0,6%); text-align: center; }
.dm-delete-icon-wrap { display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(var(--v-theme-error),.1); block-size: 64px; inline-size: 64px; margin-block: 0 14px; margin-inline: auto; }
.dm-delete-title { font-size: 18px; font-weight: 700; margin-block-end: 8px; }
.dm-delete-sub   { color: rgba(var(--v-theme-on-surface),.6); font-size: 13.5px; line-height: 1.5; }
.dm-delete-actions { display: flex; border-block-start: 1px solid rgba(0,0,0,6%); gap: 10px; padding-block: 16px; padding-inline: 24px; }
.dm-delete-actions .v-btn { flex: 1; border-radius: 10px !important; block-size: 44px !important; font-weight: 600 !important; text-transform: none !important; }

/* Scrollbar */
::-webkit-scrollbar { block-size: 6px; inline-size: 6px; }
::-webkit-scrollbar-track { border-radius: 4px; background: rgba(0,0,0,4%); }
::-webkit-scrollbar-thumb { border-radius: 4px; background: rgba(var(--v-theme-primary),.25); }
::-webkit-scrollbar-thumb:hover { background: rgba(var(--v-theme-primary),.4); }

/* Animations */
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
.dm-header,.dm-stats-row,.dm-filter-bar,.dm-table-wrap { animation: fadeUp .28s ease-out; }

/* Responsive */
@media(max-width:760px) {
  .dm-root { padding: 10px; }
  .dm-header-inner { flex-direction: column; align-items: flex-start; }
  .dm-filter-bar { flex-direction: column; align-items: stretch; }
  .dm-filter-left,.dm-filter-right { inline-size: 100%; }
  .dm-search-wrap { inline-size: 100%; min-inline-size: unset; }
}
</style>
