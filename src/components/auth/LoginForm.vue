<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import InputPassword from 'primevue/inputpassword'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'
import Label from 'primevue/label'
import Message from 'primevue/message'
import { IconEye, IconEyeSlash } from '@/components/icons'
import { useAuthStore } from '@/stores/authStore.js'
import { useFieldValidation } from '@/composables/useFieldValidation.js'
import { emailSchema, loginPasswordSchema } from '@/schemas/authSchemas.js'
import { successToast } from '@/utils/toastService.js'

const router = useRouter()
const { loginRequest } = useAuthStore()
const { fieldErrors, fieldValidity, validateField, validateForm } = useFieldValidation()

const email = ref('')
const password = ref('')
const isPasswordMasked = ref(true)
const isSubmitting = ref(false)
const formError = ref('')

const isFormValid = computed(() => fieldValidity.email === true && fieldValidity.password === true)

async function onSubmit() {
  formError.value = ''
  const isValid = validateForm({
    email: { schema: emailSchema, value: email.value },
    password: { schema: loginPasswordSchema, value: password.value },
  })
  if (!isValid) return

  isSubmitting.value = true
  try {
    await loginRequest({ email: email.value, password: password.value })
    successToast('Welcome back', 'You have logged in successfully.')
    router.push({ name: 'overview' })
  } catch (error) {
    formError.value = error.message || 'Unable to log in. Please try again.'
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

    <div class="flex flex-col gap-1">
      <FloatLabel variant="in">
        <IconField>
          <InputPassword
            id="password"
            v-model="password"
            v-model:mask="isPasswordMasked"
            autocomplete="current-password"
            fluid
            required
            :invalid="!!fieldErrors.password"
            @blur="validateField('password', loginPasswordSchema, password)"
            @keyup.enter="onSubmit"
          />
          <InputIcon class="cursor-pointer" @click="isPasswordMasked = !isPasswordMasked">
            <component :is="isPasswordMasked ? IconEye : IconEyeSlash" :size="18" />
          </InputIcon>
        </IconField>
        <Label for="password">Password</Label>
      </FloatLabel>
      <Message v-if="fieldErrors.password" severity="error" size="small" variant="simple">
        {{ fieldErrors.password }}
      </Message>
    </div>
    <div class="flex w-full justify-end">
      <RouterLink
        :to="{ name: 'forgot-password' }"
        class="text-sm text-center no-underline text-blue-600"
      >
        Forgot password?
      </RouterLink>
    </div>

    <Button
      label="Log in"
      :loading="isSubmitting"
      :disabled="!isFormValid"
      class="mt-2"
      @click="onSubmit"
    />

    <p class="w-full text-sm text-center">
      Don't have an account?
      <RouterLink :to="{ name: 'register' }" class="text-sm text-center no-underline text-blue-600">
        Register
      </RouterLink>
    </p>
  </div>
</template>
