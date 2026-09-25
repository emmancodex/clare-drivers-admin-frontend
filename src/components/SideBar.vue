<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarLayout from 'primevue/sidebarlayout'
import Sidebar from 'primevue/sidebar'
import SidebarSpacer from 'primevue/sidebarspacer'
import SidebarAside from 'primevue/sidebaraside'
import SidebarPanel from 'primevue/sidebarpanel'
import SidebarHeader from 'primevue/sidebarheader'
import SidebarContent from 'primevue/sidebarcontent'
import SidebarMain from 'primevue/sidebarmain'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import NavMenu from '@/components/NavMenu.vue'
import { IconMenu, IconChevronLeft } from '@/components/icons'
import { navItems } from '@/constants/navItems.js'

const emit = defineEmits(['toggle-drawer'])

const route = useRoute()
const router = useRouter()

const currentPageName = computed(
  () => navItems.find((item) => item.matches.includes(route.name))?.name ?? ''
)
</script>

<template>
  <div
    class="md:border md:border-surface-500 rounded-none md:rounded-lg max-w-screen-lg mx-auto flex items-stretch h-screen overflow-hidden"
  >
    <SidebarLayout class="min-h-0">
      <Sidebar id="side-bar">
        <!--
          SidebarSpacer reserves horizontal space in the flex row for SidebarAside, which is
          itself position:absolute and so doesn't take up flow space on its own. Hiding
          SidebarAside on small screens (above) doesn't shrink this reserved gap — same
          unlayered-PrimeVue-vs-layered-Tailwind cascade issue as SidebarAside's `!hidden`, fixed
          the same way: `max-md:!w-0` collapses the reserved width below the `md` breakpoint so
          SidebarMain's `flex-1` can claim the full row width.
        -->
        <SidebarSpacer class="max-md:!w-0" />
        <!--
          Plain `hidden` doesn't work here: PrimeVue injects `.p-sidebar-aside { display: flex }`
          as an unlayered <style> tag, while Tailwind v4 generates its utilities inside
          `@layer utilities`. Per the CSS cascade, unlayered styles always win over layered ones
          regardless of specificity or source order, so `.hidden` was silently losing. The `!`
          important-modifier (`!hidden` / `md:!flex`) sidesteps that: importance is checked before
          layers, so it reliably overrides PrimeVue's plain `display: flex` either way.
        -->
        <SidebarAside class="!hidden md:!flex">
          <SidebarPanel>
            <SidebarHeader>
              <span class="text-lg font-bold">
                <span style="color: var(--p-primary-color)">CLARE</span>
                <span style="color: var(--p-surface-900)">DRIVERS</span>
                admin
              </span>
            </SidebarHeader>

            <SidebarContent>
              <NavMenu />
            </SidebarContent>
          </SidebarPanel>
        </SidebarAside>
      </Sidebar>

      <SidebarMain class="min-h-0 overflow-y-auto">
        <Toolbar>
          <template #start>
            <div class="flex flex-col">
              <span class="text-lg font-bold md:hidden">
                <span style="color: var(--p-primary-color)">CLARE</span>
                <span style="color: var(--p-surface-900)">DRIVERS</span>
                admin
              </span>
              <span class="hidden md:inline text-lg font-semibold">{{ currentPageName }}</span>
              <div class="md:hidden flex gap-0.5 items-center">
                <Button
                  text
                  aria-label="Back"
                  class="mt-0.5"
                  @click="router.back()"
                  v-if="currentPageName !== 'Overview'"
                >
                  <IconChevronLeft />
                </Button>
                <span class="text-sm font-semibold">{{ currentPageName }}</span>
              </div>
            </div>
          </template>

          <template #end>
            <!--
              md:!hidden (not plain md:hidden): PrimeVue's .p-button sets display:inline-flex as
              an unlayered style, same conflict as SidebarAside/SidebarSpacer above — needs
              importance to reliably win at the md breakpoint.
            -->
            <Button
              text
              rounded
              aria-label="Menu"
              class="md:hidden!"
              @click="emit('toggle-drawer')"
            >
              <IconMenu :size="30" />
            </Button>
          </template>
        </Toolbar>

        <RouterView />
      </SidebarMain>
    </SidebarLayout>
  </div>
</template>

