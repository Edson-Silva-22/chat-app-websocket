import { defineStore } from 'pinia'
import { useApi } from '@/plugins/httpClient'

export const useContactStore = defineStore('contact', () => {
  async function findAll (userId: string){
    const response = await useApi('get', `/contacts/?userId=${userId}`)
    
    return response
  }

  return {
    findAll,
  }
})