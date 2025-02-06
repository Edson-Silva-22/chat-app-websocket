<template>
  <Header :page-title="pageTitle"></Header>

  <v-main>
    <router-view />
  </v-main>

  <NavBar @define-page-title="(title:string) => pageTitle = title"></NavBar>
 
  <AppFooter />
</template>

<script lang="ts" setup>
  import Header from '@/components/Header.vue';
  import NavBar from '@/components/NavBar.vue';
  
  const pageTitle = ref<string>('Publicações')
</script>
