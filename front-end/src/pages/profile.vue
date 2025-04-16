<template>
  <v-app style="overflow-y: scroll !important; height: 100vh;">
    <header>
      <v-btn 
        class="btnBack" 
        variant="text" 
        icon="mdi-arrow-left"
        @click="router.back()"
      ></v-btn>
      <div class="userInfo">
        <div>
          <v-avatar
            image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
            size="250"
          ></v-avatar>
        </div>
  
        <div>
          <p class="text-h5">{{ user?.contact.nickname }}</p>
          <p class="text-h6" style="color: #264594;">{{ user?.contact.name }}</p>
          <p class="text-h6" style="color: #264594;">{{ user?.contact.email }}</p>
          <div class="actions">
            <p 
              style="color: #264594;" 
              v-if="userId != authStore.userAuth._id && user?.isContactSaved == false && user.contactRequest.isRequest && user.contactRequest.senderId == authStore.userAuth._id"
            >Solicitação Enviada</p>

            <p 
              style="color: #264594;" 
              v-if="user?.isContactSaved == false && user.contactRequest.isRequest && user.contactRequest.receiverId == authStore.userAuth._id"
            >Solicitação Recebida</p>
 
            <div v-if="userId != authStore.userAuth._id && user?.isContactSaved == false && user.contactRequest.isRequest && user.contactRequest.senderId == authStore.userAuth._id">
              <v-btn 
                color="red" 
                variant="tonal" 
                class="text-subtitle-1"
              >Cancelar Solicitação</v-btn>
            </div>

            <div v-if="user?.isContactSaved == false && user.contactRequest.isRequest && user.contactRequest.receiverId == authStore.userAuth._id">
              <v-btn 
                color="success" 
                variant="tonal" 
                class="text-subtitle-1 mr-2"
              >Aceitar</v-btn>
    
              <v-btn 
                color="red" 
                variant="tonal" 
                class="text-subtitle-1"
              >Recusar</v-btn>
            </div>

            <div v-if="user?.isContactSaved">
              <v-btn 
                color="success" 
                variant="tonal" 
                class="text-subtitle-1 mr-2"
              >Mensagem</v-btn>
    
              <v-btn 
                color="red" 
                variant="tonal" 
                class="text-subtitle-1"
              >Excluir Contato</v-btn>
            </div>

            <div v-if="user?.isContactSaved == false && user.contactRequest.isRequest == false">
              <v-btn 
                color="success" 
                variant="tonal" 
                class="text-subtitle-1"
                @click="createContactRequest(user.contact._id)"
              >Solicitar Contato</v-btn>
            </div>
          </div>
        </div>
      </div>

      <v-tabs
        color="success"
        slider-color="success"
        height="64"
        class="w-100"
        show-arrows
        align-tabs="center"
      >
        <v-tab value="one" class="tab">
          <v-icon icon="mdi-view-dashboard" size="32px"></v-icon>
        </v-tab>

        <v-tab value="two" class="tab">
          <v-icon icon="mdi-play-box-multiple" size="32px"></v-icon>
        </v-tab>
        <v-tab value="three" class="tab">
          <v-icon icon="mdi-image-multiple" size="32px"></v-icon>
        </v-tab>
      </v-tabs>
    </header>

    <main>
      <div class="publication" v-for="item in [1,2,3,4,5]">
        <div class="publicationHeader">
          <v-avatar
            image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
            size="50"
          ></v-avatar>

          <p class="text-h6">Edson@Sam</p>
        </div>

        <div class="publicationBody">
          <v-img
            width="100%"
            cover
            lazy-src="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
            src="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
            rounded
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  color="success"
                  indeterminate
                ></v-progress-circular>
              </div>
            </template>
          </v-img>

          <p class="description">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis sit incidunt repellat! Tenetur quod distinctio facere harum neque ipsam. Aspernatur expedita molestias eveniet necessitatibus deserunt quas delectus hic recusandae porro!</p>
        </div>

        <div class="publicationFooter">
          <div>
            <div>
              <v-icon icon="mdi-heart-outline" size="32"></v-icon>
              <span>150</span>
            </div>

            <div>
              <v-icon icon="mdi-chat-outline" size="32"></v-icon>
              <span>11 mil</span>
            </div>
          </div>

          <span>9 de abril</span>
        </div>
      </div>
    </main>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import type { User } from './search.vue';
import socketClient from '@/plugins/socketClient';

  export interface Contact {
    contact: User,
    isContactSaved: boolean;
    contactRequest: {
      isRequest: boolean;
      senderId: string;
      receiverId: string;
    }
  }

  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const authStore = useAuthStore()
  const user = ref<Contact | null>(null)
  let { userId } = route.params as { userId: string }
  const loading = ref(false)

  async function findOneUser(userId: string) {
    const response = await userStore.findOne(userId)
    user.value = response
  }

  async function createContactRequest(contactId: string) {
    loading.value = true
    socketClient.emitEvent('createContactRequest', {userId:authStore.userAuth._id, contactId})
    loading.value = false
  }
  
  onMounted(async () => {
    await findOneUser(userId)
  })
</script>

<style scoped>
@import '@/styles/profile.page.css';
</style>