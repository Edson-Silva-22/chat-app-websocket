<template>
  <v-app>
    <v-main class="v-main">
      <v-tabs
        v-model="tab"
        color="success"
        dark
        slider-color="success"
        height="64"
      >
        <v-tab value="one">Meus Contatos</v-tab>
        <v-tab value="two">Contatos</v-tab>
        <v-tab value="three">Solicitações</v-tab>
      </v-tabs>

      <div class="text-field" v-if="tab != 'three'">
        <v-text-field
          name="name"
          label="Buscar contato"
          id="id"
          variant="solo"
          bg-color="#111a31"
          clearable
        ></v-text-field>
      </div>

      <v-tabs-window v-model="tab" class="tabWindow">
        <v-tabs-window-item value="one">
          <div 
            class="contact" 
            v-for="item in [1,2,3,4,5,6,7]"
            v-if="myContacts.length > 0"
            @click="myContactsDialogOpen = !myContactsDialogOpen"
          >
            <div class="avatar">
              <v-avatar
                image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
                size="60"
              ></v-avatar>
              <p>Daniel@Sam</p>
            </div>

            <div class="actions">
              <v-btn 
                color="red" 
                variant="tonal" 
                append-icon="mdi-delete"
              >Excluir contato</v-btn>
            </div>
          </div>

          <div v-else class="d-flex flex-column align-center">
            <v-icon icon="mdi-account-cancel" size="64" color="#BDBDBD"></v-icon>
            <p>Nenhum contato salvo.</p>
          </div>
        </v-tabs-window-item>

        <v-tabs-window-item value="two">
          <div 
            class="contact" 
            v-for="item in [1,2,3,4,5,6,7]"
            v-if="contacts.length > 0"
            @click="contactsDialogOpen = !contactsDialogOpen"
          >
            <div class="avatar">
              <v-avatar
                image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
                size="60"
              ></v-avatar>
              <p>Daniel@Sam</p>
            </div>

            <div class="actions">
              <v-btn 
                color="success" 
                variant="tonal" 
                append-icon="mdi-account-arrow-right"
              >Solicitar</v-btn>
            </div>
          </div>

          <div v-else class="d-flex flex-column align-center">
            <v-icon icon="mdi-account-cancel" size="64" color="#BDBDBD"></v-icon>
            <p>Nenhum contato encontrado.</p>
          </div>
        </v-tabs-window-item>

        <v-tabs-window-item value="three">
          <div 
            class="contact" 
            v-if="contactRequests.length > 0"
          >
            <p>Solicitação Enviada</p>
            <div class="avatar">
              <v-avatar
                image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
                size="60"
              ></v-avatar>
              <p>Daniel Silva Santos</p>
            </div>

            <div class="actions">
              <v-btn 
                color="red" 
                variant="tonal" 
                append-icon="mdi-account-arrow-right"
              >Cancelar Solicitação</v-btn>
            </div>
          </div>

          <div 
            class="contact" 
            v-if="contactRequests.length > 0"
          >
            <p>Solicitação Recebida</p>
            <div class="avatar">
              <v-avatar
                image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
                size="60"
              ></v-avatar>
              <p>Carlos@2025</p>
            </div>

            <div class="actions">
              <v-btn 
                color="success"
                variant="tonal" 
                append-icon="mdi-account-arrow-left"
              >Aceitar</v-btn>

              <v-btn 
                color="red" 
                variant="tonal" 
                append-icon="mdi-account-cancel"
              >Recusar</v-btn>
            </div>
          </div>

          <div v-else class="d-flex flex-column align-center">
            <v-icon icon="mdi-account-cancel" size="64" color="#BDBDBD"></v-icon>
            <p>Nenhum contato solicitado.</p>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>

      <v-dialog
        v-model="myContactsDialogOpen"
        max-width="400px"
        width="90%%"
      >
        <div class="dialogContent">
          <v-avatar
            image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
            size="200"
          ></v-avatar>

          <div class="dialogBody">
            <h2>Daniel Silva</h2>
            <p>daniel@example.com</p>
            <p>AlexSamm</p>
          </div>

          <div class="dialogActions">
            <v-btn 
              color="success" 
              @click="myContactsDialogOpen = false"
              variant="tonal"
            >Cancelar</v-btn>
            <v-btn 
              color="red" 
              variant="tonal"
            >Excluir Contato</v-btn>
          </div>
        </div>
      </v-dialog>

      <v-dialog
        v-model="contactsDialogOpen"
        max-width="400px"
        width="90%"
      >
        <div class="dialogContent">
          <v-avatar
            image="@/assets/pexels-justin-shaifer-501272-1222271.jpg"
            size="200"
          ></v-avatar>

          <div class="dialogBody">
            <h2>Daniel Silva</h2>
            <p>daniel@example.com</p>
            <p>AlexSamm</p>
          </div>

          <div class="dialogActions">
            <v-btn 
              color="success" 
              variant="tonal"
              >Solicitar Contato</v-btn>
              <v-btn 
              color="red" 
              @click="contactsDialogOpen = false"
              variant="tonal"
            >Cancelar</v-btn>
          </div>
        </div>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  const tab = ref<string>('one')
  const contacts = ref<[]>([1])
  const myContacts = ref<[]>([1])
  const contactRequests = ref<[]>([1])
  const myContactsDialogOpen = ref(false)
  const contactsDialogOpen = ref(false)
</script>

<style scoped>
@import '@/styles/contacts.page.css';
</style>