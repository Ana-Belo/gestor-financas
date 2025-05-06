<template>
  <v-main>
    <v-container height="85vh">
      <!-- App bar simples -->
      <v-app-bar>
        <v-btn icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>Conquistas</v-toolbar-title>
      </v-app-bar>

      <!-- Campo de pesquisa -->
      <TextForm
        v-model="search"
        label="Pesquisar conquistas"
        prependIcon="mdi-magnify"
        class="mb-3"
      />

      <!-- Lista de conquistas -->
      <v-table density="comfortable">
        <thead>
          <tr>
            <th class="text-center">Status</th>
            <th class="text-center">Título</th>
            <th class="text-center">Descrição</th>
            <th class="text-center">Data da Conquista</th>
          </tr>
        </thead>
        <tbody v-if="paginatedConquistas.length">
          <tr v-for="(conquista, index) in paginatedConquistas" :key="index">
            <td class="text-center">
              <v-icon :color="conquista.conquistado ? 'green' : 'grey'">
                {{
                  conquista.conquistado
                    ? "mdi-check-circle"
                    : "mdi-checkbox-blank-circle-outline"
                }}
              </v-icon>
            </td>
            <td class="text-center">{{ conquista.nome }}</td>
            <td class="text-center">{{ conquista.descricao }}</td>
            <td class="text-center">
              <span v-if="conquista.conquistado">
                {{ formatarData(conquista.data_conquista) }}
              </span>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="text-center">
              Nenhuma conquista encontrada
            </td>
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
import { getConquistas } from "../api/conquistaService"; // Serviço para buscar conquistas
import { supabase } from "../api/supabase"; // Importa o Supabase para pegar o usuário logado

export default defineComponent({
  name: "Conquistas",
  data() {
    return {
      search: "",
      conquistas: [],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredConquistas() {
      return this.conquistas.filter((c) => {
        const nome = c.nome || "";
        const descricao = c.descricao || "";
        return (
          nome.toLowerCase().includes(this.search.toLowerCase()) ||
          descricao.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
    paginatedConquistas() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredConquistas.slice(
        startIndex,
        startIndex + this.itemsPerPage
      );
    },
    totalPages() {
      return Math.ceil(this.filteredConquistas.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchConquistas() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Erro ao obter usuário:", error.message);
        return;
      }
      if (user) {
        this.conquistas = await getConquistas(user.id); // Agora passando o ID corretamente
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
    formatarData(data: string) {
      if (!data) return "";
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      } as const;
      return new Date(data).toLocaleDateString("pt-BR", options);
    },
  },
  created() {
    this.fetchConquistas();
  },
  watch: {
    search() {
      this.currentPage = 1;
    },
  },
});
</script>
