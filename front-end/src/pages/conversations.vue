<template>
  <div class="d-flex">
    <div class="divConversation">
      <v-list class="pa-0">
        <v-list-item 
          v-for="(contact, index) in contacts"
          height="80" 
          :value="contact.contactId._id"
          color="success"
          style="background-color: #0c1323;"
          :key="contact.contactId._id"
          :active="selectedContact?.contactId === contact.contactId"
          @click="selectedContact = contact; findAllMessages()"
        >
          <div class="d-flex ga-3">
            <div class="avatar">
              <v-avatar
                image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
              ></v-avatar>
            </div>
  
            <div class="messagePreview">
              <v-list-item-title>{{ contact.contactId.name }}</v-list-item-title>
               <p>{{ contact.lastMessage }}</p>
            </div>
  
            <div class="notification">
              <p class="bg-success">2</p>
              <v-list-item-subtitle style="font-size: 12px;">{{ contact.lastMessageTime }}</v-list-item-subtitle>
            </div>
          </div>
  
        </v-list-item>
      </v-list>
    </div>
  
    <div v-if="selectedContact" class="divMessages">
      <div class="messagesHeader">
        <v-avatar
          image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
        ></v-avatar>

        <div>
          <h3>{{ selectedContact?.contactId.name }}</h3>
          <p class="text-success">Online</p>
        </div>
      </div>

      <div v-if="messagesList.length > 0" class="messagesBody">
        <div 
          v-for="(message, index) in messagesList"
          :class="authStore.userAuth?._id == message.sender ? 'messageSend' :  'messageReceived'"
          :key="index"
        >
          <p>{{ message.text }}</p>
          <p class="messageTime">{{ message.createdAt }}</p>
        </div>
      </div>

      <div v-else class="messagesBody d-flex flex-column justify-center align-center">
        <v-icon icon="mdi-message-minus" size="64" color="#BDBDBD"></v-icon>
        <p style="color: #BDBDBD;">Nenhuma mensagem</p>
      </div>

      <div class="d-flex justify-center">
        <div class="messagesFooter">
          <v-textarea
            name="name"
            placeholder="Mensagem"
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

    <div v-else class="divMessages d-flex flex-column justify-center align-center">
      <v-icon icon="mdi-message-text" size="64" color="#BDBDBD"></v-icon>
      <p style="color: #BDBDBD;">Área de Mensagens</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import socketClient from '@/plugins/socketClient';
  import { useAuthStore } from '@/stores/auth';
  import { useContactStore } from '@/stores/contact';
  import { format } from 'date-fns-tz'

  export interface Message {
    _id: string;
    sender: string;
    receiver: string;
    text: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface Contact {
    _id: string;
    userId: {
      _id: string;
      name: string;
    };
    contactId: {
      _id: string;
      name: string;
    }
    lastMessage?: string;
    lastMessageTime?: string;
  }

  const authStore = useAuthStore();
  const contactStore = useContactStore();
  const newMessage = ref<string>('')
  const messagesList = ref<Message[]>([])
  const contacts = ref<Contact[]>([])
  const selectedContact = ref<Contact>()

  function sendMessage() {
    socketClient.emitEvent('createMessage', {
      sender: authStore.userAuth._id,
      receiver: selectedContact.value?.contactId._id,
      text: newMessage.value,
    })

    newMessage.value = ''
  }

  function findAllMessages() {
    // Emitindo um evento para buscar todas as mensagens
    socketClient.emitEvent('findAllMessages', {
      userId: authStore.userAuth._id,
      contactId: selectedContact.value?.contactId._id,
    })
  }

  // Função para atualizar a lista de mensagens
  function setMessagesList(data: Message[] | Message) {
    
    // Quando todas as mensagens são carregadas
    if (Array.isArray(data) && data?.length > 0) {
      messagesList.value = []
      data.map((item: Message) => {
        // Formatar a data para mostrar na tela (HH:mm)
        const formatDataCreatedAt = new Date(item.createdAt)
        const formatDataUpdate = new Date(item.updatedAt)
        
        messagesList.value.push({
          _id: item._id,
          sender: item.sender,
          receiver: item.receiver,
          text: item.text,
          createdAt: `${formatDataCreatedAt.getHours()}:${formatDataCreatedAt.getMinutes() < 10 ? formatDataCreatedAt.getMinutes() + '0' : formatDataCreatedAt.getMinutes()}`,
          updatedAt: `${formatDataUpdate.getHours()}:${formatDataUpdate.getMinutes() < 10 ? formatDataUpdate.getMinutes() + '0' : formatDataUpdate.getMinutes()}`
        })
      })
    }

    // Quando uma nova mensagem é enviada
    else if (!Array.isArray(data)) {
      messagesList.value.push({
        _id: data._id,
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
        createdAt: format(new Date(data.createdAt), 'HH:mm'),
        updatedAt: format(new Date(data.updatedAt), 'HH:mm')
      })
    }
  }

  async function findMyContacts() {
    const response = await contactStore.findAllMyContacts(authStore.userAuth._id)
    contacts.value = response.map((contact: Contact) => ({
     ...contact,
      lastMessageTime: format(new Date(response[0].lastMessageTime), 'HH:mm'),
    }))
  }
  
  onMounted(async () => {
    // Conectando-se ao socket com o namespace messages
    socketClient.connect('messages')

    // Emitindo evento para que o usuário entre na sua sala individual
    socketClient.emitEvent('joinRoom', authStore.userAuth._id)

    // Emitindo um evento para buscar todas as mensagens
    //socketClient.emitEvent('findAllMessages', authStore.userAuth._id)

    // Subscrevendo o evento de retorno de todas as mensagens para atualizar a lista de mensagens
    socketClient.subscribeEvent('messagesList', setMessagesList)

    // Emitindo evento para buscar a nova message enviada pelo usuário
    socketClient.subscribeEvent('sendNewMessage', setMessagesList)

    // Emitindo evento para buscar as mensagens da sala individual do usuário
    socketClient.subscribeEvent('receiveNewMessage', setMessagesList)

    // Buscando os contatos do usuário
    await findMyContacts()
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