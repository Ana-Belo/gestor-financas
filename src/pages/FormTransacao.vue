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
				<v-toolbar-title>{{ formMode === 'add' ? 'Nova' : 'Editar' }} Transação</v-toolbar-title>
			</v-app-bar>

			<!-- Card para o formulário de transacao -->
			<v-card class="pa-5 mb-4 text-center">
				<!-- Campo para inserir o nome da transacao -->
				<TextForm v-model="transacao.descricao" label="Nome da Transação" class="mb-4" />

				<!-- Campo para selecionar tipo da transacao -->
				<SelectForm v-model="transacao.tipo" :items="tiposTransacao" label="Selecione o tipo de transação" />

				<!-- Campo para inserir o saldo inicial da transacao -->
				<TextForm v-model="transacao.valor" label="Valor" mask="currency" />

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
import { getTransacaoById, addTransacao, updateTransacao } from "../api/transacaoService";
import { getUser } from "../api/authService";
import { getCategorias } from "../api/categoriaService";
import { getContas } from "../api/contaService";

export default defineComponent({
	name: "FormTransacao",
	data() {
		return {
			user: {},
			contasOptions: [],
			categoriasOptions: [],
			// Objeto que armazena os dados da transacao
			transacao: {
				id: "",
				conta_id: "",
            	categoria_id: "",
            	descricao: "",
            	tipo: "Receita",
            	valor: "",
            	data: "",
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
   		"transacao.tipo": function () {
     	 	this.transacao.categoria_id = "";
    	}
  	},
	methods: {
		// Obtém os dados da transacao caso esteja em modo edição
		async getData(transacaoId: string) {
			try {
				this.transacao = await getTransacaoById(transacaoId);
				this.transacao.data = this.transacao.data.split("T")[0];
				this.transacao.valor = this.transacao.valor * 100;
				this.formMode = "edit";
			} catch (error) {
				console.error("Erro ao obter a transacao:", error);
			}
		},
		// Salva ou edita uma transacao
		async saveTransacao() {
			this.loading = true;
			try {
				//COLOCAR VALIDAÇÕES PARA VERIFICAR SE O USUARIO PREENCHEU TODOS OS CAMPOS
				this.transacao.valor = this.transacao.valor / 100;
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
						this.transacao.pendente,
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
						this.transacao.pendente,
					);
				}
				this.$router.go(-1); // Retorna para a página anterior após salvar
			} catch (error) {
				console.error("Erro ao salvar transacao:", error);
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
		}
	},
});
</script>