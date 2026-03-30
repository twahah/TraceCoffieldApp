import axios from "axios";
import { defineStore } from 'pinia';

export const useDepotCommitteeStore = defineStore('depotCommitteeStore', {
  state: () => ({
    depotCommittees: [],
    deliveries: []
  }),

  actions: {
    async fetchDepotCommittees() { const response = await axios.get('/depot-committees'); this.depotCommittees = response.data.data;  },
    async fetchDeliveries() { const response = await axios.get('/deliveries'); this.deliveries = response.data.deliveries;  },
  },
});
