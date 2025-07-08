<template>
	<v-main>
		<v-container height="75vh">
			<!-- App bar -->
			<v-app-bar>
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
				</v-btn>
				<v-toolbar-title>Loja de Mascotes</v-toolbar-title>
			</v-app-bar>

			<!-- Campo de pesquisa -->
			<TextForm v-model="search" label="Pesquisar mascotes" prependIcon="mdi-magnify" class="mb-3" />

			<!-- Lista de mascotes em cards -->
			<v-row>
				<v-col v-for="(mascote, index) in paginatedMascotes" :key="index" cols="6" sm="4" md="3">
					<v-card
						:class="{ 'grey lighten-2': !mascote.comprado }"
						class="text-center pa-3 rounded-lg"
						variant="outlined"
					>
						<v-tooltip open-on-click location="top">
							<template #activator="{ props }">
								<v-card-title class="font-weight-bold" v-bind="props">
									<h6>{{ mascote.nome }}</h6>
								</v-card-title>
							</template>
							<span>{{ mascote.nome }}</span>
						</v-tooltip>

						<!-- Imagem do mascote -->
						<v-img
							:src="getMascoteImage(mascote.imagem_url)"
							class="mx-auto"
							max-width="80px"
							:alt="mascote.nome"
							contain
						>
							<template v-if="!mascote.comprado">
								<div class="d-flex align-center justify-center fill-height">
									<v-icon @click="comprarMascote(mascote)" color="#000000EE" size="80">mdi-lock</v-icon>
								</div>
							</template>
						</v-img>

						<v-card-text class="font-weight-bold mt-3 mb-1 pa-0">{{ mascote.preco_moedas }} moedas</v-card-text>
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
import { getMascotes, purchaseMascote } from "../api/mascoteService";
import { getUser } from "../api/authService";
import Swal from "sweetalert2";

export default defineComponent({
	name: "Mascotes",
	data() {
		return {
			search: "",
			mascotes: [],
			currentPage: 1,
			itemsPerPage: 4,
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
			return this.filteredMascotes.slice(
				start,
				start + this.itemsPerPage
			);
		},
		totalPages() {
			return Math.ceil(this.filteredMascotes.length / this.itemsPerPage);
		},
	},
	methods: {
		async fetchMascotes() {
			const user = await getUser();
			const usuarioId = user?.id || ""; // Obtém o ID do usuário autenticado
			this.mascotes = await getMascotes(usuarioId); // Busca mascotes do usuário, marcando quais já foram comprados
		},
		async comprarMascote(mascote) {
			const confirmacao = await Swal.fire({
				title: `Comprar ${mascote.nome}?`,
				text: `Deseja comprar este mascote por ${mascote.preco_moedas} moedas?`,
				icon: "question",
				customClass: {
					confirmButton: "custom-confirm-btn",
					cancelButton: "custom-cancel-btn",
				},
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Sim, comprar",
				cancelButtonText: "Cancelar",
			});

			if (confirmacao.isConfirmed) {
				try {
					const user = await getUser();
					const usuarioId = user?.id || ""; // Obtém o ID do usuário autenticado
					await purchaseMascote(usuarioId, mascote.id);
					await this.fetchMascotes(); // Recarrega lista após compra
					Swal.fire({
						title: "Compra realizada!",
						text: `${mascote.nome} comprado com sucesso.`,
						icon: "success",
						confirmButtonColor: "#3085d6",
						confirmButtonText: "OK",
						customClass: {
							confirmButton: "custom-confirm-btn",
							cancelButton: "custom-cancel-btn",
						},
					});
				} catch (error) {
					console.error("Erro ao comprar mascote:", error.message);
					Swal.fire({
						title: "Erro",
						text: "Erro ao realizar a compra. Tente novamente.",
						icon: "error",
						confirmButtonColor: "#d33",
						confirmButtonText: "OK",
						customClass: {
							confirmButton: "custom-confirm-btn",
							cancelButton: "custom-cancel-btn",
						},
					});
				}
			}
		},
		nextPage() {
			if (this.currentPage < this.totalPages) this.currentPage++;
		},
		prevPage() {
			if (this.currentPage > 1) this.currentPage--;
		},
		getMascoteImage(imagem: string) {
			return new URL(`../assets/mascotes/${imagem}`, import.meta.url)
				.href;
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
