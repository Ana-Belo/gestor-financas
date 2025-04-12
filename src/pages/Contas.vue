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
			<TextForm v-model="search" label="Pesquisar contas" prependIcon="mdi-magnify" class="mb-3" />

			<!-- Lista de contas com paginação -->
			<v-table density="comfortable">
				<thead>
					<tr>
						<th class="text-center">Descrição</th>
						<th class="text-center">Tipo</th>
						<th class="text-center">Saldo</th>
						<th></th>
					</tr>
				</thead>
				<tbody v-if="paginatedContas.length">
					<tr v-for="(conta, index) in paginatedContas" :key="index">
						<!-- Nome da conta -->
						<td class="text-center">{{ conta.nome }}</td>
						<td class="text-center">
							<!-- Tipo da conta (Carteira, Conta corrente ou Conta digital) -->
							<v-chip>{{ conta.tipo }}</v-chip>
						</td>
						<!-- Saldo da conta -->
						<td
							class="text-center"
						>{{ conta.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
						<!-- Botões de ação (Editar e Excluir) -->
						<td class="text-center">
							<div class="d-flex justify-center">
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
import { getSaldoContas } from "../api/homeService";
import { getUser } from "../api/authService";
import { deleteConta } from "../api/contaService";
import Swal from "sweetalert2";

export default {
	name: "Contas",
	data() {
		return {
			search: "", // Texto de busca para filtrar contas
			contas: [], // Lista de contas obtidas da API
			currentPage: 1, // Página atual da paginação
			itemsPerPage: 10, // Quantidade de itens por página
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
			this.contas = await getSaldoContas(usuarioId); // Busca as contas associadas ao usuário
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
		async confirmDelete(contaId: string) {
			const result = await Swal.fire({
				title: "Tem certeza?",
				text: "Você deseja excluir esta conta?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#d33",
				confirmButtonText: "Sim, excluir!",
				cancelButtonText: "Cancelar",
				customClass: {
					confirmButton: "custom-confirm-btn",
					cancelButton: "custom-cancel-btn",
				},
			});

			if (result.isConfirmed) {
				this.deleteConta(contaId);
			}
		},
		// Exclui a conta selecionada e recarrega a lista de contas
		async deleteConta(contaId: string) {
			try {
				await deleteConta(contaId);
				await this.fetchContas();

				Swal.fire({
					title: "Sucesso!",
					text: "Conta excluída com sucesso.",
					icon: "success",
					timer: 2000,
					showConfirmButton: false,
					confirmButtonColor: "#d33",
					customClass: {
						confirmButton: "custom-confirm-btn",
						cancelButton: "custom-cancel-btn",
					},
				});
			} catch (error) {
				let errorMessage = "Ocorreu um erro ao tentar excluir a conta.";
				if (error.code === "23503") {
					errorMessage =
						"Não é possível excluir esta conta, pois ela está associada a outros registros.";
				}

				Swal.fire({
					title: "Erro",
					text: errorMessage,
					icon: "error",
					confirmButtonColor: "#d33",
					customClass: {
						confirmButton: "custom-confirm-btn",
						cancelButton: "custom-cancel-btn",
					},
				});
			}
		},
	},
	created() {
		this.fetchContas();
	},
};
</script>
