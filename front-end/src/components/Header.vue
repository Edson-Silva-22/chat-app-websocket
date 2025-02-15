<template>
  <v-app-bar :elevation="2" color="#080c16">
    <template v-slot:prepend>
      <p class="header-logo">Talk <v-icon icon="mdi-message-text" color="success"></v-icon> Flow</p>
    </template>

    <template v-slot:append>
      <v-avatar
        color="red"
        image="@/assets/pexels-danxavier-1121796.jpg"
      ></v-avatar>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn 
            color="success" 
            icon="mdi-cog"
            variant="tonal"
            class="ml-2"
            v-bind="props"
          ></v-btn>
        </template>

        <v-list style="background-color: #080c16;">
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :value="index"
            @click="items[index].onClick"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <v-app-bar-title>{{ props.pageTitle }}</v-app-bar-title>
  </v-app-bar>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';

  const props = defineProps<{
    pageTitle: string
  }>()

  const router = useRouter();
  const authStore = useAuthStore();
  const items = ref([
    { 
      title: 'Settings',
      onClick: () => null
    },
    { 
      title: 'Logout',
      onClick: () => {
        authStore.logout();
        router.push('/login');
      }
    }
  ])
</script>

<style scoped>
  .header-logo{
    font-size: 20px;
    font-weight: 600;
    color: #d2d7e6;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border: solid rgba(var(--v-theme-success)) 1px;
    border-radius: 5px;
    height: 100%;
    width: 150px;
  }
</style>