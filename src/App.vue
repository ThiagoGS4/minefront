<script setup lang="ts"></script>

<template>
  <v-app>

  <v-app-bar :elevation="2" rounded>
  <!-- <template v-slot:prepend>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
  </template> adicionar nav icon??-->

  <v-app-bar-title>Adicionar card??</v-app-bar-title>
</v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>
