<template>
  <v-main>
    <v-container height="85vh">
      <!-- App bar -->
      <v-app-bar>
        <v-btn icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        
        <v-toolbar-title>Mascotes</v-toolbar-title>
      </v-app-bar>

      <!-- Campo de pesquisa -->
      <TextForm
        v-model="search"
        label="Pesquisar mascotes"
        prependIcon="mdi-magnify"
        class="mb-3"
      />

      <!-- Lista de mascotes -->
      <v-table density="comfortable">
        <thead>
          <tr>
            <th class="text-center">Nome</th>
            <th class="text-center">Preço (Moedas)</th>
          </tr>
        </thead>
        <tbody v-if="paginatedMascotes.length">
          <tr v-for="(mascote, index) in paginatedMascotes" :key="index">
            <td class="text-center">{{ mascote.nome }}</td>
            <td class="text-center">{{ mascote.preco_moedas }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="2" class="text-center">Nenhum mascote encontrado</td>
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
import { defineComponent } from "vue";
import { getMascotes } from "../api/mascoteService"; // Substitua com seu serviço real
import { supabase } from "../api/supabase";

export default defineComponent({
  name: "Mascotes",
  data() {
    return {
      search: "",
      mascotes: [],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredMascotes() {
      return this.mascotes.filter((m) => {
        const nome = m.nome || "";
        return nome.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    paginatedMascotes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredMascotes.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredMascotes.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchMascotes() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Erro ao obter usuário:", error.message);
        return;
      }
      if (user) {
        this.mascotes = await getMascotes(user.id); // Ajuste se necessário
      } else {
        console.warn("Usuário não autenticado.");
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
  },
  created() {
    this.fetchMascotes();
  },
  watch: {
    search() {
      this.currentPage = 1;
    },
  },
});
</script>
