<template>
	<v-main>
		<v-container height="75vh">
			<!-- Barra de navegação superior -->
			<v-app-bar>
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
					<!-- Ícone de voltar -->
				</v-btn>
				<!-- Define o título da página dinamicamente -->
				<v-toolbar-title>{{ formMode === 'add' ? 'Nova' : 'Editar' }} Transação</v-toolbar-title>
			</v-app-bar>

			<!-- Card para o formulário de transacao -->
			<v-card class="pa-5 mb-4 text-center">
				<!-- Campo para inserir o nome da transacao -->
				<TextForm v-model="transacao.descricao" label="Nome da Transação" class="mb-4" />

				<!-- Campo para selecionar tipo da transacao -->
				<SelectForm
					v-model="transacao.tipo"
					:items="tiposTransacao"
					label="Selecione o tipo de transação"
				/>

				<!-- Campo para inserir o saldo inicial da transacao -->
				<TextForm v-model="transacao.valor" label="Valor" type="number" />

				<SelectForm v-model="transacao.conta_id" :items="contasMap" label="Conta" />

				<!-- Campo para selecionar a categoria -->
				<SelectForm v-model="transacao.categoria_id" :items="categoriasMap" label="Categoria" />

				<!-- Campo para selecionar a data da transação -->
				<TextForm v-model="transacao.data" label="Data da Transação" type="date" />

				<!-- Campo para indicar se a receita está pendente -->
				<v-switch v-model="transacao.pendente" label="Transação Pendente?" />
			</v-card>
		</v-container>

		<!-- Rodapé com botão de salvar transacao -->
		<v-container class="d-flex justify-center pa-4">
			<v-btn
				type="submit"
				block
				color="primary"
				class="mt-4"
				size="large"
				rounded="lg"
				:loading="loading"
				@click="saveTransacao"
			>
				<!-- Indicador de carregamento enquanto salva -->
				<span>{{ formMode === 'add' ? 'Cadastrar' : 'Editar' }} Transação</span>
			</v-btn>
		</v-container>
	</v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
	getTransacaoById,
	addTransacao,
	updateTransacao,
} from "../api/transacaoService";
import { getUser } from "../api/authService";
import { getCategorias } from "../api/categoriaService";
import { getContas } from "../api/contaService";
import Swal from "sweetalert2";

