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
            @click="router.push(`/profile/${contact.contactId._id}`)"
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
            @click="router.push(`/profile/${contact._id}`)"
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
          </div>

          <div v-if="contacts.length == 0 && loading == false" class="d-flex flex-column align-center">
            <v-icon icon="mdi-account-cancel" size="64" color="#BDBDBD"></v-icon>
            <p>Nenhum contato encontrado.</p>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
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
    contactRequest: {
      isRequest: boolean;
      senderId: string;
      receiverId: string;
    }
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
    
    loading.value = false
  }

  watch(tab, () => {
    if (tab.value === 'one') findAllMyContacts()
    if (tab.value === 'two') findAllContacts();
  })

  onMounted(() => {
    tab.value = "one"
  })
</script>

<style scoped>
@import '@/styles/search.page.css';
</style>