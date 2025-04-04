import { defineStore } from 'pinia'
import { useApi } from '@/plugins/httpClient'

export const useContactStore = defineStore('contact', () => {
  async function findAllMyContacts (userId: string, contactName?: string){
    let query = ''

    if (contactName) query += `&contactName=${contactName}`

    const response = await useApi('get', `/contacts/?userId=${userId}${query}`)
    
    return response
  }

  return {
    findAllMyContacts,
  }
})