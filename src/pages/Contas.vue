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
				<v-toolbar-title>Contas</v-toolbar-title>

				<!-- Botão para adicionar nova conta -->
				<v-btn
					icon
					class="bg-blue mr-4"
					color="white"
					density="compact"
					@click="$router.push('/formconta')"
				>
					<v-icon>mdi-plus</v-icon>
				</v-btn>
			</v-app-bar>

			<!-- Campo de pesquisa -->
			<FormField v-model="search" label="Pesquisar contas" prependIcon="mdi-magnify" class="mb-3" />

			<!-- Lista de contas com paginação -->
			<v-row v-for="(conta, index) in paginatedContas" :key="index">
				<!-- Nome da conta -->
				<v-col>{{ conta.nome }}</v-col>

				<!-- Tipo da conta (Despesa ou Receita) -->
				<v-col class="text-center">
					<v-chip :color="conta.tipo === 'Despesa' ? 'error' : 'success'">{{ conta.tipo }}</v-chip>
				</v-col>

				<!-- Botões de ação (Editar e Excluir) -->
				<v-col cols="auto">
					<!-- Botão de edição -->
					<v-btn
						icon
						flat
						density="compact"
						@click="$router.push({ path: '/formconta', query: { id: conta.id } })"
						color="transparent"
					>
						<v-icon size="18" color="grey">mdi-pencil</v-icon>
					</v-btn>

					<!-- Botão de exclusão com confirmação -->
					<v-btn icon flat density="compact" color="transparent" @click="confirmDelete(conta.id)">
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
			<v-card-title class="headline">Excluir Conta</v-card-title>

			<!-- Mensagem de confirmação -->
			<v-card-text>Tem certeza de que deseja excluir esta conta?</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<!-- Botão para cancelar -->
				<v-btn color="grey" text @click="dialogDelete = false">Cancelar</v-btn>

				<!-- Botão para confirmar exclusão -->
				<v-btn color="red" @click="deleteConta">Excluir</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { getUser } from "../api/authService";
import { getContas, deleteConta } from "../api/contaService";

export default {
	name: "Contas",
	data() {
		return {
			search: "", // Texto de busca para filtrar contas
			contas: [], // Lista de contas obtidas da API
			currentPage: 1, // Página atual da paginação
			itemsPerPage: 10, // Quantidade de itens por página
			dialogDelete: false, // Controle de exibição do diálogo de confirmação de exclusão
			contaToDelete: null, // Conta que será deletada
		};
	},
	computed: {
		// Filtra contas com base no termo de busca digitado pelo usuário
		filteredContas() {
			return this.contas.filter((conta) =>
				conta.nome.toLowerCase().includes(this.search.toLowerCase())
			);
		},
		// Retorna um subconjunto das contas filtradas, de acordo com a paginação
		paginatedContas() {
			const startIndex = (this.currentPage - 1) * this.itemsPerPage;
			return this.filteredContas.slice(
				startIndex,
				startIndex + this.itemsPerPage
			);
		},
		// Calcula o número total de páginas com base na quantidade de itens filtrados
		totalPages() {
			return Math.ceil(this.filteredContas.length / this.itemsPerPage);
		},
	},
	methods: {
		// Obtém as contas da API associadas ao usuário logado
		async fetchContas() {
			const user = await getUser();
			const usuarioId = user?.id || ""; // Obtém o ID do usuário autenticado
			this.contas = await getContas(usuarioId); // Busca as contas associadas ao usuário
			console.log(this.contas);
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
		// Exibe o diálogo de confirmação antes de excluir uma conta
		confirmDelete(contaId: string) {
			this.contaToDelete = contaId;
			this.dialogDelete = true;
		},
		// Exclui a conta selecionada e recarrega a lista de contas
		async deleteConta() {
			if (this.contaToDelete) {
				await deleteConta(this.contaToDelete); // Chama a API para excluir a conta
				this.dialogDelete = false; // Fecha o diálogo de confirmação
				this.fetchContas(); // Atualiza a lista de contas
			}
		},
	},
	created() {
		this.fetchContas();
	},
};
</script>
