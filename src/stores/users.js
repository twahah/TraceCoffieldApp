import axios from "axios";
import { defineStore } from 'pinia';

export const useUsersStore = defineStore('usersStore', {
  state: () => ({
    users: [],
    roles: [],
    audits: [],
    permissions: [],
  }),

  actions: {
    async fetchUsers() { const response = await axios.get('/systemusers'); this.users = response.data.users;  },
    async fetchRoles() { const response = await axios.get('/systemroles'); this.roles = response.data.roles;  },
    async fetchAudits() { const response = await axios.get('/audits'); this.audits = response.data.audits;  },
    async filterAudits({user,dates}) { let formData = new FormData(); formData.append("username", user); formData.append("dates", dates); const response = await axios.post('/filteraudits', formData); this.audits = response.data.audits;  },
    async fetchPermissions() { const response = await axios.get('/permissions'); this.permissions = response.data.permissions;  },
  },
});
