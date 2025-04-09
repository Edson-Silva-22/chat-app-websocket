<template>
  <v-app>
    <v-main class="v-main">
      <div class="text-field" v-if="tab != 'three'">
        <v-text-field
          label="Buscar"
          variant="solo"
          bg-color="#111a31"
          clearable
          v-model="contactName"
          v-on:update:model-value="findAllContacts"
        ></v-text-field>
      </div>
      
      <v-tabs
        v-model="tab"
        color="success"
        slider-color="success"
        height="64"
        class="mb-5 w-100"
        show-arrows
        align-tabs="center"
      >
          <v-tab value="one" class="tab">Meus Contatos</v-tab>
          <v-tab value="two" class="tab">Contatos</v-tab>
          <v-tab value="three" class="tab">Solicitações</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab" class="tabWindow">
        <v-tabs-window-item value="one">
          <div v-if="loading" class="progress-circular">  
            <v-progress-circular 
              indeterminate 
              color="success"
              size="86"
            ></v-progress-circular>
          </div>

          <div 
            class="contact" 
            v-for="(contact, index) in myContactsCache"
            v-if="myContacts.length > 0 && loading == false"
            @click="contactsDialogOpen.isOpen = !contactsDialogOpen.isOpen; contactsDialogOpen.contact = contact.contactId; router.push(`/profile/${contact._id}`)"
            :key="index"
          >
            <div class="avatar">
              <v-avatar
                image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
                size="60"
              ></v-avatar>
              
              <div>
                <p>{{ contact.contactId.nickname }}</p>
                <p class="secondaryText">{{ contact.contactId.name }}</p>
              </div>
            </div>

            <div class="actions">
              <v-btn 
                color="red" 
                variant="tonal" 
                append-icon="mdi-delete"
                class="text-subtitle-2"
              >Excluir contato</v-btn>
            </div>
          </div>

          <div v-if="myContacts.length == 0 && loading == false" class="d-flex flex-column align-center">
            <v-icon icon="mdi-account-cancel" size="64" color="#BDBDBD"></v-icon>
            <p>Nenhum contato salvo.</p>
          </div>
        </v-tabs-window-item>

        <v-tabs-window-item value="two">
          <div v-if="loading" class="progress-circular">  
            <v-progress-circular 
              indeterminate 
              color="success"
              size="86"
            ></v-progress-circular>
          </div>

          <div 
            class="contact" 
            v-for="(contact, index) in contacts"
            v-if="contacts.length > 0 && loading == false"
            @click="() => {
              if(contact.isContactSaved == false) {
                contactsDialogOpen.isOpen = !contactsDialogOpen.isOpen 
                contactsDialogOpen.contact = contact
              }
              else{
                contactsDialogOpen.isOpen = !contactsDialogOpen.isOpen 
                contactsDialogOpen.contact = contact
              }
            }"
            :key="index"
          >
            <div class="avatar">
              <v-avatar
                image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
                size="60"
              ></v-avatar>

              <div>
                <p>{{ contact.nickname }}</p>
                <p class="secondaryText">{{ contact.name }}</p>
              </div>
            </div>

            <div class="actions">
              <v-btn
                class="text-subtitle-2" 
                color="success" 
                variant="tonal" 
                append-icon="mdi-account-arrow-right"
                v-if="contact.isContactSaved == false && contact.isRequest == false"
              >Solicitar</v-btn>

              <v-btn
                class="text-subtitle-2" 
                color="red" 
                variant="tonal" 
                append-icon="mdi-delete"
                v-if="contact.isContactSaved"
              >Excluir contato</v-btn>

              <v-btn
                class="text-subtitle-2" 
                color="red" 
                variant="tonal" 
                append-icon="mdi-account-arrow-right"
                v-if="authStore.userAuth._id == contact.senderId && contact.isRequest"
              >Cancelar Solicitação</v-btn>

              <v-btn
                class="text-subtitle-2" 
                v-if="authStore.userAuth._id != contact.senderId && contact.isRequest"              
                color="success"
                variant="tonal" 
                append-icon="mdi-account-arrow-left"
              >Aceitar</v-btn>

              <v-btn
                class="text-subtitle-2" 
                v-if="authStore.userAuth._id != contact.senderId && contact.isRequest"              
                color="red" 
                variant="tonal" 
                append-icon="mdi-account-cancel"
              >Recusar</v-btn>
            </div>
          </div>

          <div v-if="contacts.length == 0 && loading == false" class="d-flex flex-column align-center">
            <v-icon icon="mdi-account-cancel" size="64" color="#BDBDBD"></v-icon>
            <p>Nenhum contato encontrado.</p>
          </div>
        </v-tabs-window-item>

        <v-tabs-window-item value="three">
          <div v-if="loading" class="progress-circular">  
            <v-progress-circular 
              indeterminate 
              color="success"
              size="86"
            ></v-progress-circular>
          </div>

          <div 
            class="contact" 
            v-for="(contact, index) in contactRequests"
            v-if="contactRequests.length > 0 && loading == false"
            :key="index"
            @click="contactsDialogOpen.isOpen = !contactsDialogOpen.isOpen; contactsDialogOpen.contact = contact.contactId"
          >
            <p class="secondaryText">{{ authStore.userAuth._id == contact.userId._id ? 'Solicitação Enviada' : 'Solicitação Recebida' }}</p>
            <div class="avatar">
              <v-avatar
                image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
                size="60"
              ></v-avatar>
              <p>{{ authStore.userAuth._id == contact.userId._id ? contact.contactId.nickname : contact.userId.nickname }}</p>
            </div>

            <div class="actions">
              <v-btn 
                v-if="authStore.userAuth._id == contact.userId._id"
                color="red" 
                variant="tonal" 
                append-icon="mdi-account-arrow-right"
                class="text-subtitle-2"
              >Cancelar Solicitação</v-btn>

              <v-btn 
                v-if="authStore.userAuth._id == contact.contactId._id"              
                color="success"
                variant="tonal" 
                append-icon="mdi-account-arrow-left"
                class="text-subtitle-2"
              >Aceitar</v-btn>

              <v-btn 
                v-if="authStore.userAuth._id == contact.contactId._id"              
                color="red" 
                variant="tonal" 
                append-icon="mdi-account-cancel"
                class="text-subtitle-2"
              >Recusar</v-btn>
            </div>
          </div>

          <div v-if="contactRequests.length == 0 && loading == false" class="d-flex flex-column align-center">
            <v-icon icon="mdi-account-cancel" size="64" color="#BDBDBD"></v-icon>
            <p>Nenhum contato solicitado.</p>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>

      <v-dialog
        v-model="contactsDialogOpen.isOpen"
        max-width="400px"
        width="90%"
      >
        <div class="dialogContent">
          <v-avatar
            image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
            size="200"
          ></v-avatar>

          <div class="dialogBody">
            <h2>{{ contactsDialogOpen.contact?.name }}</h2>
            <p>{{ contactsDialogOpen.contact?.email }}</p>
            <p>{{ contactsDialogOpen.contact?.nickname }}</p>
          </div>

          <div class="dialogActions" v-if="tab == 'one'">
            <v-btn 
              color="success" 
              @click="contactsDialogOpen.isOpen = false"
              variant="tonal"
            >Cancelar</v-btn>

            <v-btn 
              color="red" 
              variant="tonal"
            >Excluir Contato</v-btn>
          </div>

          <div class="dialogActions" v-if="tab == 'two'">
            <v-btn 
              color="success" 
              variant="tonal"
              >Solicitar Contato</v-btn>

            <v-btn 
              color="red" 
              @click="contactsDialogOpen.isOpen = false"
              variant="tonal"
            >Cancelar</v-btn>
          </div>

          <div class="dialogActions" v-if="tab == 'three'">
            <v-btn 
              color="success" 
              variant="tonal"
              >Aceitar</v-btn>

            <v-btn 
              color="red" 
              @click="contactsDialogOpen.isOpen = false"
              variant="tonal"
            >Recusar</v-btn>
          </div>
        </div>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { useContactStore } from '@/stores/contact'
  import { useAuthStore } from '@/stores/auth'
  import { useUserStore } from '@/stores/user';
  import { useRouter } from 'vue-router';

  export interface User {
    _id: string;
    name: string;
    email: string;
    nickname: string;
    createdAt: Date;
    updatedAt: Date;
    isContactSaved: boolean;
    isRequest: boolean;
    senderId: string;
    receiverId: string;
  }

  export interface Contact {
    _id: string;
    userId: User;
    contactId: User;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }

  const router = useRouter()
  const authStore = useAuthStore()
  const contactStore = useContactStore()
  const userStore = useUserStore()
  const tab = ref<string>('')
  const contacts = ref<User[] | []>([])
  const myContacts = ref<Contact[] | []>([])
  const contactRequests = ref<Contact[] | []>([])
  const myContactsDialogOpen = ref<{
    isOpen: boolean;
    contact: User | null;
  }>({
    isOpen: false,
    contact: null,
  })
  const contactsDialogOpen = ref<{
    isOpen: boolean;
    contact: User | null;
  }>({
    isOpen: false,
    contact: null,
  })
  const contactName = ref<string>('')
  const loading = ref(false)
  
  // Realizando busca pelo nickname diretamente no front end
  const myContactsCache = computed(() => {
    return myContacts.value.filter(contact =>
      contact.contactId.nickname.toLowerCase().includes(contactName.value.toLowerCase()) || contact.contactId.name.toLowerCase().includes(contactName.value.toLowerCase())
    )
  })

  async function findAllMyContacts() {
    if (contactName.value == null) contactName.value = ''
    
    loading.value = true
    const response = await contactStore.findAllMyContacts(authStore.userAuth._id, contactName.value)
    myContacts.value = response
    loading.value = false
  }

  async function findAllContacts() {
    // evita que contactName seja null quando clicar no clearable do textField
    if (contactName.value == null) contactName.value = ''

    loading.value = true
    const response = await userStore.findAll(contactName.value)
    contacts.value = response
    
    // Atualiza a lista de contatos com o status de contato salvo (isContactSaved)
    contacts.value.map((contact) => {
      contact.isContactSaved = myContacts.value.some(myContact => myContact.contactId._id === contact._id)
    })

    // Atualiza a lista de contatos com o status de solicitação (isRequest)
    contacts.value.map((contact) => {
      contact.isRequest = contactRequests.value.some(contactRequest => {
        // if (contactRequest.userId._id === contact._id || contactRequest.contactId._id === contact._id) return true
        if (contactRequest.userId._id === contact._id) {
          contact.senderId = contactRequest.userId._id
          contact.receiverId = contactRequest.contactId._id
          return true
        }

        if (contactRequest.contactId._id === contact._id) {
          contact.senderId = contactRequest.userId._id
          contact.receiverId = contactRequest.contactId._id
          return true
        }
      })

      if (contact._id === authStore.userAuth._id) contact.isRequest = false
    })
    loading.value = false
  }

  async function findMyContactsRequests() {
    loading.value = true
    const myContactsRequests = await contactStore.findMyContactsRequests(authStore.userAuth._id)
    contactRequests.value = myContactsRequests
    loading.value = false
  }

  watch(tab, () => {
    if (tab.value === 'one') findAllMyContacts()
    if (tab.value === 'two') findAllContacts(); findMyContactsRequests()
    if (tab.value === 'three') findMyContactsRequests()
  })

  onMounted(() => {
    tab.value = "one"
  })
</script>

<style scoped>
@import '@/styles/search.page.css';
</style>