export const redirects = [
  {
    path: '/',
    name: 'root',
    redirect: () => {
      const token = localStorage.getItem("token");
      if (token) return { name: '/dashboard' };
      return { name: 'index' };
    },
  },
];

export const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboards/dashboard.vue'),
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem("token");
      if (!token) return next({ name: 'index' });
      next();
    },
  },
  {
    path: '/login',
    name: 'audits',
    component: () => import('@/pages/login.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboards/dashboard.vue'),
  },
  {
    path: '/newdelivery',
    name: 'newdelivery',
    component: () => import('@/pages/delivery/newdelivery.vue'),
  },
  {
    path: '/pricerates',
    name: 'pricerates',
    component: () => import('@/pages/delivery/pricerates.vue'),
  },
  {
    path: '/clients',
    name: 'clients',
    component: () => import('@/pages/others/clients.vue'),
  },
  {
    path: '/couriers',
    name: 'couriers',
    component: () => import('@/pages/others/couriers.vue'),
  },
  {
    path: '/deliveries',
    name: 'deliveries',
    component: () => import('@/pages/delivery/deliveries.vue'),
  },
  {
    path: '/trackdelivery',
    name: 'trackdelivery',
    component: () => import('@/pages/delivery/trackdelivery.vue'),
  }, 
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/settings/users.vue'),
  },
  {
    path: '/roles',
    name: 'roles',
    component: () => import('@/pages/settings/roles.vue'),
  },
  {
    path: '/permissions',
    name: 'permissions',
    component: () => import('@/pages/settings/permissions.vue'),
  },
  {
    path: '/audits',
    name: 'audits',
    component: () => import('@/pages/settings/audit.vue'),
  },
]
