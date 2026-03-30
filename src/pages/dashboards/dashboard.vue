<template>
  <div>
    <div class="dashboard-container">
      
      <!-- Modern Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-left">
            <div class="header-icon-wrapper">
              <VIcon icon="tabler-truck-delivery" size="32" color="primary" />
            </div>
            <div>
              <h1 class="header-title">Delivery & Payment Analytics</h1>
              <p class="header-subtitle">Comprehensive insights into your delivery performance and payments</p>
            </div>
          </div>
          
          <div class="header-actions">
            <div class="filter-group">
              <AppDateTimePicker
                v-model="dateRange"
                placeholder="Select date range"
                :config="{ 
                  mode: 'range',
                  dateFormat: 'Y-m-d',
                  altInput: true,
                  altFormat: 'M j, Y'
                }"
                variant="outlined"
                density="compact"
                prepend-inner-icon="tabler-calendar"
                class="date-picker"
                style="min-width: 200px;"
              />
              
              <VSelect
                v-model="statusFilter"
                :items="deliveryStatuses"
                label="Status"
                variant="outlined"
                density="compact"
                item-title="text"
                item-value="value"
                hide-details
                prepend-inner-icon="tabler-filter"
                class="status-filter"
                clearable
              />
              
              <VBtn
                variant="tonal"
                color="secondary"
                size="small"
                @click="resetFilters"
                class="reset-btn"
                icon="tabler-refresh"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid - Enhanced with Payment Stats -->
      <div class="stats-grid">
        <div 
          v-for="(stat, idx) in statsCards" 
          :key="idx"
          class="stat-card-wrapper"
          :style="{ '--delay': idx * 0.1 + 's' }"
        >
          <VCard class="stat-card" elevation="0">
            <div class="stat-card-content">
              <div class="stat-icon-wrapper" :class="`stat-${stat.color}`">
                <VIcon :icon="stat.icon" size="24" />
              </div>
              
              <div class="stat-info">
                <div class="stat-value">
                  <span class="currency" v-if="stat.isCurrency">$</span>
                  {{ formatCompactNumber(stat.value) }}
                  <span class="stat-unit" v-if="stat.unit">{{ stat.unit }}</span>
                </div>
                <div class="stat-label">{{ stat.title }}</div>
              </div>
              
              <VChip 
                v-if="stat.trend" 
                :color="stat.trend >= 0 ? 'success' : 'error'" 
                size="x-small"
                class="stat-trend"
              >
                <VIcon :icon="stat.trend >= 0 ? 'tabler-trending-up' : 'tabler-trending-down'" size="12" />
                {{ Math.abs(stat.trend) }}%
              </VChip>
            </div>
            
            <div class="stat-progress">
              <div class="progress-bar" :style="{ width: stat.progress + '%' }"></div>
            </div>
          </VCard>
        </div>
      </div>

      <!-- Payment Analytics Cards -->
      <div class="payment-stats-grid">
        <!-- Payment Status Distribution -->
        <VCard class="payment-card" elevation="0">
          <div class="card-header">
            <div class="card-title-section">
              <VIcon icon="tabler-credit-card" color="success" size="24" />
              <h3>Payment Status</h3>
            </div>
            <VChip size="small" color="primary" variant="tonal">
              {{ formatCompactNumber(paymentStats.collection_rate) }}% Collected
            </VChip>
          </div>
          
          <div class="payment-status-content">
            <div class="payment-chart-container">
              <VueApexCharts 
                :options="paymentStatusChartOptions" 
                :series="paymentStatusChartSeries" 
                type="donut" 
                height="160"
              />
            </div>
            
            <div class="payment-legend">
              <div v-for="(status, idx) in paymentStatusItems" :key="idx" class="legend-item">
                <div class="legend-color" :style="{ backgroundColor: status.color }"></div>
                <div class="legend-label">{{ status.label }}</div>
                <div class="legend-value">{{ status.value }}</div>
                <div class="legend-percentage">{{ status.percentage }}%</div>
              </div>
            </div>
          </div>
          
          <div class="payment-summary">
            <div class="summary-item">
              <span class="summary-label">Collected</span>
              <span class="summary-value success">${{ formatNumber(paymentStats.collected_revenue) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Pending</span>
              <span class="summary-value warning">${{ formatNumber(paymentStats.pending_revenue) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Avg. Payment Time</span>
              <span class="summary-value">{{ paymentStats.avg_payment_time_hours }} hrs</span>
            </div>
          </div>
        </VCard>

        <!-- Payment Methods Distribution -->
        <VCard class="payment-card" elevation="0">
          <div class="card-header">
            <div class="card-title-section">
              <VIcon icon="tabler-chart-pie" color="info" size="24" />
              <h3>Payment Methods</h3>
            </div>
          </div>
          
          <div class="payment-methods-content">
            <div v-for="(method, index) in paymentMethodItems" :key="index" class="method-item">
              <div class="method-info">
                <div class="method-name">
                  <VIcon :icon="getPaymentMethodIcon(method.name)" size="16" class="method-icon" />
                  {{ formatMethodName(method.name) }}
                </div>
                <div class="method-stats">
                  <span class="method-count">{{ method.count }} transactions</span>
                  <span class="method-total">${{ formatNumber(method.total) }}</span>
                </div>
              </div>
              <div class="method-progress">
                <div class="method-progress-bar" :style="{ width: method.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </VCard>

        <!-- Daily Payment Trend -->
        <VCard class="payment-card" elevation="0">
          <div class="card-header">
            <div class="card-title-section">
              <VIcon icon="tabler-chart-line" color="warning" size="24" />
              <h3>Daily Collections</h3>
            </div>
            <VChip size="small" color="success" variant="tonal">
              Today: ${{ formatNumber(paymentSummary.today) }}
            </VChip>
          </div>
          
          <div class="daily-payment-content">
            <VueApexCharts 
              :options="dailyPaymentChartOptions" 
              :series="dailyPaymentChartSeries" 
              type="bar" 
              height="120"
            />
          </div>
          
          <div class="payment-summary-grid">
            <div class="summary-grid-item">
              <span class="grid-label">This Week</span>
              <span class="grid-value">${{ formatNumber(paymentSummary.this_week) }}</span>
            </div>
            <div class="summary-grid-item">
              <span class="grid-label">This Month</span>
              <span class="grid-value">${{ formatNumber(paymentSummary.this_month) }}</span>
            </div>
            <div class="summary-grid-item">
              <span class="grid-label">Pending</span>
              <span class="grid-value warning">{{ paymentSummary.pending_count }}</span>
            </div>
            <div class="summary-grid-item">
              <span class="grid-label">Overdue</span>
              <span class="grid-value error">{{ paymentSummary.overdue_count }}</span>
            </div>
          </div>
        </VCard>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Revenue & Growth Section -->
        <VCard class="content-card revenue-card" elevation="0">
          <div class="card-header">
            <div class="card-title-section">
              <VIcon icon="tabler-chart-line" color="success" size="24" />
              <h3>Revenue Overview</h3>
            </div>
            <VChip size="small" :color="revenueSummary.growth >= 0 ? 'success' : 'error'" variant="tonal">
              {{ revenueSummary.growth >= 0 ? '+' : '' }}{{ revenueSummary.growth }}%
            </VChip>
          </div>
          
          <div class="revenue-content">
            <div class="revenue-comparison">
              <div class="revenue-item current">
                <div class="revenue-label">This Month</div>
                <div class="revenue-value">${{ formatNumber(revenueSummary.current_month) }}</div>
              </div>
              <div class="revenue-divider"></div>
              <div class="revenue-item previous">
                <div class="revenue-label">Last Month</div>
                <div class="revenue-value">${{ formatNumber(revenueSummary.last_month) }}</div>
              </div>
              <div class="revenue-divider"></div>
              <div class="revenue-item collected">
                <div class="revenue-label">Collected</div>
                <div class="revenue-value success">${{ formatNumber(paymentStats.current_month_collected) }}</div>
              </div>
            </div>
            
            <VueApexCharts 
              :options="revenueChartOptions" 
              :series="revenueChartSeries" 
              type="area" 
              height="160"
              class="revenue-chart"
            />
          </div>
        </VCard>

        <!-- Status Distribution -->
        <VCard class="content-card status-card" elevation="0">
          <div class="card-header">
            <div class="card-title-section">
              <VIcon icon="tabler-chart-donut-3" color="primary" size="24" />
              <h3>Delivery Status</h3>
            </div>
            <div class="total-deliveries">{{ formatNumber(deliveryStats.total) }} Total</div>
          </div>
          
          <div class="status-content">
            <div class="status-chart-container">
              <VueApexCharts 
                :options="statusChartOptions" 
                :series="statusChartSeries" 
                type="donut" 
                height="150"
              />
            </div>
            
            <div class="status-legend">
              <div 
                v-for="(status, idx) in statusItems" 
                :key="idx"
                class="legend-item"
              >
                <div class="legend-color" :style="{ backgroundColor: status.color }"></div>
                <div class="legend-label">{{ status.label }}</div>
                <div class="legend-value">{{ status.value }}</div>
                <div class="legend-percentage">{{ status.percentage }}%</div>
              </div>
            </div>
          </div>
        </VCard>

        <!-- Top Paying Clients -->
        <VCard class="content-card clients-card" elevation="0">
          <div class="card-header">
            <div class="card-title-section">
              <VIcon icon="tabler-crown" color="warning" size="24" />
              <h3>Top Paying Clients</h3>
            </div>
            <VChip size="small" color="success" variant="tonal">
              ${{ formatNumber(paymentStats.collected_revenue) }} Total
            </VChip>
          </div>
          
          <div class="clients-list">
            <div 
              v-for="(client, index) in topPayingClients" 
              :key="client.id"
              class="client-item"
              :class="{ 'top-client': index < 1 }"
            >
              <div class="client-rank">{{ index + 1 }}</div>
              
              <VAvatar 
                size="40" 
                :color="getAvatarColor(index)"
                variant="tonal"
                class="client-avatar"
              >
                {{ getInitials(client.name) }}
              </VAvatar>
              
              <div class="client-info">
                <div class="client-name">{{ client.name }}</div>
                <div class="client-meta">
                  <span class="deliveries-count">
                    <VIcon icon="tabler-package" size="14" />
                    {{ client.paid_deliveries }} paid deliveries
                  </span>
                </div>
              </div>
              
              <div class="client-revenue">
                <div class="revenue-amount">${{ formatNumber(client.total_paid) }}</div>
                <div class="revenue-label">Paid</div>
              </div>
            </div>
            
            <div v-if="!topPayingClients.length" class="empty-state">
              <VIcon icon="tabler-cash-off" size="32" color="disabled" />
              <p>No payment data available</p>
            </div>
          </div>
        </VCard>

        <!-- Courier Payment Performance -->
        <!-- <VCard class="content-card courier-card" elevation="0">
          <div class="card-header">
            <div class="card-title-section">
              <VIcon icon="tabler-truck" color="info" size="24" />
              <h3>Courier Collections</h3>
            </div>
          </div>
          
          <div class="courier-list">
            <div 
              v-for="(courier, index) in courierPerformance" 
              :key="courier.id"
              class="courier-item"
            >
              <VAvatar size="32" class="courier-avatar">
                <VImg 
                  v-if="courier.photo" 
                  :src="`${BASE_URL}/couriers/${courier.photo}`" 
                  cover 
                />
                <VIcon v-else icon="tabler-user" size="16" />
              </VAvatar>
              
              <div class="courier-info">
                <div class="courier-name">{{ courier.name }}</div>
                <div class="courier-meta">{{ courier.paid_deliveries }} payments</div>
              </div>
              
              <div class="courier-collection">
                <span class="collection-amount">${{ formatNumber(courier.total_collected) }}</span>
              </div>
            </div>
            
            <div v-if="!courierPerformance.length" class="empty-state">
              <VIcon icon="tabler-truck-off" size="32" color="disabled" />
              <p>No courier data available</p>
            </div>
          </div>
        </VCard> -->

        <!-- Top Routes -->
        <VCard class="content-card routes-card" elevation="0">
          <div class="card-header">
            <div class="card-title-section">
              <VIcon icon="tabler-route" color="warning" size="24" />
              <h3>Top Routes</h3>
            </div>
          </div>
          
          <div class="routes-content">
            <VueApexCharts 
              :options="routesChartOptions" 
              :series="routesChartSeries" 
              type="bar" 
              height="280"
              class="routes-chart"
            />
          </div>
        </VCard>

        <!-- Weight Summary -->
        <VCard class="content-card weight-card" elevation="0">
          <div class="card-header">
            <div class="card-title-section">
              <VIcon icon="tabler-weight" color="secondary" size="24" />
              <h3>Weight Analysis</h3>
            </div>
          </div>
          
          <div class="weight-content">
            <div class="weight-metric">
              <div class="metric-value">{{ formatNumber(weightSummary.total_weight) }}<span class="metric-unit">kg</span></div>
              <div class="metric-label">Total Weight</div>
            </div>
            
            <div class="weight-metric">
              <div class="metric-value">{{ formatNumber(weightSummary.avg_weight_per_delivery) }}<span class="metric-unit">kg</span></div>
              <div class="metric-label">Avg per Delivery</div>
            </div>
            
            <div class="weight-metric">
              <div class="metric-value">{{ formatNumber(weightSummary.total_parcels) }}</div>
              <div class="metric-label">Total Parcels</div>
            </div>
          </div>
        </VCard>
      </div>

      <!-- Loading Overlay -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring-inner"></div>
          </div>
          <div class="loading-text">Loading Analytics</div>
          <div class="loading-subtext">Please wait while we fetch your data</div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error && !loading" class="error-state">
        <VCard class="error-card" elevation="0">
          <div class="error-content">
            <VIcon icon="tabler-alert-circle" size="48" color="error" />
            <h3>Unable to Load Data</h3>
            <p>{{ error }}</p>
            <VBtn 
              color="primary" 
              variant="tonal"
              @click="fetchDeliveryAnalytics"
              prepend-icon="tabler-refresh"
            >
              Try Again
            </VBtn>
          </div>
        </VCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue"
import axios from "axios"
import VueApexCharts from "vue3-apexcharts"

// ---- Dashboard State ----
const loading = ref(true)
const error = ref(null)
const dateRange = ref("")
const statusFilter = ref("")
const initialLoad = ref(true)
const BASE_URL = (axios.defaults.baseURL || '').replace(/\/api\/?$/, '')

// ---- Delivery Statistics ----
const deliveryStats = ref({
  total: 0,
  pending: 0,
  in_transit: 0,
  delivered: 0,
  cancelled: 0,
  revenue: 0
})

// ---- Payment Statistics ----
const paymentStats = ref({
  status_distribution: {
    paid: 0,
    pending: 0,
    overdue: 0,
    partial: 0
  },
  method_distribution: {},
  method_totals: {},
  collected_revenue: 0,
  pending_revenue: 0,
  collection_rate: 0,
  payment_completion_rate: 0,
  avg_payment_time_hours: 0,
  current_month_collected: 0
})

const paymentSummary = ref({
  today: 0,
  this_week: 0,
  this_month: 0,
  pending_count: 0,
  overdue_count: 0
})

const monthlyPayments = ref([])
const dailyPayments = ref([])
const topPayingClients = ref([])
const courierPerformance = ref([])

const revenueSummary = ref({
  current_month: 0,
  last_month: 0,
  growth: 0
})

const weightSummary = ref({
  total_weight: 0,
  avg_weight_per_delivery: 0,
  total_parcels: 0
})

const topClients = ref([])

// ---- Computed Properties for Stats Cards ----
const safePercent = (num, total) => {
  if (!total || total === 0) return 0
  return Math.min(100, Math.max(0, (num / total) * 100))
}

const statsCards = computed(() => [
  { 
    title: 'Total Deliveries', 
    value: deliveryStats.value.total, 
    color: 'primary', 
    icon: 'tabler-package',
    progress: 100,
    trend: null
  },
  { 
    title: 'In Progress', 
    value: (deliveryStats.value.pending || 0) + (deliveryStats.value.in_transit || 0), 
    color: 'warning', 
    icon: 'tabler-clock',
    progress: ((deliveryStats.value.pending + deliveryStats.value.in_transit) / (deliveryStats.value.total || 1)) * 100 || 0,
    trend: null
  },
  { 
    title: 'Delivered', 
    value: deliveryStats.value.delivered || 0, 
    color: 'success', 
    icon: 'tabler-circle-check',
    progress: safePercent(deliveryStats.value.delivered, deliveryStats.value.total)
  },
  { 
    title: 'Total Revenue', 
    value: deliveryStats.value.revenue || 0, 
    color: 'success', 
    icon: 'tabler-currency-dollar',
    isCurrency: true,
    progress: 100,
    trend: revenueSummary.value.growth
  },
  { 
    title: 'Collected', 
    value: paymentStats.value.collected_revenue || 0, 
    color: 'success', 
    icon: 'tabler-cash',
    isCurrency: true,
    progress: paymentStats.value.collection_rate,
    unit: '%',
    trend: null
  },
  { 
    title: 'Pending Payments', 
    value: paymentStats.value.pending_revenue || 0, 
    color: 'warning', 
    icon: 'tabler-clock-dollar',
    isCurrency: true,
    progress: 100 - paymentStats.value.collection_rate,
    trend: null
  },
  { 
    title: 'Collection Rate', 
    value: paymentStats.value.collection_rate || 0, 
    color: 'info', 
    icon: 'tabler-percentage',
    progress: paymentStats.value.collection_rate,
    unit: '%',
    trend: null
  },
  { 
    title: 'Avg Weight', 
    value: weightSummary.value.avg_weight_per_delivery || 0, 
    color: 'secondary', 
    icon: 'tabler-weight',
    progress: 100,
    unit: 'kg'
  }
])

// ---- Status Items for Delivery Status Chart ----
const statusItems = computed(() => {
  const total = deliveryStats.value.total || 1
  return [
    { label: 'Pending', value: deliveryStats.value.pending || 0, color: '#FF9F43', percentage: ((deliveryStats.value.pending / total) * 100).toFixed(1) },
    { label: 'In Transit', value: deliveryStats.value.in_transit || 0, color: '#00CFE8', percentage: ((deliveryStats.value.in_transit / total) * 100).toFixed(1) },
    { label: 'Delivered', value: deliveryStats.value.delivered || 0, color: '#28C76F', percentage: ((deliveryStats.value.delivered / total) * 100).toFixed(1) },
    { label: 'Cancelled', value: deliveryStats.value.cancelled || 0, color: '#EA5455', percentage: ((deliveryStats.value.cancelled / total) * 100).toFixed(1) }
  ]
})

// ---- Payment Status Items ----
const paymentStatusItems = computed(() => {
  const total = paymentStats.value.collected_revenue + paymentStats.value.pending_revenue || 1
  const paidTotal = paymentStats.value.collected_revenue || 0
  const pendingTotal = paymentStats.value.pending_revenue || 0
  
  return [
    { label: 'Paid', value: paymentStats.value.status_distribution?.paid || 0, color: '#28C76F', percentage: ((paymentStats.value.status_distribution?.paid / (paymentStats.value.status_distribution?.paid + paymentStats.value.status_distribution?.pending || 1)) * 100).toFixed(1) },
    { label: 'Pending', value: paymentStats.value.status_distribution?.pending || 0, color: '#FF9F43', percentage: ((paymentStats.value.status_distribution?.pending / (paymentStats.value.status_distribution?.paid + paymentStats.value.status_distribution?.pending || 1)) * 100).toFixed(1) },
    { label: 'Overdue', value: paymentStats.value.status_distribution?.overdue || 0, color: '#EA5455', percentage: ((paymentStats.value.status_distribution?.overdue / (paymentStats.value.status_distribution?.paid + paymentStats.value.status_distribution?.pending || 1)) * 100).toFixed(1) },
    { label: 'Partial', value: paymentStats.value.status_distribution?.partial || 0, color: '#00CFE8', percentage: ((paymentStats.value.status_distribution?.partial / (paymentStats.value.status_distribution?.paid + paymentStats.value.status_distribution?.pending || 1)) * 100).toFixed(1) }
  ]
})

// ---- Payment Method Items ----
const paymentMethodItems = computed(() => {
  const methods = []
  const methodTotals = paymentStats.value.method_totals || {}
  const totalCollected = paymentStats.value.collected_revenue || 1
  
  Object.entries(paymentStats.value.method_distribution || {}).forEach(([method, count]) => {
    methods.push({
      name: method,
      count: count,
      total: methodTotals[method] || 0,
      percentage: ((methodTotals[method] || 0) / totalCollected) * 100
    })
  })
  
  return methods.sort((a, b) => b.total - a.total)
})

// ---- Charts Configuration ----
const statusChartOptions = ref({
  chart: { 
    type: 'donut',
    height: 200,
    animations: { enabled: true, speed: 800 }
  },
  labels: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
  colors: ['#FF9F43', '#00CFE8', '#28C76F', '#EA5455'],
  legend: { show: false },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            color: '#6B7280',
            fontSize: '14px',
            formatter: function(w) {
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
            }
          }
        }
      }
    }
  },
  dataLabels: { enabled: false },
  stroke: { width: 2 }
})

