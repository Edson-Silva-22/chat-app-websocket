import { defineStore } from 'pinia'
import { useApi } from '@/plugins/httpClient'

export const useContactStore = defineStore('contact', () => {
  async function findAllMyContacts (userId: string, contactName?: string){
    let query = ''

    if (contactName) query += `&contactName=${contactName}`

    const response = await useApi('get', `/contacts/?userId=${userId}${query}`)
    
    return response
  }

  async function findMyContactsRequests(userId: string) {
    const response = await useApi('get', `/contacts/contactsRequest/?userId=${userId}`)
    return response
  }

  async function createContactRequest(userId: string, contactId: string) {
    const response = await useApi('post', `/contacts/contactsRequest`, { userId, contactId })
    return response
  }

  return {
    findAllMyContacts,
    findMyContactsRequests,
    createContactRequest
  }
})