<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const router = useRouter()
const userData = JSON.parse(localStorage.getItem("user"));

const logout = async () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token');
  await router.push('/login')
}

const userProfileList = [
  { type: 'divider' },
  {
    type: 'navItem',
    icon: 'tabler-logout',
    title: 'Logout',
    onClick: logout,
  },
]
</script>

<template>
  <VBadge
    v-if="userData" dot bordered location="bottom right" offset-x="3" offset-y="3" color="success">
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VIcon icon="tabler-user"/>

      <VMenu activator="parent" width="230" location="bottom end" offset="14px" >
        <VList>
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
                  <VAvatar color="primary" variant="tonal">
                    <VIcon icon="tabler-user-circle"/>
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>
            <VListItemTitle class="font-weight-medium">
              {{ userData.full_name || userData.username }}
            </VListItemTitle>
            <VListItemSubtitle>{{ userData.role }}</VListItemSubtitle>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template v-for="item in userProfileList" :key="item.title" >
              <VListItem  v-if="item.type === 'navItem'" :to="item.to" @click="item.onClick && item.onClick()">
                <template #prepend>
                  <VIcon class="me-2" :icon="item.icon" size="22"/>
                </template>
                <VListItemTitle>{{ item.title }}</VListItemTitle>
              </VListItem>
              <VDivider v-else class="my-2"/>
            </template>
          </PerfectScrollbar>
        </VList>
      </VMenu>
    </VAvatar>
  </VBadge>
</template>
