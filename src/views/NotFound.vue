<template>
  <div class="not-found-container">
    <h1>404</h1>
    <p>Página não encontrada.</p>
    <router-link to="/home">
      <v-btn color="primary" class="mt-4">Voltar ao início</v-btn>
    </router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found-container {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
h1 {
  font-size: 5rem;
  font-weight: 700;
  color: #1976d2;
}
p {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}
</style>
