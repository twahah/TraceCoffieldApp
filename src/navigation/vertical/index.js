export default [
    {
        title: 'Dashboard',
        icon: { icon: 'tabler-dashboard' },
        to: 'dashboard',
        perm: 'view_dashboard',
    },
    {
      title: 'New Delivery',
      to: 'newdelivery',
      icon: { icon: 'tabler-plus' },
      perm: 'view_newdeliveries',
    },
    {
      title: 'Track Delivery',
      to: 'trackdelivery',
      icon: { icon: 'tabler-search' },
      perm: 'view_trackdeliveries',
    },
    {
      title: 'Deliveries',
      to: 'deliveries',
      icon: { icon: 'tabler-truck-delivery' },
      perm: 'view_deliveries',
    },
    {
      title: 'Senders',
      to: 'clients',
      icon: { icon: 'tabler-user' },
      perm: 'view_clients',
    },
    {
      title: 'Price Rates',
      to: 'pricerates',
      icon: { icon: 'tabler-ruler' },
      perm: 'view_pricerates',
    },    
    {
      title: 'Couriers',
      icon: { icon: 'tabler-truck' },
      perm: 'view_couriers',
      to: 'couriers',
    },
    // {
    //   title: 'Reports',
    //   icon: { icon: 'tabler-report' },
    //   perm: 'view_foods',
    //   children: [
    //     {
    //     title: 'Delivery Report',
    //     to: 'fooditems',
    //     perm: 'view_foods',
    //     },
    //     {
    //       title: 'Route Performance',
    //       to: 'foodcategories',
    //       perm: 'view_categories',
    //     },
    //     {
    //       title: 'Payments Report',
    //       to: 'foodcategories',
    //       perm: 'view_categories',
    //     },
    //   ]
    // },
    {
      title: 'System Users',
      icon: { icon: 'tabler-users' },
      to: 'users',
      perm: 'view_users',
    },
    {
      title: 'System Roles',
      icon: { icon: 'tabler-user-check' },
      to: 'roles',
      perm: 'view_roles',
    },
    {
      title: 'System Permissions',
      icon: { icon: 'tabler-shield-check' },
      to: 'permissions',
      perm: 'view_permissions',
    },
    {
      title: 'Audit Trails',
      icon: { icon: 'tabler-history' },
      to: 'audits',
      perm: 'view_audits',
    },
  ]
  