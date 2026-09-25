<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'
import Label from 'primevue/label'
import Message from 'primevue/message'
import { useAuthStore } from '@/stores/authStore.js'
import { useFieldValidation } from '@/composables/useFieldValidation.js'
import { emailSchema } from '@/schemas/authSchemas.js'
import { successToast } from '@/utils/toastService.js'

const router = useRouter()
const { requestPasswordResetCodeRequest } = useAuthStore()
const { fieldErrors, fieldValidity, validateField, validateForm } = useFieldValidation()

const email = ref('')
const isSubmitting = ref(false)
const formError = ref('')

const isFormValid = computed(() => fieldValidity.email === true)

async function onSubmit() {
  formError.value = ''
  const isValid = validateForm({
    email: { schema: emailSchema, value: email.value },
  })
  if (!isValid) return

  isSubmitting.value = true
  try {
    const message = await requestPasswordResetCodeRequest({ email: email.value })
    successToast('Check your email', message)
    router.push({ name: 'reset-password', query: { email: email.value } })
  } catch (error) {
    formError.value = error.message || 'Unable to send reset code. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Message v-if="formError" severity="error">{{ formError }}</Message>

    <div class="flex flex-col gap-1">
      <FloatLabel variant="in">
        <InputText
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          fluid
          required
          :invalid="!!fieldErrors.email"
          @blur="validateField('email', emailSchema, email)"
          @keyup.enter="onSubmit"
        />
        <Label for="email">Email</Label>
      </FloatLabel>
      <Message v-if="fieldErrors.email" severity="error" size="small" variant="simple">
        {{ fieldErrors.email }}
      </Message>
    </div>

    <Button
      label="Send reset code"
      :loading="isSubmitting"
      :disabled="!isFormValid"
      class="mt-2"
      @click="onSubmit"
    />

    <RouterLink :to="{ name: 'login' }" class="text-sm text-center no-underline">
      Back to log in
    </RouterLink>
  </div>
</template>
