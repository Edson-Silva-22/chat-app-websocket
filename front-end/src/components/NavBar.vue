<template>
  <v-navigation-drawer 
    permanent 
    rail
    location="bottom"
    color="#080c16"
    class="border-0"
  >
    <v-list height="64" class="pa-0">
      <div class="d-flex justify-center">
        <v-list-item 
          v-for="(item, index) in itemsMenu"
          :value="item.value"
          color="success"
          :key="index"
          :active="selectedItemMenu == item.value"
          @click="emits('definePageTitle', item.title); selectedItemMenu = item.value"
          :to="item.route"
          height="64"
          width="100"
          class="d-flex align-center justify-center ma-0"
        >
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useDisplay } from 'vuetify'

  const emits = defineEmits(['definePageTitle'])
  const itemsMenu = ref([
    {
      icon:'mdi-view-dashboard',
      title: 'Publicações',
      value: 'publications',
      route: '/'
    },

    {
      icon:'mdi-chat',
      title: 'Conversas',
      value: 'conversations',
      route: '/conversations'
    },

    {
      icon:'mdi-account-group',
      title: 'Contatos',
      value: 'contacts',
      route: '/contacts'
    },
  ])
  const selectedItemMenu = ref<string>('publications')
</script>

<style scoped>

</style>