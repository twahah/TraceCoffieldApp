import axios from "axios";
import { defineStore } from 'pinia';

export const useCourierStore = defineStore('courierStore', {
  state: () => ({
    couriers: [],
  }),

  actions: {
    async fetchCouriers() { const response = await axios.get('/couriers'); this.couriers = response.data.couriers;  },
  },
});
