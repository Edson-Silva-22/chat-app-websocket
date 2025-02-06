<template>
  <v-app-bar :elevation="2">
    <template v-slot:prepend>
      <v-btn 
        color="blue" 
        icon="mdi-wechat"
        variant="outlined"
      ></v-btn>
    </template>

    <template v-slot:append>
      <v-avatar
        color="red"
        image="@/assets/pexels-danxavier-1121796.jpg"
      ></v-avatar>

      <v-btn 
        color="blue" 
        icon="mdi-cog"
        variant="tonal"
        class="ml-2"
      ></v-btn>
    </template>

    <v-app-bar-title>{{ props.pageTitle }}</v-app-bar-title>
  </v-app-bar>
</template>

<script setup lang="ts">
  const props = defineProps<{
    pageTitle: string
  }>()
</script>