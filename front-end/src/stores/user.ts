import { defineStore } from 'pinia'
import { useApi } from '@/plugins/httpClient'

export const useUserStore = defineStore('user', () => {

    async function create(data: object) {
        const response = await useApi('post', '/users', data)
        return response
    }

    async function findAll(contactName?: string) {
        let query = ''
        
        if (contactName) query += `?contactName=${contactName}`

        const response = await useApi('get', `/users/${query}`)
        return response
    }

    async function findOne(id: string) {
        const response = await useApi('get', `/users/${id}`)
        return response
    }

    async function update(id: string, data: object) {
        const response = await useApi('put', `/users/${id}`, data)
        return response
    }

    async function remove(id: string) {
        const response = await useApi('delete', `/users/${id}`)
        return response
    }

    return {
        create,
        findAll,
        findOne,
        update,
        remove,
    }
})