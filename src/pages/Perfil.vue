<template>
  <v-main>
    <v-container class="py-6">
      <!-- Barra de navegação superior -->
      <v-app-bar>
        <v-btn icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>Perfil do Usuário</v-toolbar-title>
      </v-app-bar>

      <!-- Card de Perfil -->
      <v-card class="mx-auto mt-6 pa-4" max-width="500">
        <div class="d-flex align-center mb-4">
          <!-- Avatar com letra inicial -->
          <v-avatar color="blue" size="56">
            <span class="white--text text-h5">{{ avatarInitial }}</span>
          </v-avatar>
          <div class="ml-4">
            <h2 class="text-h6 mb-1">{{ user.nome }}</h2>
            <p class="text-subtitle-2 grey--text">{{ user.email }}</p>
          </div>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- Informações adicionais -->
        <v-row>
          <v-col cols="6">
            <strong>ID</strong>
            <div class="text-caption">{{ user.id }}</div>
          </v-col>

          <v-col cols="6">
            <strong>Coins</strong>
            <div class="text-subtitle-1 text-success">1.000</div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <strong>Criado em</strong>
            <div class="text-caption">{{ formatDate(user.data_criacao) }}</div>
          </v-col>

          <v-col cols="6">
            <strong>Atualizado em</strong>
            <div class="text-caption">{{ formatDate(user.data_atualizacao) }}</div>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { getUser } from "../api/authService";

export default {
  name: "Perfil",
  data() {
    return {
      user: {
        id: "",
        nome: "",
        email: "",
        data_criacao: "",
        data_atualizacao: "",
      },
    };
  },
  computed: {
    avatarInitial(): string {
      return this.user.nome ? this.user.nome.charAt(0).toUpperCase() : "?";
    },
  },
  methods: {
    async fetchUser() {
      const userData = await getUser();
      this.user = {
        id: userData.id,
        nome: userData.nome || "Usuário",
        email: userData.email,
        data_criacao: userData.data_criacao,
        data_atualizacao: userData.data_atualizacao,
      };
    },
    formatDate(timestamp: string): string {
      const date = new Date(timestamp);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  created() {
    this.fetchUser();
  },
};
</script>
