<template>
  <v-app-bar :elevation="2" color="#080c16" class="mx-2">
    <template v-slot:prepend v-if="display.width.value > 768">
      <p class="header-logo">Talk <v-icon icon="mdi-message-text" color="success"></v-icon> Flow</p>
    </template>

    <template v-slot:append>
      <v-btn icon to="/notifications">
        <v-badge 
          v-if="notificationsBadge?.isNotification"
          color="success"
          floating
          dot
          v-bind="props"
        >
          <v-icon icon="mdi-bell" size="24"></v-icon>
        </v-badge>
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn 
            icon="mdi-cog"
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

    <v-btn 
      icon="mdi-arrow-left" 
      variant="text"
      v-if="props.pageTitle === 'Notificações'"
      @click="router.back()"
    ></v-btn>
    <v-app-bar-title class="ma-0">{{ props.pageTitle }}</v-app-bar-title>
  </v-app-bar>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  import { useDisplay } from 'vuetify';
  import socketClient from '@/plugins/socketClient';

  const display = useDisplay();
  const props = defineProps<{
    pageTitle: string
  }>()

  const notificationsBadge = ref<{
      isNotification: boolean
      notificationsCount: (notifications: number) => string
    } | null>({
      isNotification: true,
      notificationsCount: (notifications:number) => {
        if(notifications > 99) return "99+"
        return notifications.toString()
      }
    })
  const router = useRouter();
  const authStore = useAuthStore();
  const items = ref([
    { 
      title: 'Perfil',
      onClick: () => router.push(`/profile/${authStore.userAuth._id}`)
    },
    { 
      title: 'Sair',
      onClick: () => {
        authStore.logout();
        router.push('/login');
      }
    }
  ])
  const notifications = ref([])

  function setNotification(data: [] | any) {
    notifications.value = data
  }

  onMounted(() => {
    // Conectando-se ao socket com o namespace contacts
    socketClient.connect('contacts')

    // Emitindo evento para que o usuário entre na sua sala individual
    socketClient.emitEvent('joinRoom', authStore.userAuth._id)

    socketClient.subscribeEvent('contactRequest', setNotification)
  })
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
    height: 90%;
    padding: 0 10px;
    margin-right: 10px;
  }
</style>