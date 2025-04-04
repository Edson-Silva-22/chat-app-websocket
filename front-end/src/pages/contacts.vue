<template>
  <v-app>
    <v-main class="v-main">
      <v-tabs
        v-model="tab"
        color="success"
        dark
        slider-color="success"
        height="64"
      >
        <v-tab value="one">Meus Contatos</v-tab>
        <v-tab value="two">Contatos</v-tab>
        <v-tab value="three">Solicitações</v-tab>
      </v-tabs>

      <div class="text-field" v-if="tab != 'three'">
        <v-text-field
          label="Buscar contato"
          variant="solo"
          bg-color="#111a31"
          clearable
          v-model="contactName"
          v-on:update:model-value="findAllContacts"
        ></v-text-field>
      </div>

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
            @click="myContactsDialogOpen.isOpen = !myContactsDialogOpen.isOpen; myContactsDialogOpen.contact = contact.contactId"
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
                myContactsDialogOpen.isOpen = !myContactsDialogOpen.isOpen 
                myContactsDialogOpen.contact = contact
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
                color="success" 
                variant="tonal" 
                append-icon="mdi-account-arrow-right"
                v-if="contact.isContactSaved == false"
              >Solicitar</v-btn>

              <v-btn 
                color="red" 
                variant="tonal" 
                append-icon="mdi-delete"
                v-else
              >Excluir contato</v-btn>
            </div>
          </div>

          <div v-if="contacts.length == 0 && loading == false" class="d-flex flex-column align-center">
            <v-icon icon="mdi-account-cancel" size="64" color="#BDBDBD"></v-icon>
            <p>Nenhum contato encontrado.</p>
          </div>
        </v-tabs-window-item>

        <v-tabs-window-item value="three">
          <div 
            class="contact" 
            v-if="contactRequests.length > 0"
          >
            <p class="secondaryText">Solicitação Enviada</p>
            <div class="avatar">
              <v-avatar
                image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
                size="60"
              ></v-avatar>
              <p>Daniel Silva Santos</p>
            </div>

            <div class="actions">
              <v-btn 
                color="red" 
                variant="tonal" 
                append-icon="mdi-account-arrow-right"
              >Cancelar Solicitação</v-btn>
            </div>
          </div>

          <div 
            class="contact" 
            v-if="contactRequests.length > 0"
          >
            <p class="secondaryText">Solicitação Recebida</p>
            <div class="avatar">
              <v-avatar
                image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
                size="60"
              ></v-avatar>
              <p>Carlos@2025</p>
            </div>

            <div class="actions">
              <v-btn 
                color="success"
                variant="tonal" 
                append-icon="mdi-account-arrow-left"
              >Aceitar</v-btn>

              <v-btn 
                color="red" 
                variant="tonal" 
                append-icon="mdi-account-cancel"
              >Recusar</v-btn>
            </div>
          </div>

          <div v-else class="d-flex flex-column align-center">
            <v-icon icon="mdi-account-cancel" size="64" color="#BDBDBD"></v-icon>
            <p>Nenhum contato solicitado.</p>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>

      <v-dialog
        v-model="myContactsDialogOpen.isOpen"
        max-width="400px"
        width="90%"
      >
        <div class="dialogContent">
          <v-avatar
            image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
            size="200"
          ></v-avatar>

          <div class="dialogBody">
            <h2>{{ myContactsDialogOpen.contact?.name }}</h2>
            <p>{{ myContactsDialogOpen.contact?.email }}</p>
            <p>{{ myContactsDialogOpen.contact?.nickname }}</p>
          </div>

          <div class="dialogActions">
            <v-btn 
              color="success" 
              @click="myContactsDialogOpen.isOpen = false"
              variant="tonal"
            >Cancelar</v-btn>
            <v-btn 
              color="red" 
              variant="tonal"
            >Excluir Contato</v-btn>
          </div>
        </div>
      </v-dialog>

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

          <div class="dialogActions">
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
        </div>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { useContactStore } from '@/stores/contact'
  import { useAuthStore } from '@/stores/auth'
  import { useUserStore } from '@/stores/user';

  export interface User {
    _id: string;
    name: string;
    email: string;
    nickname: string;
    createdAt: Date;
    updatedAt: Date;
    isContactSaved: boolean;
  }

  export interface Contact {
    _id: string;
    userId: User;
    contactId: User;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }

  const authStore = useAuthStore()
  const contactStore = useContactStore()
  const userStore = useUserStore()
  const tab = ref<string>('')
  const contacts = ref<User[] | []>([])
  const myContacts = ref<Contact[] | []>([])
  const contactRequests = ref<[]>([1])
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
    loading.value = false
  }

  watch(tab, () => {
    if (tab.value === 'one') findAllMyContacts()
    if (tab.value === 'two') findAllContacts()
  })

  onMounted(() => {
    tab.value = "one"
  })
</script>

<style scoped>
@import '@/styles/contacts.page.css';
</style>