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
				<v-toolbar-title>{{ formMode === 'add' ? 'Nova' : 'Editar' }} Categoria</v-toolbar-title>
				<v-spacer></v-spacer>
				<!-- Espaço para alinhar os itens corretamente -->
			</v-app-bar>

			<!-- Card para o formulário de categoria -->
			<v-card class="pa-5 mb-4 text-center">
				<!-- Campo para inserir o nome da categoria -->
				<FormField v-model="categoria.nome" label="Nome da Categoria" />
				<v-row justify="center">
					<!-- Botão para selecionar categoria do tipo "Receita" -->
					<v-col cols="6">
						<v-btn
							block
							:color="categoria.tipo == 'Receita' ? 'green': 'grey'"
							flat
							rounded="lg"
							@click="categoria.tipo = 'Receita'"
						>
							<v-icon left class="mr-3">mdi-arrow-up</v-icon>Receita
						</v-btn>
					</v-col>
					<!-- Botão para selecionar categoria do tipo "Despesa" -->
					<v-col cols="6">
						<v-btn
							block
							:color="categoria.tipo == 'Despesa' ? 'red': 'grey'"
							flat
							rounded="lg"
							@click="categoria.tipo = 'Despesa'"
						>
							<v-icon left class="mr-3">mdi-arrow-down</v-icon>Despesa
						</v-btn>
					</v-col>
				</v-row>
			</v-card>

			<!-- Card para seleção de ícone e cor -->
			<v-card class="pa-5 d-flex flex-column align-center" elevation="1">
				<!-- Ícone selecionado com cor -->
				<v-avatar
					size="72"
					class="mb-3"
					:style="{ backgroundColor: categoria.cor_icone }"
					@click="iconDialog = true"
				>
					<v-icon size="48" :color="categoria.cor_icone ? 'white' : 'black'">{{ categoria.icone }}</v-icon>
				</v-avatar>
				<v-btn variant="text" @click="iconDialog = true">Alterar Ícone</v-btn>
				<!-- Seleção de cor do ícone -->
				<v-color-picker
					elevation="0"
					hide-inputs
					v-model="categoria.cor_icone"
					class="mt-4 mx-auto"
					label="Escolha a cor do ícone"
				/>
			</v-card>
		</v-container>
	</v-main>

	<!-- Rodapé com botão de salvar categoria -->
	<v-footer class="d-flex justify-center pa-4">
		<v-btn
			type="submit"
			block
			color="primary"
			class="mt-4"
			size="large"
			rounded="lg"
			:loading="loading"
			@click="saveCategory"
		>
			<!-- Indicador de carregamento enquanto salva -->
			<span>{{ formMode === 'add' ? 'Cadastrar' : 'Editar' }} Categoria</span>
		</v-btn>
	</v-footer>

	<!-- Diálogo para seleção de ícone -->
	<v-dialog v-model="iconDialog" scrollable max-width="500">
		<v-card max-height="50vh">
			<v-card-title class="pa-3">Selecione um Ícone</v-card-title>
			<v-divider></v-divider>
			<v-card-text class="pa-3">
				<v-container>
					<v-row>
						<!-- Lista de ícones disponíveis -->
						<v-col v-for="icon in mdiIcons" :key="icon" cols="3" class="text-center">
							<v-btn icon @click="selectIcon(icon)">
								<v-icon>{{ icon }}</v-icon>
							</v-btn>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions class="pa-3">
				<v-spacer></v-spacer>
				<v-btn color="red" text @click="iconDialog = false">Cancelar</v-btn>
				<v-spacer></v-spacer>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
	getCategoriaById,
	addCategoria,
	updateCategoria,
} from "../api/categoriaService";
import { getUser } from "../api/authService";

export default defineComponent({
	name: "FormCategoria",
	data() {
		return {
			// Objeto que armazena os dados da categoria
			categoria: {
				id: "",
				nome: "",
				tipo: "Receita",
				icone: "mdi-tag",
				cor_icone: "#2196F3",
			},
			formMode: "add" as "edit" | "add", // Define se o formulário está no modo adicionar ou editar
			loading: false, // Indica se a operação está carregando
			iconDialog: false, // Controla a exibição do diálogo de seleção de ícone
			// Lista de ícones disponíveis para seleção
			mdiIcons: [
				"mdi-home",
				"mdi-account",
				"mdi-cart",
				"mdi-cash",
				"mdi-food",
				"mdi-gift",
				"mdi-tag",
				"mdi-wallet",
				"mdi-bank",
				"mdi-chart-bar",
				"mdi-car",
				"mdi-credit-card",
				"mdi-currency-usd",
				"mdi-dumbbell",
				"mdi-gas-station",
				"mdi-heart",
				"mdi-hospital",
				"mdi-laptop",
				"mdi-lightbulb",
				"mdi-medical-bag",
				"mdi-movie",
				"mdi-music",
				"mdi-phone",
				"mdi-silverware",
				"mdi-tshirt-crew",
				"mdi-umbrella",
				"mdi-water",
				"mdi-train",
				"mdi-subway",
				"mdi-shopping",
				"mdi-school",
				"mdi-hammer",
				"mdi-gavel",
				"mdi-file-document",
				"mdi-dog",
				"mdi-cat",
				"mdi-basketball",
				"mdi-football",
				"mdi-tennis",
				"mdi-volleyball",
				"mdi-billiards",
				"mdi-cake",
				"mdi-coffee",
				"mdi-ice-cream",
				"mdi-beer",
				"mdi-currency-eur",
				"mdi-currency-gbp",
			],
		};
	},
	methods: {
		// Obtém os dados da categoria caso esteja em modo edição
		async getData(categoriaId: string) {
			try {
				this.categoria = await getCategoriaById(categoriaId);
				this.formMode = "edit";
			} catch (error) {
				console.error("Erro ao obter a categoria:", error);
			}
		},
		// Salva ou edita uma categoria
		async saveCategory() {
			this.loading = true;
			try {
				if (this.formMode === "add") {
					const user = await getUser();
					const usuarioId = user?.id || "";
					await addCategoria(
						usuarioId,
						this.categoria.nome,
						this.categoria.tipo,
						this.categoria.icone,
						this.categoria.cor_icone
					);
				} else {
					await updateCategoria(
						this.categoria.id,
						this.categoria.nome,
						this.categoria.tipo,
						this.categoria.icone,
						this.categoria.cor_icone
					);
				}
				this.$router.go(-1); // Retorna para a página anterior após salvar
			} catch (error) {
				console.error("Erro ao salvar categoria:", error);
			} finally {
				this.loading = false;
			}
		},
		// Seleciona um ícone e fecha o diálogo
		selectIcon(icon: string) {
			this.categoria.icone = icon;
			this.iconDialog = false;
		},
	},
	// Carrega os dados da categoria ao criar o componente
	created() {
		const categoriaId = this.$route.query.id;
		if (categoriaId) {
			this.getData(categoriaId);
		}
	},
});
</script>