const statusChartSeries = ref([0, 0, 0, 0])

const paymentStatusChartOptions = ref({
  chart: { 
    type: 'donut',
    height: 160,
    animations: { enabled: true, speed: 800 }
  },
  labels: ['Paid', 'Pending', 'Overdue', 'Partial'],
  colors: ['#28C76F', '#FF9F43', '#EA5455', '#00CFE8'],
  legend: { show: false },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            color: '#6B7280',
            fontSize: '12px',
            formatter: function(w) {
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
            }
          }
        }
      }
    }
  },
  dataLabels: { enabled: false },
  stroke: { width: 2 }
})

const paymentStatusChartSeries = ref([0, 0, 0, 0])

const revenueChartOptions = ref({
  chart: {
    type: 'area',
    height: 160,
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { enabled: true, speed: 800 }
  },
  colors: ['#28C76F'],
  xaxis: {
    categories: [],
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { show: false },
    title: { text: '' }
  },
  stroke: {
    width: 2,
    curve: 'smooth'
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  grid: {
    borderColor: 'transparent',
    padding: { top: -30, bottom: -10, left: -10, right: -10 }
  },
  tooltip: { 
    enabled: true,
    y: {
      formatter: function(value) {
        return '$' + value.toLocaleString()
      }
    }
  },
  dataLabels: { enabled: false }
})

const revenueChartSeries = ref([{
  name: 'Revenue',
  data: []
}])

const dailyPaymentChartOptions = ref({
  chart: {
    type: 'bar',
    height: 120,
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { enabled: true, speed: 800 },
    sparkline: { enabled: true }
  },
  colors: ['#28C76F'],
  plotOptions: {
    bar: {
      columnWidth: '60%',
      borderRadius: 4
    }
  },
  xaxis: {
    categories: [],
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { show: false },
    title: { text: '' }
  },
  grid: { show: false },
  tooltip: { 
    enabled: true,
    y: {
      formatter: function(value) {
        return '$' + value.toLocaleString()
      }
    }
  },
  dataLabels: { enabled: false }
})

const dailyPaymentChartSeries = ref([{
  name: 'Collections',
  data: []
}])

const routesChartOptions = ref({
  chart: {
    type: 'bar',
    height: 280,
    toolbar: { show: false },
    animations: { enabled: true, speed: 800 }
  },
  colors: ['#F24C2E'],
  xaxis: {
    categories: [],
    labels: {
      style: {
        fontSize: '12px',
        fontFamily: 'inherit'
      },
      rotate: -45,
      trim: true,
      maxHeight: 120
    }
  },
  yaxis: {
    title: { text: 'Number of Deliveries' },
    labels: {
      formatter: function(val) {
        return Math.floor(val)
      }
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '60%',
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ["#6B7280"]
    },
    formatter: function(val) {
      return val
    }
  },
  grid: {
    borderColor: 'rgba(0,0,0,0.05)',
    strokeDashArray: 4
  },
  tooltip: {
    y: {
      formatter: function(val) {
        return val + ' deliveries'
      }
    }
  }
})

const routesChartSeries = ref([{
  name: 'Deliveries',
  data: []
}])

// ---- Delivery Statuses ----
const deliveryStatuses = [
  { text: 'All Statuses', value: '' },
  { text: 'Pending', value: 'pending' },
  { text: 'In Transit', value: 'in_transit' },
  { text: 'Delivered', value: 'delivered' },
  { text: 'Cancelled', value: 'cancelled' }
]

// ---- Data Fetching ----
const fetchDeliveryAnalytics = async () => {
  if (loading.value && !initialLoad.value) return
  
  try {
    loading.value = true
    error.value = null
    
    // Build query parameters
    const params = new URLSearchParams()
    
    if (dateRange.value && typeof dateRange.value === 'string') {
      const parts = dateRange.value.split(' to ')
      if (parts.length === 2) {
        params.append('start_date', parts[0].trim())
        params.append('end_date', parts[1].trim())
      }
    }
    
    if (statusFilter.value) {
      params.append('status', statusFilter.value)
    }
    
    params.append('_t', Date.now())
    
    const queryString = params.toString()
    const url = `/delivery-analytics${queryString ? `?${queryString}` : ''}`
    
    console.log('Fetching analytics from:', url)
    
    const response = await axios.get(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (response.data && response.data.success) {
      const data = response.data.data || {}
      
      console.log('Received data:', data)
      
      // Update delivery stats
      deliveryStats.value = {
        total: data.total_deliveries || 0,
        pending: data.pending_deliveries || 0,
        in_transit: data.in_transit_deliveries || 0,
        delivered: data.delivered_deliveries || 0,
        cancelled: data.cancelled_deliveries || 0,
        revenue: data.total_revenue || 0
      }
      
      // Update payment stats
      paymentStats.value = {
        ...paymentStats.value,
        ...(data.payment_stats || {})
      }
      
      // Update monthly payments
      monthlyPayments.value = data.monthly_payments || []
      
      // Update daily payments
      dailyPayments.value = data.daily_payments || []
      
      // Update top paying clients
      topPayingClients.value = data.top_paying_clients || []
      
      // Update courier performance
      courierPerformance.value = data.courier_performance || []
      
      // Update revenue summary
      revenueSummary.value = {
        current_month: data.current_month_revenue || 0,
        last_month: data.last_month_revenue || 0,
        growth: data.revenue_growth || 0
      }
      
      // Update weight summary
      weightSummary.value = {
        total_weight: data.total_weight || 0,
        avg_weight_per_delivery: data.avg_weight_per_delivery || 0,
        total_parcels: data.total_parcels || 0
      }
      
      // Update top clients
      topClients.value = Array.isArray(data.top_clients) ? data.top_clients : []
      
      // Update charts
      statusChartSeries.value = [
        deliveryStats.value.pending,
        deliveryStats.value.in_transit,
        deliveryStats.value.delivered,
        deliveryStats.value.cancelled
      ]
      
      paymentStatusChartSeries.value = [
        paymentStats.value.status_distribution?.paid || 0,
        paymentStats.value.status_distribution?.pending || 0,
        paymentStats.value.status_distribution?.overdue || 0,
        paymentStats.value.status_distribution?.partial || 0
      ]
      
      if (data.monthly_revenue && Array.isArray(data.monthly_revenue) && data.monthly_revenue.length > 0) {
        const revenueData = data.monthly_revenue.slice(-6)
        revenueChartOptions.value = {
          ...revenueChartOptions.value,
          xaxis: {
            ...revenueChartOptions.value.xaxis,
            categories: revenueData.map(i => i.month || '')
          }
        }
        revenueChartSeries.value[0].data = revenueData.map(item => item.revenue || 0)
      }
      
      // Update daily payment chart
      if (dailyPayments.value.length > 0) {
        dailyPaymentChartSeries.value[0].data = dailyPayments.value.map(item => item.total || 0)
      }
      
      // Update routes chart
      if (data.top_routes && Array.isArray(data.top_routes) && data.top_routes.length > 0) {
        const routesData = data.top_routes.slice(0, 5)
        // routesChartOptions.value.xaxis.categories = routesData.map(item => 
        //   item.departure && item.destination 
        //     ? `${item.departure} → ${item.destination}`
        //     : 'Unknown Route'
        // )
        routesChartOptions.value = {
          ...routesChartOptions.value,
          xaxis: {
            ...routesChartOptions.value.xaxis,
            categories: routesData.map(item => 
              item.departure && item.destination 
                ? `${item.departure} → ${item.destination}`
                : 'Unknown Route'
            )
          }
        }
        routesChartSeries.value[0].data = routesData.map(item => item.count || 0)
      }
      
      // Fetch payment summary separately
      await fetchPaymentSummary()
      
    } else {
      throw new Error(response.data?.message || "Failed to load analytics")
    }
  } catch (err) {
    console.error('Error fetching analytics:', err)
    
    if (err.response) {
      error.value = err.response.data?.message || `Server error: ${err.response.status}`
    } else if (err.request) {
      error.value = "Unable to connect to the server. Please check your internet connection."
    } else {
      error.value = err.message || "Failed to load delivery analytics"
    }
    
    // Set default values
    deliveryStats.value = {
      total: 0,
      pending: 0,
      in_transit: 0,
      delivered: 0,
      cancelled: 0,
      revenue: 0
    }
    
    paymentStats.value = {
      status_distribution: { paid: 0, pending: 0, overdue: 0, partial: 0 },
      method_distribution: {},
      method_totals: {},
      collected_revenue: 0,
      pending_revenue: 0,
      collection_rate: 0,
      payment_completion_rate: 0,
      avg_payment_time_hours: 0,
      current_month_collected: 0
    }
    
    statusChartSeries.value = [0, 0, 0, 0]
    paymentStatusChartSeries.value = [0, 0, 0, 0]
    revenueChartSeries.value[0].data = []
    dailyPaymentChartSeries.value[0].data = []
    routesChartSeries.value[0].data = []
    topPayingClients.value = []
    courierPerformance.value = []
    
  } finally {
    loading.value = false
    initialLoad.value = false
  }
}

const fetchPaymentSummary = async () => {
  try {
    const response = await axios.get('/payment-summary')
    if (response.data && response.data.success) {
      paymentSummary.value = response.data.data || {}
    }
  } catch (err) {
    console.error('Error fetching payment summary:', err)
  }
}

// ---- Filter Methods ----
const resetFilters = () => {
  dateRange.value = ""
  statusFilter.value = ""
}

// ---- Utility Functions ----
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  if (typeof num !== 'number') num = Number(num) || 0
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatCompactNumber = (num) => {
  if (num === null || num === undefined) return '0'
  if (typeof num !== 'number') num = Number(num) || 0
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return formatNumber(num)
}

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '??'
  return name.split(' ')
    .map(n => n[0])
    .filter(c => c)
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getAvatarColor = (index) => {
  const colors = ['primary', 'success', 'warning', 'error', 'info', 'secondary']
  return colors[index % colors.length]
}

const getPaymentMethodIcon = (method) => {
  const icons = {
    cash: 'tabler-cash',
    card: 'tabler-credit-card',
    bank_transfer: 'tabler-building-bank',
    mobile_money: 'tabler-device-mobile'
  }
  return icons[method] || 'tabler-cash'
}

const formatMethodName = (method) => {
  const names = {
    cash: 'Cash',
    card: 'Card',
    bank_transfer: 'Bank Transfer',
    mobile_money: 'Mobile Money'
  }
  return names[method] || method
}

// ---- Lifecycle Hooks ----
onMounted(async () => {
  console.log('Component mounted, fetching data...')
  await fetchDeliveryAnalytics()
})

// Watch filters with debounce
let filterTimeout = null
watch([dateRange, statusFilter], () => {
  if (filterTimeout) {
    clearTimeout(filterTimeout)
  }
  
  filterTimeout = setTimeout(() => {
    fetchDeliveryAnalytics()
  }, 500)
})

// Clean up timeout on component unmount
onUnmounted(() => {
  if (filterTimeout) {
    clearTimeout(filterTimeout)
  }
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
}

/* Modern Header */
.dashboard-header {
  background: white;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon-wrapper {
  width: 50px;
  height: 50px;
  background: rgb(var(--v-theme-primary));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon-wrapper :deep(.v-icon) {
  color: white !important;
}

.header-title {
  font-size: 25px;
  font-weight: 700;
  margin: 0;
  background: rgb(var(--v-theme-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  color: #64748b;
  margin: 0 0;
  font-size: 14px;
}

.filter-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.date-picker,
.status-filter {
  min-width: 200px;
}

.reset-btn {
  min-width: 40px !important;
  width: 40px;
  height: 40px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 2fr));
  gap: 10px;
  margin-bottom: 10px;
}

.stat-card-wrapper {
  animation: slideUp 0.6s ease-out var(--delay);
  animation-fill-mode: both;
}

.stat-card {
  background: white !important;
  border-radius: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.stat-card-content {
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-primary { background: rgba(102, 126, 234, 0.1); color: #667eea; }
.stat-success { background: rgba(40, 199, 111, 0.1); color: #28C76F; }
.stat-warning { background: rgba(255, 159, 67, 0.1); color: #FF9F43; }
.stat-error { background: rgba(234, 84, 85, 0.1); color: #EA5455; }
.stat-secondary { background: rgba(108, 117, 125, 0.1); color: #6c757d; }
.stat-info { background: rgba(255, 255, 255, 0); color: #00CFE8; }

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 25px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 2px;
}

.currency {
  font-size: 18px;
  color: #28C76F;
}

.trend-indicator {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.stat-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-badge.warning {
  background: rgba(255, 159, 67, 0.1);
  color: #FF9F43;
}

.stat-badge.info {
  background: rgba(0, 207, 232, 0.1);
  color: #00d1e818;
}

.stat-progress {
  height: 4px;
  background: rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #e03b0e, #c62424);
  transition: width 1s ease-out;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(18, 1fr);
  gap: 20px;
}

.content-card {
  background: white !important;
  border-radius: 20px !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.revenue-card { grid-column: span 4; }
.status-card { grid-column: span 4; }
.clients-card { grid-column: span 4; }
.routes-card { grid-column: span 8; }
.weight-card { grid-column: span 4; }
.activity-card { grid-column: span 4; }

.card-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.card-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-title-section h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.total-deliveries {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* Revenue Card */
.revenue-content {
  padding: 20px;
}

.revenue-comparison {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.revenue-item {
  text-align: center;
  flex: 1;
}

.revenue-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 4px;
}

.revenue-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.current .revenue-value { color: #28C76F; }
.previous .revenue-value { color: #64748b; }

.revenue-divider {
  width: 1px;
  height: 40px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 20px;
}

.revenue-chart {
  margin-top: 10px;
}

/* Status Card */
.status-content {
  padding: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.status-chart-container {
  flex: 1;
}

.status-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.legend-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-label {
  flex: 1;
  font-size: 12px;
  color: #64748b;
}

.legend-value {
  font-weight: 600;
  color: #1e293b;
}

.legend-percentage {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
  color: #1e293b;
}

/* Clients Card */
.clients-list {
  padding: 0 10px 5px;
}

.client-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 8px;
  transition: all 0.2s;
}

.client-item:hover {
  background: rgba(0, 0, 0, 0.02);
  transform: translateX(4px);
}

.client-item.top-client {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.05), transparent);
  border-left: 3px solid #667eea;
}

.client-rank {
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.client-info {
  flex: 1;
}

.client-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.client-meta {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.client-revenue {
  text-align: right;
}

.revenue-amount {
  font-weight: 700;
  color: #28C76F;
  font-size: 16px;
}

.revenue-label {
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Routes Card */
.routes-content {
  padding: 20px;
}

/* Weight Card */
.weight-content {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  text-align: center;
}

.weight-metric {
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.metric-unit {
  font-size: 14px;
  color: #64748b;
  margin-left: 4px;
}

.metric-label {
  font-size: 13px;
  color: #64748b;
}

.weight-distribution {
  padding: 0 20px 20px;
}

.distribution-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
}

.distribution-bars {
  display: flex;
  gap: 20px;
}

.distribution-bar {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  position: relative;
}

.distribution-bar::after {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #64748b;
}

.distribution-bar.light {
  background: linear-gradient(90deg, #cbd5e1, #94a3b8);
}
.distribution-bar.light::after { content: '35%'; }

.distribution-bar.medium {
  background: linear-gradient(90deg, #94a3b8, #475569);
}
.distribution-bar.medium::after { content: '50%'; }

.distribution-bar.heavy {
  background: linear-gradient(90deg, #475569, #1e293b);
}
.distribution-bar.heavy::after { content: '15%'; }

.loading-overlay {
  position: relative;
  top: 10px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 20px;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
}

.spinner-ring {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(102, 126, 234, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring-inner {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 3px solid rgba(40, 199, 111, 0.1);
  border-top-color: #28C76F;
  border-radius: 50%;
  animation: spin 0.8s linear infinite reverse;
}

.loading-text {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.loading-subtext {
  font-size: 14px;
  color: #64748b;
}

/* Error State */
.error-state {
  margin-top: 40px;
}

.error-card {
  background: linear-gradient(135deg, rgba(234, 84, 85, 0.05), transparent) !important;
  border: 1px solid rgba(234, 84, 85, 0.2) !important;
}

.error-content {
  padding: 40px;
  text-align: center;
}

.error-content h3 {
  margin: 16px 0 8px;
  color: #1e293b;
}

.error-content p {
  color: #64748b;
  margin-bottom: 24px;
}

/* Permission State */
.permission-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.permission-card {
  max-width: 400px;
  background: linear-gradient(135deg, rgba(255, 159, 67, 0.05), transparent) !important;
  border: 1px solid rgba(255, 159, 67, 0.2) !important;
}

.permission-content {
  padding: 48px;
  text-align: center;
}

.permission-icon {
  margin-bottom: 24px;
}

.permission-content h2 {
  margin-bottom: 12px;
  color: #1e293b;
}

.permission-content p {
  color: #64748b;
  margin-bottom: 8px;
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 1400px) {
  .revenue-card,
  .status-card,
  .clients-card {
    grid-column: span 6;
  }
  
  .routes-card { grid-column: span 12; }
  .weight-card { grid-column: span 6; }
  .activity-card { grid-column: span 6; }
}

@media (max-width: 992px) {
  .dashboard-container {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .content-grid > * {
    grid-column: span 12 !important;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .date-picker,
  .status-filter {
    flex: 1;
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .weight-content {
    grid-template-columns: 1fr;
  }
  
  .status-content {
    flex-direction: column;
  }
  
  .revenue-comparison {
    flex-direction: column;
    gap: 20px;
  }
  
  .revenue-divider {
    width: 100%;
    height: 1px;
    margin: 10px 0;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 16px;
  }
  
  .header-left {
    flex-direction: column;
    text-align: center;
  }
  
  .stat-card-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .stat-badge {
    position: static;
    display: inline-block;
  }
}

.payment-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 10px;
}

.payment-card {
  background: white !important;
  border-radius: 20px !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.payment-status-content {
  padding: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.payment-chart-container {
  flex: 1;
}

.payment-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.payment-summary {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px 20px;
  gap: 10px;
}

.summary-item {
  flex: 1;
  text-align: center;
  padding: 8px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.summary-label {
  font-size: 11px;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
}

.summary-value.success { color: #28C76F; }
.summary-value.warning { color: #FF9F43; }
.summary-value.error { color: #EA5455; }

.payment-methods-content {
  padding: 20px;
}

.method-item {
  margin-bottom: 12px;
}

.method-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.method-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
}

.method-icon {
  color: #64748b;
}

.method-stats {
  font-size: 12px;
}

.method-count {
  color: #64748b;
  margin-right: 8px;
}

.method-total {
  font-weight: 600;
  color: #28C76F;
}

.method-progress {
  height: 4px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.method-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #28C76F, #00CFE8);
  transition: width 1s ease-out;
}

.daily-payment-content {
  padding: 10px 10px 0;
}

.payment-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 10px 20px 20px;
}

.summary-grid-item {
  text-align: center;
}

.grid-label {
  font-size: 11px;
  color: #64748b;
  display: block;
  margin-bottom: 2px;
}

.grid-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.grid-value.warning { color: #FF9F43; }
.grid-value.error { color: #EA5455; }

.courier-card {
  grid-column: span 4;
}

.courier-list {
  padding: 0 20px 20px;
}

.courier-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s;
}

.courier-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.courier-avatar {
  border-radius: 8px !important;
}

.courier-info {
  flex: 1;
}

.courier-name {
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
}

.courier-meta {
  font-size: 11px;
  color: #64748b;
}

.courier-collection {
  font-weight: 600;
  color: #28C76F;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #64748b;
}

.stat-trend {
  position: absolute;
  top: 16px;
  right: 16px;
}

.stat-unit {
  font-size: 12px;
  color: #64748b;
  margin-left: 2px;
}

/* Responsive adjustments */
@media (max-width: 1400px) {
  .payment-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .courier-card {
    grid-column: span 6;
  }
}

@media (max-width: 992px) {
  .payment-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-status-content {
    flex-direction: column;
  }
  
  .payment-summary {
    flex-wrap: wrap;
  }
  
  .summary-item {
    min-width: 120px;
  }
}

@media (max-width: 768px) {
  .payment-summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>
