<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import SidebarGroup from 'primevue/sidebargroup'
import SidebarGroupContent from 'primevue/sidebargroupcontent'
import SidebarMenu from 'primevue/sidebarmenu'
import SidebarMenuItem from 'primevue/sidebarmenuitem'
import SidebarMenuButton from 'primevue/sidebarmenubutton'
import { navItems } from '@/constants/navItems.js'
import { useAuthStore } from '@/stores/authStore.js'
import NavFooter from '@/components/NavFooter.vue'

const emit = defineEmits(['item-click'])

const route = useRoute()
const { user } = storeToRefs(useAuthStore())

const isActive = (item) => item.matches.includes(route.name)

const visibleNavItems = computed(() =>
  navItems.filter((item) => !item.roles || item.roles.includes(user.value?.role))
)
</script>

<template>
  <!--
    NavFooter (a SidebarFooter internally) only auto-pins to the bottom when it's a sibling of
    SidebarContent under SidebarPanel's own flex-column layout. Here it's nested inside
    SidebarContent (and, in the drawer, inside .p-drawer-content, which is flex-grow:1 but not
    itself flex-direction:column) — neither gives these two pieces a flex context on its own, so
    without this wrapper they'd just stack as plain blocks. h-full + justify-between establishes
    that context ourselves: the group takes its natural height, the footer gets pushed to the end.
  -->
  <div class="h-full flex flex-col justify-between">
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in visibleNavItems" :key="item.path">
            <!--
              SidebarMenuButton is headless (renders a plain button by default, not a
              real link). as-child tells it to skip its own root element and instead
              hand its styling (buttonClass) and a11y/data attrs (a11yAttrs, incl. the
              active-state highlighting from is-active) to this slot, so we can apply
              them onto an actual RouterLink that Vue Router can navigate.
            -->
            <SidebarMenuButton as-child :is-active="isActive(item)">
              <template #default="{ class: buttonClass, a11yAttrs }">
                <RouterLink
                  :to="item.path"
                  :class="[buttonClass, 'no-underline']"
                  v-bind="a11yAttrs"
                  @click="emit('item-click', item)"
                >
                  <component :is="item.icon" v-if="item.icon" />
                  <span class="font-semibold">{{ item.name }}</span>
                </RouterLink>
              </template>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>

    <NavFooter @item-click="emit('item-click')" />
  </div>
</template>