export default defineComponent({
	name: "FormTransacao",
	data() {
		return {
			user: {
				id: "",
			},
			contasOptions: [],
			categoriasOptions: [],
			// Objeto que armazena os dados da transacao
			transacao: {
				id: "",
				conta_id: "",
				categoria_id: "",
				descricao: "",
				tipo: "",
				valor: 0,
				data: new Date().toISOString().split("T")[0],
				pendente: false,
			},
			formMode: "add" as "edit" | "add", // Define se o formulário está no modo adicionar ou editar
			loading: false, // Indica se a operação está carregando
			tiposTransacao: ["Receita", "Despesa"],
		};
	},
	computed: {
		categoriasMap() {
			return this.categoriasOptions
				.filter((c) => c.tipo === this.transacao.tipo)
				.map((c) => ({ value: c.id, title: c.nome }));
		},
		contasMap() {
			return this.contasOptions.map((c) => ({
				value: c.id,
				title: c.nome,
			}));
		},
	},
	watch: {
		"transacao.tipo": function (newValue, oldValue) {
			if (newValue != oldValue && oldValue) {
				this.transacao.categoria_id = "";
			}
		},
	},
	methods: {
		// Obtém os dados da transacao caso esteja em modo edição
		async getData(transacaoId: string) {
			try {
				this.transacao = await getTransacaoById(transacaoId);
				this.transacao.data = this.transacao.data.split("T")[0];
				this.transacao.valor = this.transacao.valor;
				this.formMode = "edit";
			} catch (error) {
				console.error("Erro ao obter a transacao:", error);
			}
		},
		// Salva ou edita uma transacao
		async saveTransacao() {
			this.loading = true;

			try {
				// Validação dos campos obrigatórios individualmente
				if (!this.transacao.descricao) {
					Swal.fire({
						title: "Erro",
						text: "O campo 'Nome transação' é obrigatório.",
						icon: "error",
						confirmButtonColor: "#d33",
						customClass: {
							confirmButton: "custom-confirm-btn",
							cancelButton: "custom-cancel-btn",
						},
					});
					this.loading = false;
					return;
				}

				if (!this.transacao.conta_id) {
					Swal.fire({
						title: "Erro",
						text: "O campo 'Conta' é obrigatório.",
						icon: "error",
						confirmButtonColor: "#d33",
						customClass: {
							confirmButton: "custom-confirm-btn",
							cancelButton: "custom-cancel-btn",
						},
					});
					this.loading = false;
					return;
				}

				if (!this.transacao.categoria_id) {
					Swal.fire({
						title: "Erro",
						text: "O campo 'Categoria' é obrigatório.",
						icon: "error",
						confirmButtonColor: "#d33",
						customClass: {
							confirmButton: "custom-confirm-btn",
							cancelButton: "custom-cancel-btn",
						},
					});
					this.loading = false;
					return;
				}

				if (!this.transacao.tipo) {
					Swal.fire({
						title: "Erro",
						text: "O campo 'Tipo' é obrigatório.",
						icon: "error",
						confirmButtonColor: "#d33",
						customClass: {
							confirmButton: "custom-confirm-btn",
							cancelButton: "custom-cancel-btn",
						},
					});
					this.loading = false;
					return;
				}

				if (
					this.transacao.valor === null ||
					this.transacao.valor === undefined
				) {
					Swal.fire({
						title: "Erro",
						text: "O campo 'Valor' é obrigatório.",
						icon: "error",
						confirmButtonColor: "#d33",
						customClass: {
							confirmButton: "custom-confirm-btn",
							cancelButton: "custom-cancel-btn",
						},
					});
					this.loading = false;
					return;
				}

				if (!this.transacao.data) {
					Swal.fire({
						title: "Erro",
						text: "O campo 'Data' é obrigatório.",
						icon: "error",
						confirmButtonColor: "#d33",
						customClass: {
							confirmButton: "custom-confirm-btn",
							cancelButton: "custom-cancel-btn",
						},
					});
					this.loading = false;
					return;
				}

				if (this.formMode === "add") {
					const usuarioId = this.user?.id || "";
					await addTransacao(
						usuarioId,
						this.transacao.conta_id,
						this.transacao.categoria_id,
						this.transacao.descricao,
						this.transacao.tipo,
						this.transacao.valor,
						this.transacao.data,
						this.transacao.pendente
					);
				} else {
					await updateTransacao(
						this.transacao.id,
						this.transacao.conta_id,
						this.transacao.categoria_id,
						this.transacao.descricao,
						this.transacao.tipo,
						this.transacao.valor,
						this.transacao.data,
						this.transacao.pendente
					);
				}

				this.$router.go(-1); // Retorna para a página anterior após salvar
			} catch (error) {
				console.error("Erro ao salvar transação:", error);
				Swal.fire({
					title: "Erro",
					text: "Erro ao salvar transação. Tente novamente.",
					icon: "error",
					confirmButtonColor: "#d33",
					customClass: {
						confirmButton: "custom-confirm-btn",
						cancelButton: "custom-cancel-btn",
					},
				});
			} finally {
				this.loading = false;
			}
		},
		async fetchData() {
			this.contasOptions = await getContas(this.user.id);
			this.categoriasOptions = await getCategorias(this.user.id);
		},
	},
	// Carrega os dados da transacao ao criar o componente
	async created() {
		this.user = await getUser();
		await this.fetchData();
		const transacaoId = this.$route.query.id;
		if (transacaoId) {
			this.getData(transacaoId);
		} else {
			this.transacao.tipo = "Receita";
			this.transacao.categoria_id = this.categoriasMap[0].value;
			this.transacao.conta_id = this.contasMap[0].value;
		}
	},
});
</script>