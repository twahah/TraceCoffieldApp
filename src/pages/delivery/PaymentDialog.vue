<template>
  <VDialog v-model="dialog" max-width="500px" persistent>
    <VCard class="dm-payment-dialog">
      <VCardTitle class="dm-payment-title">
        <VIcon icon="tabler-cash" size="24" color="success" />
        <span>Process Payment</span>
      </VCardTitle>

      <VCardText>
        <div class="dm-payment-info">
          <div class="dm-info-row">
            <span>Tracking #:</span>
            <strong>{{ delivery?.tracking_number }}</strong>
          </div>
          <div class="dm-info-row">
            <span>Amount Due:</span>
            <strong class="text-success">${{ calculateDeliveryAmount(delivery) }}</strong>
          </div>
          <div class="dm-info-row">
            <span>Sender:</span>
            <strong>{{ delivery?.client?.name }}</strong>
          </div>
          <div class="dm-info-row">
            <span>Courier:</span>
            <strong>{{ delivery?.courier?.name }}</strong>
          </div>
        </div>

        <VForm ref="paymentForm" v-model="valid">
          <VSelect
            v-model="paymentData.method"
            :items="paymentMethods"
            label="Payment Method"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'Payment method is required']"
            class="mt-1"
          /> 

          <VTextField
            v-model="paymentData.amount"
            readonly
            label="Amount Paid"
            type="number"
            prefix="$"
            variant="outlined"
            density="comfortable"
            :rules="amountRules"
            class="mt-1"
          />
          
          <VTextarea
            v-model="paymentData.notes"
            label="Notes"
            variant="outlined"
            density="comfortable"
            rows="2"
            class="mt-1"
          />
        </VForm>
      </VCardText>

      <VCardActions class="dm-payment-actions">
        <VBtn variant="outlined" color="secondary" @click="close">Cancel</VBtn>
        <VBtn 
          color="success" 
          variant="elevated" 
          @click="processPayment"
          :loading="processing"
          prepend-icon="tabler-cash"
        >
          Confirm Payment
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
  delivery: Object,
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue', 'payment-completed']);

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const paymentForm = ref(null);
const valid = ref(false);
const processing = ref(false);
const BASE_URL = (axios.defaults.baseURL || '').replace(/\/api\/?$/, '');

const paymentMethods = [
  { title: 'Cash', value: 'cash' },
  { title: 'Card', value: 'card' },
  { title: 'Bank Transfer', value: 'bank_transfer' },
  { title: 'Mobile Money', value: 'mobile_money' },
];

const couriers = computed(() => {
  // Get unique couriers from your store or pass as prop
  return [];
});

const paymentData = ref({
  method: '',
  amount: '',
  notes: ''
});

const amountRules = [
  v => !!v || 'Amount is required',
  v => v > 0 || 'Amount must be greater than 0',
  v => v <= parseFloat(calculateDeliveryAmount(props.delivery)) || 'Amount cannot exceed total due'
];

const calculateDeliveryAmount = (d) => {
  if (!d?.parcels || !d?.pricerate) return '0.00';
  const weight = d.parcels.reduce((s,x) => s + parseFloat(x.weight || 0), 0);
  return (weight * parseFloat(d.pricerate.charge || 0)).toFixed(2);
};

const processPayment = async () => {
  const { valid } = await paymentForm.value.validate();
  if (!valid) return;

  processing.value = true;
  try {
    const formData = new FormData();
    formData.append('delivery_id', props.delivery.id);
    formData.append('amount', paymentData.value.amount);
    formData.append('method', paymentData.value.method);
    formData.append('notes', paymentData.value.notes);

    const response = await axios.post('/process-payment', formData);
    
    if (response.status === 200) {
      emit('payment-completed', response.data);
      close();
    }
  } catch (error) {
    console.error('Payment failed:', error);
  } finally {
    processing.value = false;
  }
};

const close = () => {
  paymentData.value = { method: '', amount: '', paidTo: '', notes: '' };
  dialog.value = false;
};

// Reset form when dialog opens
watch(dialog, (val) => {
  if (val) {
    paymentData.value.amount = calculateDeliveryAmount(props.delivery);
  }
});
</script>

<style scoped>
.dm-payment-dialog { border-radius: 18px !important; }
.dm-payment-title { 
  display: flex; align-items: center; gap: 12px; 
  padding: 20px 24px; background: #f8fafc;
  border-bottom: 1px solid rgba(0,0,0,.06);
}
.dm-payment-info {
  background: #f8fafc; border-radius: 12px; padding: 16px;
  margin-bottom: 16px;
}
.dm-info-row {
  display: flex; justify-content: space-between;
  padding: 6px 0; border-bottom: 1px dashed rgba(0,0,0,.06);
}
.dm-info-row:last-child { border-bottom: none; }
.dm-payment-actions {
  padding: 16px 24px; gap: 10px;
  border-top: 1px solid rgba(0,0,0,.06);
}
.dm-payment-actions .v-btn { flex: 1; border-radius: 10px !important; height: 44px !important; }
</style>
