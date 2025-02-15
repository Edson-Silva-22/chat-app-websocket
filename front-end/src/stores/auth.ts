
import { defineStore } from 'pinia'
import { useApi } from "@/plugins/httpClient"
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const loggedUser = ref()
  const userAuth = ref<any | null>(null)

  async function login(dados:any) {
    const response = await useApi('post', 'auth/login', dados)
    
    if (response) {
      localStorage.setItem('token', response.token)
      return response
    }

  }

  async function verifyToken(token:string) {
    const response = await useApi('get', 'auth/verifyToken', null,{ Authorization: `Bearer ${token}`})
    
    if (response.valid) {
      userAuth.value = response.user
      
      return true
    }

    else{
      return false
    }
  }

  async function logout() {
    localStorage.removeItem('token')
  }

  async function forgotPassword(email:string) {
    const response = await useApi('post', `auth/forgotpass/?email=${email}`)
    return response
  }

  async function resetPass(dados:any) {
    const response = await useApi('post', 'auth/resetpass', dados)
    return response
  }

  return {
    login,
    verifyToken,
    logout,
    forgotPassword,
    resetPass,
    userAuth,
    loggedUser
  }
})