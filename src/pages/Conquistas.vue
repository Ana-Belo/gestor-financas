<template>
	<v-main>
		<v-container height="75vh">
			<!-- App bar simples -->
			<v-app-bar>
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
				</v-btn>

				<v-toolbar-title>Conquistas</v-toolbar-title>
			</v-app-bar>

			<!-- Campo de pesquisa -->
			<TextForm v-model="search" label="Pesquisar conquistas" prependIcon="mdi-magnify" class="mb-3" />
			<div class="text-end mb-5">
				Total: {{ conquistasConquistadas }}/{{ conquistas.length }}
				<v-icon size="17" class="ml-1 mt-n1">mdi-trophy-outline</v-icon>
			</div>

			<!-- Cards de conquistas -->
			<v-row>
				<v-col v-for="(conquista, index) in paginatedConquistas" :key="index" cols="6" sm="6" md="4">
					<v-card variant="outlined" class="text-center pa-3 rounded-lg">
						<v-card-title class="font-weight-bold">
							<h6>{{ conquista.nome }}</h6>
						</v-card-title>
						<v-img
							v-if="conquista.conquistado"
							src="@/assets/trofeu.png"
							class="mx-auto"
							max-width="50px"
							alt="trofeu"
						/>
						<v-img v-else src="@/assets/cadeado.png" class="mx-auto" max-width="50px" alt="cadeado" />
						<span
							v-if="conquista.conquistado"
							class="text-caption"
						>{{ formatarData(conquista.data_conquista) }}</span>
						<span v-else class="text-caption">Bloqueado</span>

						<v-card-subtitle class="text-caption">+{{ conquista.recompensa_moedas }} coins</v-card-subtitle>
					</v-card>
				</v-col>
			</v-row>
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
			itemsPerPage: 4,
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
			return Math.ceil(
				this.filteredConquistas.length / this.itemsPerPage
			);
		},
		conquistasConquistadas() {
			return this.conquistas.filter((c) => c.conquistado).length;
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
