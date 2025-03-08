<template>
	<v-main class="bg-white">
		<v-container>
			<v-app-bar>
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
				</v-btn>
				<v-toolbar-title>Categorias</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn
					icon
					class="bg-blue mr-4"
					color="white"
					density="compact"
					@click="$router.push('/formcategoria')"
				>
					<v-icon>mdi-plus</v-icon>
				</v-btn>
			</v-app-bar>

			<FormField v-model="search" label="Pesquisar categorias" prependIcon="mdi-magnify" class="mb-3" />

			<v-row v-for="(category, index) in paginatedCategories" :key="index">
				<v-col cols="auto">
					<v-avatar size="30" :color="category.cor_icone">
						<v-icon size="18">{{category.icone}}</v-icon>
					</v-avatar>
				</v-col>
				<v-col>{{category.nome}}</v-col>
				<v-col class="text-center">
					<v-chip v-if="category.tipo === 'Despesa'" color="error">{{category.tipo}}</v-chip>
					<v-chip v-else color="success">{{category.tipo}}</v-chip>
				</v-col>
				<v-col cols="auto">
					<v-btn
						icon
						flat
						density="compact"
						@click="$router.push({ path: '/formcategoria', query: { id: category.id } })"
					>
						<v-icon size="18" color="grey">mdi-pencil</v-icon>
					</v-btn>
					<v-btn icon flat density="compact">
						<v-icon size="18" color="grey" @click="delCategoria(category.id)">mdi-delete</v-icon>
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
	</v-main>
	<v-footer class="d-flex justify-center pa-4">
		<v-btn icon @click="prevPage" :disabled="currentPage === 1" density="compact">
			<v-icon>mdi-chevron-left</v-icon>
		</v-btn>
		<small class="mx-3">Página {{currentPage}} de {{totalPages}}</small>
		<v-btn icon @click="nextPage" :disabled="currentPage === totalPages" density="compact">
			<v-icon>mdi-chevron-right</v-icon>
		</v-btn>
	</v-footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getCategorias, deleteCategoria } from "../api/categoriaService";
import { getUser } from "../api/authService";

export default defineComponent({
	name: "Categorias",
	data() {
		return {
			search: "",
			categories: [],
			currentPage: 1,
			itemsPerPage: 10,
		};
	},
	computed: {
		filteredCategories() {
			return this.categories.filter((category) =>
				category.nome.toLowerCase().includes(this.search.toLowerCase())
			);
		},
		paginatedCategories() {
			const startIndex = (this.currentPage - 1) * this.itemsPerPage;
			const endIndex = startIndex + this.itemsPerPage;
			return this.filteredCategories.slice(startIndex, endIndex);
		},
		totalPages() {
			return Math.ceil(
				this.filteredCategories.length / this.itemsPerPage
			);
		},
	},
	methods: {
		async fetchCategorias() {
			const user = await getUser();
			const usuarioId = user?.id || "";
			this.categories = await getCategorias(usuarioId);
			console.log("aqui", await getCategorias(usuarioId));
		},
		nextPage() {
			if (this.currentPage < this.totalPages) {
				this.currentPage++;
			}
		},
		prevPage() {
			if (this.currentPage > 1) {
				this.currentPage--;
			}
		},
		async delCategoria(categoriaId: string) {
			await deleteCategoria(categoriaId);
			this.fetchCategorias();
		},
	},
	created() {
		this.fetchCategorias();
	},
});
</script>