<template>
	<v-main>
		<v-container height="82vh">
			<!-- Barra de navegação superior -->
			<v-app-bar>
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
					<!-- Ícone de voltar -->
				</v-btn>
				<!-- Define o título da página dinamicamente -->
				<v-toolbar-title>{{ formMode === 'add' ? 'Nova' : 'Editar' }} Orçamento</v-toolbar-title>
			</v-app-bar>

			<!-- Card para o formulário de orcamento -->
			<v-card class="pa-5 mb-4 text-center">
							<!-- Campo para inserir o saldo inicial da orcamento -->
				<TextForm v-model="orcamento.valor_limite" label="Valor" mask="currency" />

					<!-- Campo para selecionar a categoria -->
				<SelectForm v-model="orcamento.categoria_id" :items="categoriasMap" label="Categoria" />

					<!-- Campo para selecionar a data da transação -->
				<TextForm v-model="orcamento.mes_ano" label="Mês do Orçamento"/>
			</v-card>
		</v-container>

		<!-- Rodapé com botão de salvar orcamento -->
		<v-container class="d-flex justify-center pa-4">
			<v-btn
				type="submit"
				block
				color="primary"
				class="mt-4"
				size="large"
				rounded="lg"
				:loading="loading"
				@click="saveOrcamento"
			>
				<!-- Indicador de carregamento enquanto salva -->
				<span>{{ formMode === 'add' ? 'Cadastrar' : 'Editar' }} Orçamento</span>
			</v-btn>
		</v-container>
	</v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getOrcamentoById, addOrcamento, updateOrcamento } from "../api/orcamentoService";
import { getUser } from "../api/authService";
import { getCategorias } from "../api/categoriaService";
import Swal from "sweetalert2";

export default defineComponent({
	name: "FormOrcamento",
	data() {
		return {
			user: {},
			categoriasOptions: [],
			// Objeto que armazena os dados da orcamento
			orcamento: {
				id: "",
            	categoria_id: "",
            	valor_limite: "",
            	mes_ano: "",
			},
			formMode: "add" as "edit" | "add", // Define se o formulário está no modo adicionar ou editar
			loading: false, // Indica se a operação está carregando
		};
	},
	computed: {
		categoriasMap() {
			return this.categoriasOptions
				.map((c) => ({ value: c.id, title: c.nome }));
		},
	},
	methods: {
		// Obtém os dados da orcamento caso esteja em modo edição
		async getData(orcamentoId: string) {
			try {
				this.orcamento = await getOrcamentoById(orcamentoId);
				this.orcamento.valor_limite = this.orcamento.valor_limite * 100;
				this.formMode = "edit";
			} catch (error) {
				console.error("Erro ao obter a orcamento:", error);
			}
		},
		// Salva ou edita uma orcamento
		async saveOrcamento() {
			this.loading = true;

			try {
				// Validação dos campos obrigatórios individualmente
				if (!this.orcamento.categoria_id) {
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

				if (this.orcamento.valor_limite === null || this.orcamento.valor_limite === undefined) {
					Swal.fire({
						title: "Erro",
						text: "O campo 'Valor Limite' é obrigatório.",
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

				if (!this.orcamento.mes_ano) {
					Swal.fire({
						title: "Erro",
						text: "O campo 'Mês/Ano' é obrigatório.",
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

				this.orcamento.valor_limite = this.orcamento.valor_limite / 100;

				if (this.formMode === "add") {
					const usuarioId = this.user?.id || "";
					await addOrcamento(
						usuarioId,
						this.orcamento.categoria_id,
						this.orcamento.valor_limite,
						this.orcamento.mes_ano
					);
				} else {
					await updateOrcamento(
						this.orcamento.id,
						this.orcamento.categoria_id,
						this.orcamento.valor_limite,
						this.orcamento.mes_ano
					);
				}

				this.$router.go(-1); // Retorna para a página anterior após salvar
			} catch (error) {
				console.error("Erro ao salvar orçamento:", error);
				Swal.fire({
					title: "Erro",
					text: "Erro ao salvar orçamento. Tente novamente.",
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
			this.categoriasOptions = await getCategorias(this.user.id);
		},
	},
	// Carrega os dados da orcamento ao criar o componente
	async created() {
		this.user = await getUser();
		await this.fetchData();
		const orcamentoId = this.$route.query.id;
		if (orcamentoId) {
			this.getData(orcamentoId);
		}
	},
});
</script>