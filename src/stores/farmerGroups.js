import axios from "axios";
import { defineStore } from 'pinia';

export const useFarmerGroupStore = defineStore('farmerGroupStore', {
  state: () => ({
    farmerGroups: [],
    deliveries: [],
  }),

  actions: {
    async fetchFarmerGroups() { const response = await axios.get('/farmer-groups'); this.farmerGroups = response.data.data;  },
    async fetchDeliveries() { const response = await axios.get('/deliveries'); this.deliveries = response.data.deliveries;  },
  },
});
