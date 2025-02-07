<template>
  <div class="d-flex">
    <div class="divConversation">
      <v-list v-for="item in [1,2,3,4,5,6,7,8,9,10,11,12,13]" class="pa-0">
        <v-list-item 
          height="70" 
          value="1"
          color="blue"
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
              <p class="bg-blue">2</p>
              <v-list-item-subtitle>10:45</v-list-item-subtitle>
            </div>
          </div>
  
        </v-list-item>
      </v-list>
    </div>
  
    <div class="divMessages">
      <div class="messagesHeader bg-blue">
        <v-avatar
          image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
        ></v-avatar>

        <div>
          <h3>Alex</h3>
          <p class="">Online</p>
        </div>
      </div>

      <div class="messagesBody">
        <div class="messageSend mb-5">
          <p>Olá, tudo bem?</p>
          <p class="messageTime">10:45</p>
        </div>

        <div class="messageReceived">
          <p>Como você está?Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis dolor ducimus unde illo beatae nisi aspernatur, totam pariatur, commodi eligendi dolorum dolores. Commodi quae soluta</p>
          <p class="messageTime">10:46</p>
        </div>

        <div class="messageSend">
          <p>To ligado</p>
          <p class="messageTime">10:48</p>
        </div>

        <div class="messageSend mb-5">
          <p>Olá, tudo bem?</p>
          <p class="messageTime">10:45</p>
        </div>

        <div class="messageReceived">
          <p>Como você está?Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis dolor ducimus unde illo beatae nisi aspernatur, totam pariatur, commodi eligendi dolorum dolores. Commodi quae soluta</p>
          <p class="messageTime">10:46</p>
        </div>

        <div class="messageSend">
          <p>To ligado</p>
          <p class="messageTime">10:48</p>
        </div>

        <div class="messageSend mb-5">
          <p>Olá, tudo bem?</p>
          <p class="messageTime">10:45</p>
        </div>

        <div class="messageReceived">
          <p>Como você está?Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis dolor ducimus unde illo beatae nisi aspernatur, totam pariatur, commodi eligendi dolorum dolores. Commodi quae soluta</p>
          <p class="messageTime">10:46</p>
        </div>

        <div class="messageSend">
          <p>To ligado</p>
          <p class="messageTime">10:48</p>
        </div>
      </div>

      <div class="d-flex justify-center">
        <div class="messagesFooter">
          <v-text-field
            name="name"
            placeholder="Mesagem"
            variant="solo"
            rounded
            hide-details
            v-model="newMessage"
          ></v-text-field>
  
          <v-btn 
            color="blue" 
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

  const newMessage = ref<string>('')

  function sendMessage() {
    socketClient.emitEvent('createMessage', {
      sender: '67a524378b46ee082a70dfb2',
      receiver: '67a524b28b46ee082a70dfb6',
      text: newMessage.value,
    })
  }

  function findAllMessages() {
    socketClient.emitEvent('findAllMessages')
    socketClient.subscribeEvent('messagesList', (data) => console.log(data))
  }
  

  onMounted(() => {
    socketClient.connect('messages')
    findAllMessages()
  })
</script>

<style scoped>
@import '@/styles/conversations.page.css';
</style>