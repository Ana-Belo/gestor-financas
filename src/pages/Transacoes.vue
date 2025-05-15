<template>
	<!-- Componente principal -->
	<v-main>
		<v-container min-height="75vh">
			<!-- Barra de navegação superior -->
			<v-app-bar>
				<!-- Botão para voltar à página anterior -->
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
				</v-btn>

				<!-- Título da página -->
				<v-toolbar-title>Transações</v-toolbar-title>

				<!-- Botão para adicionar nova transacao -->
				<v-btn
					icon
					class="bg-blue mr-4"
					color="white"
					density="compact"
					@click="$router.push('/formtransacao')"
				>
					<v-icon>mdi-plus</v-icon>
				</v-btn>
			</v-app-bar>

			<!-- Campo de pesquisa -->
			<TextForm v-model="search" label="Pesquisar transacoes" prependIcon="mdi-magnify" class="mb-3" />

			<!-- Lista de transacoes com paginação -->
			<v-table density="comfortable">
				<thead>
					<tr>
						<th></th>
						<th class="text-start px-1">Descrição</th>
						<th class="text-center px-1">Tipo</th>
						<th class="text-center px-1">Data</th>
						<th class="text-end px-1">Valor</th>
					</tr>
				</thead>
				<tbody v-if="paginatedTransacoes.length">
					<tr v-for="(transacao, index) in paginatedTransacoes" :key="index">
						<!-- Botão de menu com opções Editar e Excluir para Transação -->
						<td class="text-center px-1">
							<div class="d-flex justify-center">
								<v-menu transition="scale-transition" offset-y>
									<template #activator="{ props }">
										<v-btn icon v-bind="props" flat density="compact" color="transparent">
											<v-icon size="18" color="grey">mdi-dots-vertical</v-icon>
										</v-btn>
									</template>

									<v-list>
										<v-list-item
											@click="$router.push({ path: '/formtransacao', query: { id: transacao.id } })"
										>
											<v-list-item-title>Editar</v-list-item-title>
										</v-list-item>

										<v-list-item @click="confirmDelete(transacao.id)">
											<v-list-item-title>Excluir</v-list-item-title>
										</v-list-item>
									</v-list>
								</v-menu>
							</div>
						</td>
						<!-- Descrição da transação -->
						<td class="text-start px-1">{{ transacao.descricao }}</td>
						<!-- Tipo da  transação (Receita ou Despesa) -->
						<td class="text-center px-1">
							<v-chip
								variant="outlined"
								density="comfortable"
								:color="transacao.tipo === 'Receita' ? 'green' : 'red'"
							>{{ transacao.tipo }}</v-chip>
						</td>
						<!-- Data da transação -->
						<td class="text-center px-1">{{ new Date(transacao.data).toLocaleDateString('pt-BR') }}</td>
						<!-- Valor da transação -->
						<td
							class="text-end px-1"
						>{{ transacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<td colspan="5" class="text-center">Nenhum registro encontrado</td>
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
				<v-card-title class="headline">Excluir transação</v-card-title>

				<!-- Mensagem de confirmação -->
				<v-card-text>Tem certeza de que deseja excluir esta transação?</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<!-- Botão para cancelar -->
					<v-btn color="grey" text @click="dialogDelete = false">Cancelar</v-btn>

					<!-- Botão para confirmar exclusão -->
					<v-btn color="red" @click="deleteTransacoes">Excluir</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-main>
</template>

<script lang="ts">
import { getUser } from "../api/authService";
import { getTransacao, deleteTransacao } from "../api/transacaoService";

export default {
	name: "Transacoes",
	data() {
		return {
			search: "", // Texto de busca para filtrar Transações
			transacoes: [], // Lista de transacoes obtidas da API
			currentPage: 1, // Página atual da paginação
			itemsPerPage: 10, // Quantidade de itens por página
			dialogDelete: false, // Controle de exibição do diálogo de confirmação de exclusão
			transacaoToDelete: null, // Transacao que será deletada
		};
	},
	computed: {
		// Filtra transacoes com base no termo de busca digitado pelo usuário
		filteredTransacoes() {
			return this.transacoes.filter((transacao) =>
				transacao.descricao
					.toLowerCase()
					.includes(this.search.toLowerCase())
			);
		},
		// Retorna um subconjunto das transacoes filtradas, de acordo com a paginação
		paginatedTransacoes() {
			const startIndex = (this.currentPage - 1) * this.itemsPerPage;
			return this.filteredTransacoes.slice(
				startIndex,
				startIndex + this.itemsPerPage
			);
		},
		// Calcula o número total de páginas com base na quantidade de itens filtrados
		totalPages() {
			return Math.ceil(
				this.filteredTransacoes.length / this.itemsPerPage
			);
		},
	},
	methods: {
		// Obtém as transacoes da API associadas ao usuário logado
		async fetchTransacoes() {
			const user = await getUser();
			const usuarioId = user?.id || ""; // Obtém o ID do usuário autenticado
			this.transacoes = await getTransacao(usuarioId); // Busca as transacoes associadas ao usuário
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
		// Exibe o diálogo de confirmação antes de excluir uma transacao
		confirmDelete(transacaoId: string) {
			this.transacaoToDelete = transacaoId;
			this.dialogDelete = true;
		},
		// Exclui a transacao selecionada e recarrega a lista de transacoes
		async deleteTransacoes() {
			if (this.transacaoToDelete) {
				await deleteTransacao(this.transacaoToDelete); // Chama a API para excluir a transacao
				this.dialogDelete = false; // Fecha o diálogo de confirmação
				this.fetchTransacoes(); // Atualiza a lista de transacoes
			}
		},
	},
	created() {
		this.fetchTransacoes();
	},
};
</script>
