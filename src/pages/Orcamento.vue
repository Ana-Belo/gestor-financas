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
				<v-toolbar-title>Orçamentos</v-toolbar-title>

				<!-- Botão para adicionar nova orcamento -->
				<v-btn
					icon
					class="bg-blue mr-4"
					color="white"
					density="compact"
					@click="$router.push('/formorcamento')"
				>
					<v-icon>mdi-plus</v-icon>
				</v-btn>
			</v-app-bar>

			<!-- Campo de pesquisa -->
			<TextForm v-model="search" label="Pesquisar orcamentos" prependIcon="mdi-magnify" class="mb-3" />

			<!-- Lista de orcamentos com paginação -->
			<v-table density="comfortable">
			<thead>
				<tr>
					<th class="text-center">Valor</th>
					<th class="text-center">Mês/Ano</th>
					<th></th>
				</tr>
			</thead>
			<tbody v-if="paginatedOrcamentos.length">
				<tr v-for="(orcamento, index) in paginatedOrcamentos" :key="index">					
					<!-- Valor da orçamento -->
					<td class="text-center">{{ orcamento.valor_limite.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
					
					<!-- Data da orçamento -->
					<td class="text-center">{{orcamento.mes_ano}}</td>
					
					<!-- Botões de ação (Editar e Excluir) -->
					<td class="text-center">
						<!-- Botão de edição -->
						<v-btn
						icon
						flat
						density="compact"
						@click="$router.push({ path: '/formorcamento', query: { id: orcamento.id } })"
						color="transparent"
						>
						<v-icon size="18" color="grey">mdi-pencil</v-icon>
						</v-btn>
						
						<!-- Botão de exclusão com confirmação -->
						<v-btn icon flat density="compact" color="transparent" @click="confirmDelete(orcamento.id)">
						<v-icon size="18" color="grey">mdi-delete</v-icon>
						</v-btn>
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

		<!-- Diálogo de confirmação para deletar -->
		<v-dialog v-model="dialogDelete" width="auto">
			<v-card>
				<!-- Título do diálogo -->
				<v-card-title class="headline">Excluir orçamento</v-card-title>

				<!-- Mensagem de confirmação -->
				<v-card-text>Tem certeza de que deseja excluir este orçamento?</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<!-- Botão para cancelar -->
					<v-btn color="grey" text @click="dialogDelete = false">Cancelar</v-btn>

					<!-- Botão para confirmar exclusão -->
					<v-btn color="red" @click="deleteOrcamentos">Excluir</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-main>
</template>

<script lang="ts">
import { getUser } from "../api/authService";
import { getOrcamento , deleteOrcamento } from "../api/orcamentoService";

export default {
	name: "Orcamentos",
	data() {
		return {
			search: "", // Texto de busca para filtrar Orçamentos
			orcamentos: [], // Lista de orcamentos obtidas da API
			currentPage: 1, // Página atual da paginação
			itemsPerPage: 10, // Quantidade de itens por página
			dialogDelete: false, // Controle de exibição do diálogo de confirmação de exclusão
			orcamentoToDelete: null, // Orcamento que será deletada
		};
	},
	computed: {
		// Filtra orcamentos com base no termo de busca digitado pelo usuário
		filteredOrcamentos() {
			return this.orcamentos.filter((orcamento) =>
				orcamento.mes_ano.toLowerCase().includes(this.search.toLowerCase())
			);
		},
		// Retorna um subconjunto das orcamentos filtradas, de acordo com a paginação
		paginatedOrcamentos() {
			const startIndex = (this.currentPage - 1) * this.itemsPerPage;
			return this.filteredOrcamentos.slice(
				startIndex,
				startIndex + this.itemsPerPage
			);
		},
		// Calcula o número total de páginas com base na quantidade de itens filtrados
		totalPages() {
			return Math.ceil(this.filteredOrcamentos.length / this.itemsPerPage);
		},
	},
	methods: {
		// Obtém as orcamentos da API associadas ao usuário logado
		async fetchOrcamentos() {
			const user = await getUser();
			const usuarioId = user?.id || ""; // Obtém o ID do usuário autenticado
			this.orcamentos = await getOrcamento(usuarioId); // Busca as orcamentos associadas ao usuário
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
		// Exibe o diálogo de confirmação antes de excluir uma orcamento
		confirmDelete(orcamentoId: string) {
			this.orcamentoToDelete = orcamentoId;
			this.dialogDelete = true;
		},
		// Exclui a orcamento selecionada e recarrega a lista de orcamentos
		async deleteOrcamentos() {
			if (this.orcamentoToDelete) {
				await deleteOrcamento(this.orcamentoToDelete); // Chama a API para excluir a orcamento
				this.dialogDelete = false; // Fecha o diálogo de confirmação
				this.fetchOrcamentos(); // Atualiza a lista de orcamentos
			}
		},
	},
	created() {
		this.fetchOrcamentos();
	},
};
</script>
