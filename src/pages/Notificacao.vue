<template>
  <v-main>
    <v-container min-height="75vh">
      <!-- Barra de navegação -->
      <v-app-bar>
        <v-btn icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Notificações</v-toolbar-title>
      </v-app-bar>

      <!-- Campo de pesquisa -->
      <TextForm
        v-model="search"
        label="Pesquisar notificações"
        prependIcon="mdi-magnify"
        class="mb-3"
      />

      <!-- Tabela de notificações -->
      <v-table density="comfortable">
        <thead>
          <tr>
            <th class="text-start px-1">Mensagem</th>
            <th class="text-end px-1">Data de Envio</th>
          </tr>
        </thead>
        <tbody v-if="paginatedNotificacoes.length">
          <tr v-for="(notificacao, index) in paginatedNotificacoes" :key="index">
            <td class="text-start px-1">{{ notificacao.mensagem }}</td>
            <td class="text-end px-1">
              {{ formatarData(notificacao.data_envio) }}
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="2" class="text-center">Nenhuma notificação encontrada</td>
          </tr>
        </tbody>
      </v-table>
    </v-container>

    <!-- Paginação -->
    <Paginacao
      :currentPage="currentPage"
      :totalPages="totalPages"
      @prevPage="prevPage"
      @nextPage="nextPage"
    />
  </v-main>
</template>

<script lang="ts">
import { getUser } from "../api/authService";
import { getNotificacoes } from "../api/notificacaoService";
export default {
  name: "Notificacoes",
  data() {
    return {
      search: "",
      notificacoes: [],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredNotificacoes() {
      return this.notificacoes.filter((n) =>
        n.mensagem.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    paginatedNotificacoes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredNotificacoes.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredNotificacoes.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchNotificacoes() {
      const user = await getUser();
      const usuarioId = user?.id || "";
      this.notificacoes = await getNotificacoes(usuarioId);
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    formatarData(timestamp: string) {
      const data = new Date(timestamp);
      return data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  created() {
    this.fetchNotificacoes();
  },
};
</script>
