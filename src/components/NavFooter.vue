<script setup>
import { storeToRefs } from 'pinia'
import SidebarFooter from 'primevue/sidebarfooter'
import SidebarMenu from 'primevue/sidebarmenu'
import SidebarMenuItem from 'primevue/sidebarmenuitem'
import SidebarMenuButton from 'primevue/sidebarmenubutton'
import Avatar from 'primevue/avatar'
import { useAuthStore } from '@/stores/authStore.js'

const emit = defineEmits(['item-click'])

const { user } = storeToRefs(useAuthStore())
</script>

<template>
  <SidebarFooter>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton as-child>
          <template #default="{ class: buttonClass, a11yAttrs }">
            <RouterLink
              :to="{ name: 'profile' }"
              :class="[buttonClass, 'no-underline']"
              v-bind="a11yAttrs"
              @click="emit('item-click')"
            >
              <Avatar :label="user?.username?.charAt(0).toUpperCase()" shape="circle" />
              <span class="font-semibold">{{ user?.username }}</span>
            </RouterLink>
          </template>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
</template>
