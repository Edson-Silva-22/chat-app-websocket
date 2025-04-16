<template>
  <v-navigation-drawer 
    permanent 
    rail
    location="bottom"
    color="#080c16"
    class="border-0"
  >
    <div class="menuContainer">
      <div 
        v-for="(item, index) in itemsMenu"
        :class="{'itemMenu':true, 'selectedTab': selectedItemMenu == item.value}"
        :key="index"
        @click="itemMenuCliked(item)"
        v-ripple
      >
        <v-badge 
          v-if="item.notifications?.isNotification"
          :content="item.notifications.notificationsCount(100)"
          color="success"
          floating
        >
          <v-icon>{{ item.icon }}</v-icon>
        </v-badge>

        <v-icon v-else>{{ item.icon }}</v-icon>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

  export interface ItemMenu {
    icon: string
    title: string
    value: string
    route: string
    notifications?: {
      isNotification: boolean
      notificationsCount: (notifications: number) => string
    }
  }

  const router = useRouter()
  const emits = defineEmits(['definePageTitle'])
  const itemsMenu = ref<ItemMenu[]>([
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
      route: '/conversations',
      notifications: {
        isNotification: true,
        notificationsCount: (notifications:number) => {
          if(notifications > 99) return "99+"
          return notifications.toString()
        }
      }
    },

    {
      icon:'mdi-magnify',
      title: 'Buscar',
      value: 'search',
      route: '/search'
    },

    {
      icon:'mdi-plus-box-outline',
      title: 'Notificações',
      value: 'create',
      route: '/create'
    },
  ])
  const selectedItemMenu = ref<string>('publications')

  function itemMenuCliked(itemMenu: any) {
    emits('definePageTitle', itemMenu.title); 
    selectedItemMenu.value = itemMenu.value;
    localStorage.setItem('selectedMenuItem', JSON.stringify({
      value: itemMenu.value,
      title: itemMenu.title,
      route: itemMenu.route
    }))
    router.push(itemMenu.route)
  }

  onMounted(() => {
    const savedselectedItemMenu = localStorage.getItem('selectedMenuItem')

    if (savedselectedItemMenu) {
      const formatJson = JSON.parse(savedselectedItemMenu)
      selectedItemMenu.value = formatJson.value
      emits('definePageTitle', formatJson.title);
    }
  })
</script>

<style scoped>
  .menuContainer{
    height: 64px;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
  
  .itemMenu{
    height: 100%;
    width: calc(100% / 4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .itemMenu:hover{
    background-color: rgba(255, 255, 255, 0.030);
  }

  .selectedTab{
    background-color: #10201D;
    color: #4CAE50;
  }

  .selectedTab:hover{
    background-color: #12221f;
  }
</style>