<template>
  <v-app>
    <v-main class="main">
      <Alert/>

      <h1 class="header-logo">Talk <v-icon icon="mdi-message-text" color="success"></v-icon> Flow</h1>

      <v-form class="vForm" @submit="login">
        <h2 class="vForm_title">Login</h2>

        <v-text-field
          name="email"
          placeholder="Informe seu email"
          class="vForm_textField"
          variant="solo"
          clearable
          v-model="email"
          :errorMessages="errors.email"
        ></v-text-field>

        
        <v-text-field
          name="senha"
          placeholder="Digite sua senha"
          class="vForm_textField"
          variant="solo"
          @click:append-inner="viewPassword = !viewPassword"
          :append-inner-icon="viewPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="viewPassword ? 'text' : 'password'"
          clearable
          v-model="password"
          :errorMessages="errors.password"
        ></v-text-field>

        <v-btn 
          class="vForm_btn"
          color="success"
          type="submit"
          @click="login"
          :loading="loading"
        >Entrar</v-btn>

        <v-btn 
          class="vForm_btn" 
          variant='outlined'
          color="success"
          @click="router.push('/register')"
        >Cadastra-se</v-btn>

        <a href="">Esqueci minha senha.</a>
      </v-form>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useField, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod'
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Alert from '@/components/Alert.vue';

  const viewPassword = ref(false)
  const loading = ref(false)
  const router = useRouter();
  const authStore = useAuthStore();
  const validationSchema = toTypedSchema(
    z.object({
      email: z
        .string({required_error: 'Informe seu email.', invalid_type_error: 'Informe seu email'})
        .min(1, {message: 'Informe seu email.'})
        .email({message: 'Informe um email válido.'})
        .endsWith('@gmail.com', {message: 'Email válido'}),
      password: z
        .string({required_error: 'Digite sua senha.', invalid_type_error: 'Digite sua senha'})
        .min(1, {message: 'Digite sua senha.'}),
    })
  )

  const { handleSubmit, errors } = useForm({ validationSchema });
  const { value: email } = useField('email')
  const { value: password } = useField('password')

  const login = handleSubmit(async (values) => {
    loading.value = true

    const response = await authStore.login(values)
    if (response) {
      const savedselectedItemMenu = localStorage.getItem('selectedMenuItem')

      if (savedselectedItemMenu) {
        loading.value = false
        const formatJson = JSON.parse(savedselectedItemMenu)
        router.push(`${formatJson.route}`)
      }
    }

    loading.value = false
  })

</script>

<style scoped>
@import "@/styles/login.page.css";
</style>