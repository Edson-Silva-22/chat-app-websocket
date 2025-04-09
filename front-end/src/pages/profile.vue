<template>
  <v-app style="overflow-y: scroll !important; height: 100vh;">
    <header>
      <div class="userInfo">
        <div>
          <v-avatar
            image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
            size="250"
          ></v-avatar>
        </div>
  
        <div>
          <p class="text-h5">Edson@Samghghg</p>
          <p class="text-h6" style="color: #264594;">Edson Silva</p>
          <p class="text-h6" style="color: #264594;">edson@gmail.com</p>
          <div class="actions">
            <p style="color: #264594;">Solicitação Recebida</p>
            <div>
              <v-btn 
                color="success" 
                variant="tonal" 
                class="text-subtitle-1 mr-2"
              >Mensagem</v-btn>
    
              <v-btn 
                color="red" 
                variant="tonal" 
                class="text-subtitle-1"
              >Excluir Contato</v-btn>
            </div>
          </div>
        </div>
      </div>

      <v-tabs
        color="success"
        slider-color="success"
        height="64"
        class="w-100"
        show-arrows
        align-tabs="center"
      >
        <v-tab value="one" class="tab">
          <v-icon icon="mdi-view-dashboard" size="32px"></v-icon>
        </v-tab>

        <v-tab value="two" class="tab">
          <v-icon icon="mdi-play-box-multiple" size="32px"></v-icon>
        </v-tab>
        <v-tab value="three" class="tab">
          <v-icon icon="mdi-image-multiple" size="32px"></v-icon>
        </v-tab>
      </v-tabs>
    </header>

    <main>
      <div class="publication" v-for="item in [1,2,3,4,5]">
        <div class="publicationHeader">
          <v-avatar
            image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
            size="50"
          ></v-avatar>

          <p class="text-h6">Edson@Sam</p>
        </div>

        <div class="publicationBody">
          <v-img
            width="100%"
            cover
            lazy-src="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
            src="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
            rounded
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  color="success"
                  indeterminate
                ></v-progress-circular>
              </div>
            </template>
          </v-img>

          <p class="description">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis sit incidunt repellat! Tenetur quod distinctio facere harum neque ipsam. Aspernatur expedita molestias eveniet necessitatibus deserunt quas delectus hic recusandae porro!</p>
        </div>

        <div class="publicationFooter">
          <div>
            <div>
              <v-icon icon="mdi-heart-outline" size="32"></v-icon>
              <span>150</span>
            </div>

            <div>
              <v-icon icon="mdi-chat-outline" size="32"></v-icon>
              <span>11 mil</span>
            </div>
          </div>

          <span>9 de abril</span>
        </div>
      </div>
    </main>
  </v-app>
</template>

<style scoped>
@import '@/styles/profile.page.css';
</style>