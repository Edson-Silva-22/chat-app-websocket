<template>
  <Header page-title="Notificações"></Header>
  <v-main class="v-main">
    <div class="containerNotification">
      <div class="notification" v-ripple v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]">
        <p class="titleNotification">Solicitação Recebida</p>
        <p class="descriptionNotification"><span>Alex@Sam</span> enviou uma solicitação de contato.</p>
      </div>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';

</script>

<style scoped>
@import '@/styles/notifications.page.css';
</style>