<template>
  <div class="d-flex">
    <div class="divConversation">
      <v-list v-for="item in [1,2,3,4,5,6,7,8,9,10,11,12,13]" class="pa-0">
        <v-list-item 
          height="70" 
          value="1"
          color="success"
          style="background-color: #0c1323;"
        >
          <div class="d-flex ga-3">
            <div class="avatar">
              <v-avatar
                image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
              ></v-avatar>
            </div>
  
            <div class="messagePreview">
              <v-list-item-title>Alex</v-list-item-title>
              <p>E ai tudo bem?</p>
            </div>
  
            <div class="notification">
              <p class="bg-success">2</p>
              <v-list-item-subtitle>10:45</v-list-item-subtitle>
            </div>
          </div>
  
        </v-list-item>
      </v-list>
    </div>
  
    <div class="divMessages">
      <div class="messagesHeader">
        <v-avatar
          image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
        ></v-avatar>

        <div>
          <h3>Alex</h3>
          <p class="text-success">Online</p>
        </div>
      </div>

      <div class="messagesBody">
        <div 
          v-for="(message, index) in messagesList"
          :class="authStore.userAuth?._id == message.sender ? 'messageSend' :  'messageReceived'"
          :key="index"
        >
          <p>{{ message.text }}</p>
          <p class="messageTime">10:45</p>
        </div>
      </div>

      <div class="d-flex justify-center">
        <div class="messagesFooter">
          <v-text-field
            label="receiverId"
            v-model="reactiveId"
          ></v-text-field>
          <v-textarea
            name="name"
            placeholder="Mesagem"
            variant="solo"
            rounded
            hide-details
            v-model="newMessage"
            bg-color="#111a31"
            auto-grow
            rows="1"
            max-rows="3"
            clearable
          ></v-textarea>
  
          <v-btn 
            color="success" 
            icon="mdi-send"
            width="56"
            height="56"
            @click="sendMessage"
          ></v-btn>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
  import socketClient from '@/plugins/socketClient';
  import { useAuthStore } from '@/stores/auth';

  export interface Message {
    _id: string;
    sender: string;
    receiver: string;
    text: string;
    createdAt: Date;
  }

  const authStore = useAuthStore();
  const newMessage = ref<string>('')
  const messagesList = ref<Message[]>([])
  const reactiveId = ref('')

  function sendMessage() {
    socketClient.emitEvent('createMessage', {
      sender: authStore.userAuth._id,
      receiver: reactiveId.value,
      text: newMessage.value,
    })

    newMessage.value = ''
  }

  // Função para atualizar a lista de mensagens
  function setMessagesList(data: Message[] | Message) {
    if (Array.isArray(data) && data?.length > 0) messagesList.value = data

    else if (!Array.isArray(data)) messagesList.value.push(data)
  }
  
  onMounted(async () => {
    // Conectando-se ao socket com o namespace messages
    socketClient.connect('messages')

    // Emitindo um evento para buscar todas as mensagens
    socketClient.emitEvent('findAllMessages')

    // Subscrevendo o evento de retorno de todas as mensagens para atualizar a lista de mensagens
    socketClient.subscribeEvent('messagesList', setMessagesList)

    // Emitindo evento para que o usuário entre na sua sala individual
    socketClient.emitEvent('joinRoom', authStore.userAuth._id)

    // Emitindo evento para buscar a nova message enviada pelo usuário
    socketClient.subscribeEvent('sendNewMessage', setMessagesList)

    // Emitindo evento para buscar as mensagens da sala individual do usuário
    socketClient.subscribeEvent('receiveNewMessage', setMessagesList)
  })

  onUnmounted(() => {
    // Desinscrevendo de todos os eventos
    socketClient.unsubscribeAllEvents()
    // Desconectando-se do socket com o namespace messages
    socketClient.disconnect()
  })
</script>

<style scoped>
@import '@/styles/conversations.page.css';
</style>