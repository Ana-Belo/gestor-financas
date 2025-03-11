<template>
	<v-main>
		<v-container>
			<!-- Barra de navegação superior -->
			<v-app-bar>
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
					<!-- Ícone de voltar -->
				</v-btn>
				<!-- Define o título da página dinamicamente -->
				<v-toolbar-title>{{ formMode === 'add' ? 'Nova' : 'Editar' }} Conta</v-toolbar-title>
			</v-app-bar>

			<!-- Card para o formulário de conta -->
			<v-card class="pa-5 mb-4 text-center">
				<!-- Campo para inserir o nome da conta -->
				<FormField v-model="conta.nome" label="Nome da Conta" class="mb-4" />

				<!-- Campo para selecionar tipo da conta -->
				<v-select
					v-model="conta.tipo"
					:items="tiposConta"
					label="Selecione o tipo de conta"
					variant="outlined"
					rounded="lg"
					density="comfortable"
					class="mb-4"
				></v-select>

				<!-- Campo para inserir o saldo inicial da conta -->
				<FormField v-model="conta.saldo_inicial" label="Saldo inicial" />
			</v-card>
		</v-container>
	</v-main>

	<!-- Rodapé com botão de salvar conta -->
	<v-footer class="d-flex justify-center pa-4">
		<v-btn
			type="submit"
			block
			color="primary"
			class="mt-4"
			size="large"
			rounded="lg"
			:loading="loading"
			@click="saveConta"
		>
			<!-- Indicador de carregamento enquanto salva -->
			<span>{{ formMode === 'add' ? 'Cadastrar' : 'Editar' }} Conta</span>
		</v-btn>
	</v-footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getContaById, addConta, updateConta } from "../api/contaService";
import { getUser } from "../api/authService";

export default defineComponent({
	name: "FormConta",
	data() {
		return {
			// Objeto que armazena os dados da conta
			conta: {
				id: "",
				nome: "",
				tipo: "Carteira",
				saldo_inicial: 0,
			},
			formMode: "add" as "edit" | "add", // Define se o formulário está no modo adicionar ou editar
			loading: false, // Indica se a operação está carregando
			tiposConta: ["Carteira", "Conta corrente", "Conta digital"],
		};
	},
	methods: {
		// Obtém os dados da conta caso esteja em modo edição
		async getData(contaId: string) {
			try {
				this.conta = await getContaById(contaId);
				this.formMode = "edit";
			} catch (error) {
				console.error("Erro ao obter a conta:", error);
			}
		},
		// Salva ou edita uma conta
		async saveConta() {
			this.loading = true;
			try {
				if (this.formMode === "add") {
					const user = await getUser();
					const usuarioId = user?.id || "";
					await addConta(
						usuarioId,
						this.conta.nome,
						this.conta.tipo,
						this.conta.saldo_inicial
					);
				} else {
					await updateConta(
						this.conta.id,
						this.conta.nome,
						this.conta.tipo,
						this.conta.saldo_inicial
					);
				}
				this.$router.go(-1); // Retorna para a página anterior após salvar
			} catch (error) {
				console.error("Erro ao salvar conta:", error);
			} finally {
				this.loading = false;
			}
		},
	},
	// Carrega os dados da conta ao criar o componente
	created() {
		const contaId = this.$route.query.id;
		if (contaId) {
			this.getData(contaId);
		}
	},
});
</script>