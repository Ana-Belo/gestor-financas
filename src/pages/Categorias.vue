<template>
	<!-- Componente principal -->
	<v-main>
		<v-container height="85vh">
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
			<TextForm v-model="search" label="Pesquisar categorias" prependIcon="mdi-magnify" class="mb-3" />

			<!-- Lista de categorias com paginação -->
			<v-table density="comfortable">
				<thead>
					<tr>
						<th class="text-center">Ícone</th>
						<th class="text-center">Descrição</th>
						<th class="text-center">Tipo</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(categoria, index) in paginatedCategorias" :key="index">
						<td class="text-center">
							<!-- Ícone da categoria -->
							<v-avatar size="30" :color="categoria.cor_icone">
								<v-icon size="18">{{ categoria.icone }}</v-icon>
							</v-avatar>
						</td>
						<!-- Nome da categoria -->
						<td class="text-center">{{ categoria.nome }}</td>
						<td class="text-center">
							<!-- Tipo da categoria (Despesa ou Receita) -->
							<v-chip :color="categoria.tipo === 'Despesa' ? 'error' : 'success'">{{ categoria.tipo }}</v-chip>
						</td>
						<!-- Botões de ação (Editar e Excluir) -->
						<td class="text-center">
							<!-- Botão de edição -->
							<v-btn
								icon
								flat
								density="compact"
								@click="$router.push({ path: '/formcategoria', query: { id: categoria.id } })"
								color="transparent"
							>
								<v-icon size="18" color="grey">mdi-pencil</v-icon>
							</v-btn>

							<!-- Botão de exclusão com confirmação -->
							<v-btn icon flat density="compact" color="transparent" @click="confirmDelete(categoria.id)">
								<v-icon size="18" color="grey">mdi-delete</v-icon>
							</v-btn>
						</td>
					</tr>
				</tbody>
			</v-table>
		</v-container>

		<!-- Footer de paginação -->
		<Paginacao
			:currentPage="currentPage"
			:totalPages="totalPages"
			@prevPage="prevPage"
			@nextPage="nextPage"
		/>

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
	</v-main>
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
			categorias: [], // Lista de categorias obtidas da API
			currentPage: 1, // Página atual da paginação
			itemsPerPage: 10, // Quantidade de itens por página
			dialogDelete: false, // Controle de exibição do diálogo de confirmação de exclusão
			categoriaToDelete: null, // Categoria que será deletada
		};
	},
	computed: {
		// Filtra categorias com base no termo de busca digitado pelo usuário
		filteredCategorias() {
			return this.categorias.filter((categoria) =>
				categoria.nome.toLowerCase().includes(this.search.toLowerCase())
			);
		},
		// Retorna um subconjunto das categorias filtradas, de acordo com a paginação
		paginatedCategorias() {
			const startIndex = (this.currentPage - 1) * this.itemsPerPage;
			return this.filteredCategorias.slice(
				startIndex,
				startIndex + this.itemsPerPage
			);
		},
		// Calcula o número total de páginas com base na quantidade de itens filtrados
		totalPages() {
			return Math.ceil(
				this.filteredCategorias.length / this.itemsPerPage
			);
		},
	},
	methods: {
		// Obtém as categorias da API associadas ao usuário logado
		async fetchCategorias() {
			const user = await getUser();
			const usuarioId = user?.id || ""; // Obtém o ID do usuário autenticado
			this.categorias = await getCategorias(usuarioId); // Busca as categorias associadas ao usuário
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
			this.categoriaToDelete = categoriaId;
			this.dialogDelete = true;
		},
		// Exclui a categoria selecionada e recarrega a lista de categorias
		async deleteCategoria() {
			if (this.categoriaToDelete) {
				await deleteCategoria(this.categoriaToDelete); // Chama a API para excluir a categoria
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