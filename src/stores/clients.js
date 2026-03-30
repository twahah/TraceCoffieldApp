import axios from "axios";
import { defineStore } from 'pinia';

export const useClientStore = defineStore('clientStore', {
  state: () => ({
    clients: [],
  }),

  actions: {
    async fetchClients() { const response = await axios.get('/clients'); this.clients = response.data.clients;  },
  },
});
