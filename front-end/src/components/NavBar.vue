<template>
  <v-navigation-drawer 
    permanent 
    rail
    location="bottom"
  >
    <v-list height="64" class="pa-0">
      <div class="d-flex justify-center">
        <v-list-item 
          v-for="(item, index) in itemsMenu"
          :value="item.value"
          color="blue"
          :key="index"
          @click="emits('definePageTitle', item.title)"
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
  const display = useDisplay();
  const itemsMenu = ref([
    {
      icon:'mdi-view-dashboard',
      title: 'Publicações',
      value: 'publications',
      route: '/publications'
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
</script>

<style scoped>

</style>