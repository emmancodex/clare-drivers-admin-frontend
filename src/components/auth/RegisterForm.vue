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
import { usernameSchema, emailSchema, passwordSchema } from '@/schemas/authSchemas.js'
import { successToast } from '@/utils/toastService.js'

const router = useRouter()
const { registerRequest } = useAuthStore()
const { fieldErrors, fieldValidity, validateField, validateForm } = useFieldValidation()

const username = ref('')
const email = ref('')
const password = ref('')
const isPasswordMasked = ref(true)
const isSubmitting = ref(false)
const formError = ref('')

const isFormValid = computed(
  () =>
    fieldValidity.username === true &&
    fieldValidity.email === true &&
    fieldValidity.password === true
)

async function onSubmit() {
  formError.value = ''
  const isValid = validateForm({
    username: { schema: usernameSchema, value: username.value },
    email: { schema: emailSchema, value: email.value },
    password: { schema: passwordSchema, value: password.value },
  })
  if (!isValid) return

  isSubmitting.value = true
  try {
    await registerRequest({
      username: username.value,
      email: email.value,
      password: password.value,
    })
    successToast('Account created', 'Please log in with your new account.')
    router.push({ name: 'login' })
  } catch (error) {
    formError.value = error.message || 'Unable to register. Please try again.'
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
          id="username"
          v-model="username"
          autocomplete="username"
          fluid
          required
          :invalid="!!fieldErrors.username"
          @blur="validateField('username', usernameSchema, username)"
          @keyup.enter="onSubmit"
        />
        <Label for="username">Username</Label>
      </FloatLabel>
      <Message v-if="fieldErrors.username" severity="error" size="small" variant="simple">
        {{ fieldErrors.username }}
      </Message>
    </div>

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
            autocomplete="new-password"
            fluid
            required
            :invalid="!!fieldErrors.password"
            @blur="validateField('password', passwordSchema, password)"
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

    <Button
      label="Register"
      :loading="isSubmitting"
      :disabled="!isFormValid"
      class="mt-2"
      @click="onSubmit"
    />

    <p class="w-full text-sm text-center">
      Already have an account?
      <RouterLink :to="{ name: 'login' }" class="text-sm text-center no-underline text-blue-600">
        Log in
      </RouterLink>
    </p>
  </div>
</template>
