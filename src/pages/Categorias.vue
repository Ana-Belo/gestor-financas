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
				<tbody v-if="paginatedCategorias.length">
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
							<div class="d-flex justify-center">
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

								<!-- Botão de exclusão com SweetAlert -->
								<v-btn icon flat density="compact" color="transparent" @click="confirmDelete(categoria.id)">
									<v-icon size="18" color="grey">mdi-delete</v-icon>
								</v-btn>
							</div>
						</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<td colspan="4" class="text-center">Nenhum registro encontrado</td>
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
	</v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Swal from "sweetalert2";
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
			return this.filteredCategorias.slice(startIndex, startIndex + this.itemsPerPage);
		},
		// Calcula o número total de páginas com base na quantidade de itens filtrados
		totalPages() {
			return Math.ceil(this.filteredCategorias.length / this.itemsPerPage);
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
		// Exibe o diálogo de confirmação antes de excluir uma categoria com SweetAlert2
		confirmDelete(categoriaId: string) {
			Swal.fire({
				title: "Tem certeza?",
				text: "Essa ação não pode ser desfeita!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#d33",
				cancelButtonColor: "#6c757d",
				confirmButtonText: "Sim, excluir!",
				cancelButtonText: "Cancelar",
				customClass: {
					confirmButton: "custom-confirm-btn",
					cancelButton: "custom-cancel-btn",
				},
			}).then((result) => {
				if (result.isConfirmed) {
					this.deleteCategoria(categoriaId);
				}
			});
		},
		// Exclui a categoria selecionada e recarrega a lista de categorias
		async deleteCategoria(categoriaId: string) {
			try {
				await deleteCategoria(categoriaId); // Chama a API para excluir a categoria
				Swal.fire({
					title: "Excluído!",
					text: "A categoria foi removida com sucesso.",
					icon: "success",
					confirmButtonColor: "#d33",
					customClass: {
						confirmButton: "custom-confirm-btn",
						cancelButton: "custom-cancel-btn",
					},
				});
				this.fetchCategorias(); // Atualiza a lista de categorias
			} catch (error) {
				if (error.code === "23503") {
					Swal.fire({
						title: "Erro",
						text: "Não é possível excluir esta categoria pois está associada a outros registros.",
						icon: "error",
						confirmButtonColor: "#d33",
						customClass: {
							confirmButton: "custom-confirm-btn",
							cancelButton: "custom-cancel-btn",
						},
					});
				} else {
					Swal.fire({
						title: "Erro",
						text: "Ocorreu um erro ao tentar excluir a categoria.",
						icon: "error",
						confirmButtonColor: "#d33",
						customClass: {
							confirmButton: "custom-confirm-btn",
							cancelButton: "custom-cancel-btn",
						},
					});
				}
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
