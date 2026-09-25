<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import { IconDrivers, IconActiveDrivers, IconAdmin, IconReload } from '@/components/icons'
import SkeletonOverview from '@/components/skeletons/skeleton-overview.vue'
import { useOverviewStore } from '@/stores/overviewStore.js'
import { useErrorHandler } from '@/composables/useErrorHandler.js'

const { overview } = storeToRefs(useOverviewStore())
const { getOverviewRequest } = useOverviewStore()
const { handleError } = useErrorHandler()

const isLoading = ref(false)
const isRefreshing = ref(false)

// Top-line totals, each paired with an icon.
const summaryCards = computed(() => [
  { label: 'Total Drivers', icon: IconDrivers, value: overview.value?.drivers.total },
  { label: 'Active Drivers', icon: IconActiveDrivers, value: overview.value?.activeDrivers.total },
  { label: 'Total Admins', icon: IconAdmin, value: overview.value?.admins.total },
])

// Each breakdown card pairs a driver/admin sub-count with the same severity
// convention used for its Tag elsewhere in the app (e.g. DriverDetailView).
const approvalBreakdown = [
  { label: 'Approved', key: 'approved', severity: 'success' },
  { label: 'Pending', key: 'pending', severity: 'warn' },
  { label: 'Rejected', key: 'rejected', severity: 'danger' },
  { label: 'Not Submitted', key: 'notSubmitted', severity: 'secondary' },
]

const verificationBreakdown = [
  { label: 'Verified', key: 'verified', severity: 'info' },
  { label: 'Unverified', key: 'unverified', severity: 'secondary' },
]

const statusBreakdown = [
  { label: 'Active', key: 'active', severity: 'success' },
  { label: 'Inactive', key: 'inactive', severity: 'secondary' },
]

const adminBreakdown = [
  { label: 'Active', key: 'active', severity: 'success' },
  { label: 'Suspended', key: 'suspended', severity: 'warn' },
  { label: 'Banned', key: 'banned', severity: 'danger' },
]

async function getOverview() {
  try {
    isLoading.value = true
    await getOverviewRequest()
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

async function refreshOverview() {
  try {
    isRefreshing.value = true
    await getOverviewRequest()
  } catch (error) {
    handleError(error)
  } finally {
    isRefreshing.value = false
  }
}

onMounted(getOverview)
</script>

<template>
  <div class="p-2 flex flex-col gap-4">
    <div class="flex justify-end">
      <Button
        label="Refresh"
        size="small"
        text
        severity="contrast"
        :disabled="isRefreshing"
        @click="refreshOverview"
      >
        <template #icon>
          <ProgressSpinner
            v-if="isRefreshing"
            style="width: 16px; height: 16px"
            :stroke-width="6"
          />
          <IconReload v-else :size="16" />
        </template>
      </Button>
    </div>

    <SkeletonOverview v-if="isLoading" />

    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card v-for="card in summaryCards" :key="card.label">
          <template #content>
            <div class="flex items-center gap-4">
              <Avatar shape="circle" size="large">
                <template #icon>
                  <component :is="card.icon" :size="20" />
                </template>
              </Avatar>
              <div class="flex flex-col">
                <span class="text-2xl font-bold">{{ card.value }}</span>
                <span class="text-[0.85rem] text-slate-600">{{ card.label }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-2 gap-4">
        <Card>
          <template #title>Driver Approval</template>
          <template #content>
            <div class="flex flex-col gap-3">
              <div
                v-for="item in approvalBreakdown"
                :key="item.key"
                class="flex items-center justify-between"
              >
                <Tag :value="item.label" :severity="item?.severity" />
                <span class="font-semibold">{{ overview?.drivers[item.key] }}</span>
              </div>
            </div>
          </template>
        </Card>

        <Card>
          <template #title>Driver Verification</template>
          <template #content>
            <div class="flex flex-col gap-3">
              <div
                v-for="item in verificationBreakdown"
                :key="item.key"
                class="flex items-center justify-between"
              >
                <Tag :value="item.label" :severity="item?.severity" />
                <span class="font-semibold">{{ overview?.drivers[item.key] }}</span>
              </div>
            </div>
          </template>
        </Card>

        <Card>
          <template #title>Driver Status</template>
          <template #content>
            <div class="flex flex-col gap-3">
              <div
                v-for="item in statusBreakdown"
                :key="item.key"
                class="flex items-center justify-between"
              >
                <Tag :value="item.label" :severity="item?.severity" />
                <span class="font-semibold">{{ overview?.drivers[item.key] }}</span>
              </div>
            </div>
          </template>
        </Card>

        <Card>
          <template #title>Admin Status</template>
          <template #content>
            <div class="flex flex-col gap-3">
              <div
                v-for="item in adminBreakdown"
                :key="item.key"
                class="flex items-center justify-between"
              >
                <Tag :value="item.label" :severity="item?.severity" />
                <span class="font-semibold">{{ overview?.admins[item.key] }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Recent Activity Logs Section -->
      <Card class="h-50 flex justify-center items-center">
        <template #title>Recent Activity Logs</template>
        <template #content>
          <span class="text-slate-600">Recent activities logs coming soon...</span>
        </template>
      </Card>
    </template>
  </div>
</template>
