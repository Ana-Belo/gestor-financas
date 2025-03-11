<template>
	<!-- Componente principal -->
	<v-main>
		<v-container>
			<!-- Barra de navegação superior -->
			<v-app-bar>
				<!-- Botão para voltar à página anterior -->
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
				</v-btn>

				<!-- Título da página -->
				<v-toolbar-title>Categorias</v-toolbar-title>

				<!-- Botão para adicionar nova categoria -->
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

			<!-- Campo de pesquisa -->
			<FormField v-model="search" label="Pesquisar categorias" prependIcon="mdi-magnify" class="mb-3" />

			<!-- Lista de categorias com paginação -->
			<v-row v-for="(category, index) in paginatedCategories" :key="index">
				<!-- Ícone da categoria -->
				<v-col cols="auto">
					<v-avatar size="30" :color="category.cor_icone">
						<v-icon size="18">{{ category.icone }}</v-icon>
					</v-avatar>
				</v-col>

				<!-- Nome da categoria -->
				<v-col>{{ category.nome }}</v-col>

				<!-- Tipo da categoria (Despesa ou Receita) -->
				<v-col class="text-center">
					<v-chip :color="category.tipo === 'Despesa' ? 'error' : 'success'">{{ category.tipo }}</v-chip>
				</v-col>

				<!-- Botões de ação (Editar e Excluir) -->
				<v-col cols="auto">
					<!-- Botão de edição -->
					<v-btn
						icon
						flat
						density="compact"
						@click="$router.push({ path: '/formcategoria', query: { id: category.id } })"
						color="transparent"
					>
						<v-icon size="18" color="grey">mdi-pencil</v-icon>
					</v-btn>

					<!-- Botão de exclusão com confirmação -->
					<v-btn icon flat density="compact" color="transparent" @click="confirmDelete(category.id)">
						<v-icon size="18" color="grey">mdi-delete</v-icon>
					</v-btn>
				</v-col>
			</v-row>
		</v-container>
	</v-main>

	<!-- Footer de paginação -->
	<v-footer class="d-flex justify-center pa-4">
		<!-- Botão para página anterior -->
		<v-btn icon @click="prevPage" :disabled="currentPage === 1" density="compact">
			<v-icon>mdi-chevron-left</v-icon>
		</v-btn>

		<!-- Indicação da página atual -->
		<small class="mx-3">Página {{ currentPage }} de {{ totalPages }}</small>

		<!-- Botão para próxima página -->
		<v-btn icon @click="nextPage" :disabled="currentPage === totalPages" density="compact">
			<v-icon>mdi-chevron-right</v-icon>
		</v-btn>
	</v-footer>

	<!-- Diálogo de confirmação para deletar -->
	<v-dialog v-model="dialogDelete" width="auto">
		<v-card>
			<!-- Título do diálogo -->
			<v-card-title class="headline">Excluir Categoria</v-card-title>

			<!-- Mensagem de confirmação -->
			<v-card-text>Tem certeza de que deseja excluir esta categoria?</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<!-- Botão para cancelar -->
				<v-btn color="grey" text @click="dialogDelete = false">Cancelar</v-btn>

				<!-- Botão para confirmar exclusão -->
				<v-btn color="red" @click="deleteCategoria">Excluir</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getCategorias, deleteCategoria } from "../api/categoriaService";
import { getUser } from "../api/authService";

export default defineComponent({
	name: "Categorias",
	data() {
		return {
			search: "", // Texto de busca para filtrar categorias
			categories: [], // Lista de categorias obtidas da API
			currentPage: 1, // Página atual da paginação
			itemsPerPage: 10, // Quantidade de itens por página
			dialogDelete: false, // Controle de exibição do diálogo de confirmação de exclusão
			categoryToDelete: null, // Categoria que será deletada
		};
	},
	computed: {
		// Filtra categorias com base no termo de busca digitado pelo usuário
		filteredCategories() {
			return this.categories.filter((category) =>
				category.nome.toLowerCase().includes(this.search.toLowerCase())
			);
		},
		// Retorna um subconjunto das categorias filtradas, de acordo com a paginação
		paginatedCategories() {
			const startIndex = (this.currentPage - 1) * this.itemsPerPage;
			return this.filteredCategories.slice(
				startIndex,
				startIndex + this.itemsPerPage
			);
		},
		// Calcula o número total de páginas com base na quantidade de itens filtrados
		totalPages() {
			return Math.ceil(
				this.filteredCategories.length / this.itemsPerPage
			);
		},
	},
	methods: {
		// Obtém as categorias da API associadas ao usuário logado
		async fetchCategorias() {
			const user = await getUser();
			const usuarioId = user?.id || ""; // Obtém o ID do usuário autenticado
			this.categories = await getCategorias(usuarioId); // Busca as categorias associadas ao usuário
		},
		// Avança para a próxima página se não for a última
		nextPage() {
			if (this.currentPage < this.totalPages) {
				this.currentPage++;
			}
		},
		// Retorna para a página anterior se não for a primeira
		prevPage() {
			if (this.currentPage > 1) {
				this.currentPage--;
			}
		},
		// Exibe o diálogo de confirmação antes de excluir uma categoria
		confirmDelete(categoriaId: string) {
			this.categoryToDelete = categoriaId;
			this.dialogDelete = true;
		},
		// Exclui a categoria selecionada e recarrega a lista de categorias
		async deleteCategoria() {
			if (this.categoryToDelete) {
				await deleteCategoria(this.categoryToDelete); // Chama a API para excluir a categoria
				this.dialogDelete = false; // Fecha o diálogo de confirmação
				this.fetchCategorias(); // Atualiza a lista de categorias
			}
		},
	},
	// Método executado quando o componente é criado
	created() {
		this.fetchCategorias(); // Carrega as categorias ao iniciar o componente
	},
	watch: {
		// Sempre que a busca mudar, a página volta para a primeira
		search() {
			this.currentPage = 1;
		},
	},
});
</script>