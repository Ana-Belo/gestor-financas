<template>
	<!-- Container principal da aplicação -->
	<v-main class="bg-grey-lighten-4">
		<!-- Barra de aplicativo no topo -->
		<v-app-bar>
			<!-- Botão para abrir/fechar o menu lateral -->
			<v-btn icon @click="drawer = !drawer">
				<v-icon>mdi-menu</v-icon>
			</v-btn>

			<!-- Avatar do usuário com a inicial do nome -->
			<v-avatar variant="outlined" color="primary" class="ml-2">{{ getName().split("")[0] }}</v-avatar>

			<!-- Saudação com o nome do usuário -->
			<v-toolbar-title>Olá, {{ getName() }}</v-toolbar-title>

			<!-- Ícone de notificações -->
			<v-btn icon>
				<v-icon>mdi-bell-outline</v-icon>
			</v-btn>
		</v-app-bar>

		<!-- Menu lateral de navegação -->
		<v-navigation-drawer v-model="drawer" temporary>
			<v-list nav>
				<v-list-item
					v-for="(item, index) in menuItems"
					:key="index"
					:to="item.to"
					:prepend-icon="item.icon"
					:title="item.title"
					@click="item.action === 'logout' ? handleLogout() : null"
				></v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-container>
			<!-- Card de saldo total -->
			<v-card class="home-card pa-1 mb-4" rounded="lg" elevation="1">
				<v-card-text>
					<div class="text-start mb-4">
						<div class="text-subtitle-1">Saldo Total</div>
						<div class="text-h4 font-weight-bold">{{ formatCurrency(saldoTotal) }}</div>
					</div>

					<v-row justify="center">
						<!-- Botão para adicionar receita -->
						<v-col cols="6">
							<v-btn block color="green" rounded="lg" @click="dialogReceita = true">
								<v-icon left class="mr-3">mdi-arrow-up</v-icon>Receita
							</v-btn>
						</v-col>
						<!-- Botão para adicionar despesa -->
						<v-col cols="6">
							<v-btn block color="red" rounded="lg" @click="dialogDespesa = true">
								<v-icon left class="mr-3">mdi-arrow-down</v-icon>Despesa
							</v-btn>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>

			<!-- Seção de transações recentes -->
			<div class="d-flex justify-space-between align-center mb-1">
				<div class="text-subtitle-1 font-weight-bold">Minhas Contas</div>
				<div class="text-caption font-weight-bold mr-2">Saldo atual</div>
			</div>

			<!-- Lista de saldo de contas -->
			<v-card class="home-card mb-2" rounded="lg" elevation="1">
				<v-card-text>
					<v-row v-for="(conta, index) in contas" :key="index" no-gutters align="center">
						<v-col cols="auto">
							<v-icon size="18" class="mr-3">{{ iconesConta[conta.tipo] }}</v-icon>
						</v-col>
						<v-col cols="6">
							<div class="text-subtitle-1">{{ conta.nome }}</div>
						</v-col>
						<v-spacer></v-spacer>
						<v-col cols="auto" class="text-end font-weight-bold">
							<!-- Aplica a classe dinamicamente -->
							<div :class="getTextColor(conta.saldo)">{{ formatCurrency(conta.saldo) }}</div>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>

			<v-row class="mb-2 fill-height">
				<!-- Card de despesas pendentes -->
				<v-col cols="6" class="d-flex flex-column">
					<v-card class="home-card pa-3" rounded="lg" elevation="1" style="flex: 1;">
						<div class="text-subtitle-2">
							<v-icon left class="mr-3" color="red">mdi-arrow-bottom-right</v-icon>Despesas Pendentes
						</div>
						<div class="text-subtitle-1 text-red font-weight-bold">{{ formatCurrency(despesasPendentes) }}</div>
					</v-card>
				</v-col>
				<!-- Card de receitas pendentes -->
				<v-col cols="6" class="d-flex flex-column">
					<v-card class="home-card pa-3" rounded="lg" elevation="1" style="flex: 1;">
						<div class="text-subtitle-2">
							<v-icon left class="mr-3" color="green">mdi-arrow-top-right</v-icon>Receitas Pendentes
						</div>
						<div
							class="text-subtitle-1 text-green font-weight-bold"
						>{{ formatCurrency(receitasPendentes) }}</div>
					</v-card>
				</v-col>
			</v-row>

			<!-- Seção de transações recentes -->
			<div class="d-flex justify-space-between align-center mb-1">
				<div class="text-subtitle-1 font-weight-bold">Transações Recentes</div>
				<v-btn size="x-small" flat class="bg-transparent" @click="$router.push('/transacoes')">Ver mais</v-btn>
			</div>

			<!-- Lista de transações -->
			<v-card
				v-for="(transacao, index) in transacoes"
				:key="index"
				class="home-card pa-1 mb-2"
				rounded="lg"
				elevation="1"
				@click="$router.push({ path: '/formtransacao', query: { id: transacao.id } })"
				@mousedown="iniciarPressionar(transacao, $event)"
				@mouseup="cancelarPressionar"
				@mouseleave="cancelarPressionar"
				@touchstart="iniciarPressionar(transacao, $event)"
				@touchend="cancelarPressionar"
			>
				<v-card-text class="py-1">
					<v-row no-gutters align="center">
						<v-col cols="2">
							<v-avatar variant="outlined" size="40" :color="transacao.categoria.cor_icone">
								<v-icon>{{ transacao.categoria.icone }}</v-icon>
							</v-avatar>
						</v-col>
						<v-col cols="6">
							<div class="text-subtitle-1">{{ transacao.categoria.nome }}</div>
							<div class="text-caption">{{ transacao.descricao }}</div>
						</v-col>
						<v-col cols="4" class="text-end">
							<div
								class="text-subtitle-2 font-weight-bold"
								:class="transacao.tipo === 'Despesa' ? 'text-red': 'text-green'"
							>{{ formatCurrency(transacao.valor) }}</div>
							<div class="text-caption">{{formatarData(transacao.data)}}</div>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-container>

		<!-- Navegação inferior -->
		<v-bottom-navigation grow color="black" class="mt-4">
			<v-btn to="/transacoes">
				<v-icon>mdi-cash</v-icon>
				<span>Transações</span>
			</v-btn>
			<v-btn to="/graficos">
				<v-icon>mdi-chart-bar</v-icon>
				<span>Gráficos</span>
			</v-btn>
			<v-btn to="/contas">
				<v-icon>mdi-wallet</v-icon>
				<span>Carteira</span>
			</v-btn>
			<v-btn to="/perfil">
				<v-icon>mdi-account-circle</v-icon>
				<span>Perfil</span>
			</v-btn>
		</v-bottom-navigation>

		<!-- Dialog para adicionar receita -->
		<v-dialog v-model="dialogReceita">
			<v-card>
				<v-card-title>Adicionar Receita</v-card-title>
				<v-card-text class="mb-n4">
					<!-- Campo para inserir o valor -->
					<TextForm v-model="novaReceita.valor" label="Valor" type="number" />

					<!-- Campo para inserir a descrição -->
					<TextForm v-model="novaReceita.descricao" label="Descrição" />

					<!-- Campo para selecionar a conta -->
					<SelectForm v-model="novaReceita.conta_id" :items="contasMap" label="Conta" />

					<!-- Campo para selecionar a categoria -->
					<SelectForm v-model="novaReceita.categoria_id" :items="categoriasReceita" label="Categoria" />

					<!-- Campo para selecionar a data da transação -->
					<TextForm v-model="novaReceita.data" label="Data da Transação" type="date" />

					<!-- Campo para indicar se a receita está pendente -->
					<v-switch v-model="novaReceita.pendente" label="Receita Pendente?" />
				</v-card-text>
				<v-card-actions class="pa-4">
					<v-btn @click="dialogReceita = false, clear()">Cancelar</v-btn>
					<v-btn color="green" @click="salvarReceita">Salvar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Dialog para adicionar despesa -->
		<v-dialog v-model="dialogDespesa">
			<v-card>
				<v-card-title>Adicionar Despesa</v-card-title>
				<v-card-text class="mb-n4">
					<!-- Campo para inserir o valor -->
					<TextForm v-model="novaDespesa.valor" label="Valor" type="number" />

					<!-- Campo para inserir a descrição -->
					<TextForm v-model="novaDespesa.descricao" label="Descrição" />

					<!-- Campo para selecionar a conta -->
					<SelectForm v-model="novaDespesa.conta_id" :items="contasMap" label="Conta" />

					<!-- Campo para selecionar a categoria -->
					<SelectForm v-model="novaDespesa.categoria_id" :items="categoriasDespesa" label="Categoria" />

					<!-- Campo para selecionar a data da transação -->
					<TextForm v-model="novaDespesa.data" label="Data da Transação" type="date" />

					<!-- Campo para indicar se a despesa está pendente -->
					<v-switch v-model="novaDespesa.pendente" label="Despesa Pendente?" />
				</v-card-text>
				<v-card-actions class="pa-4">
					<v-btn @click="dialogDespesa = false, clear()">Cancelar</v-btn>
					<v-btn color="red" @click="salvarDespesa">Salvar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { logout, getUser } from "../api/authService";
import {
	getSaldoAtual,
	getSaldoContas,
	getSaldoDespesasPendentes,
	getSaldoReceitasPendentes,
	getUltimasTransacoes,
	addTransacao,
} from "../api/homeService";
import { getCategorias } from "../api/categoriaService";
import { getContas } from "../api/contaService";
import Swal from "sweetalert2";
import { deleteTransacao } from "../api/transacaoService";

export default defineComponent({
	name: "Home",
	data() {
		return {
			drawer: false,
			timeoutId: null,
			user: {
				id: "",
			},
			saldoTotal: 0,
			despesasPendentes: 0,
			receitasPendentes: 0,
			contas: [],
			transacoes: [],
			contasOptions: [],
			categoriasOptions: [],
			dialogReceita: false,
			dialogDespesa: false,
			novaReceita: {
				valor: 0,
				descricao: "",
				conta_id: "",
				categoria_id: "",
				data: new Date().toISOString().split("T")[0],
			},
			novaDespesa: {
				valor: 0,
				descricao: "",
				conta_id: "",
				categoria_id: "",
				data: new Date().toISOString().split("T")[0],
			},
			iconesConta: {
				Carteira: "mdi-wallet",
				"Conta corrente": "mdi-bank",
				"Conta digital": "mdi-laptop",
			},
			menuItems: [
				{
					icon: "mdi-view-list",
					title: "Categorias",
					to: "/categorias",
				},
				{ icon: "mdi-bank", title: "Contas", to: "/contas" },
				{ icon: "mdi-cash", title: "Transações", to: "/transacoes" },
				{ icon: "mdi-cash", title: "Orçamentos", to: "/orcamento" },
				{
					icon: "mdi-chart-line",
					title: "Gráficos",
					to: "/graficos",
				},
				{
					icon: "mdi-cog",
					title: "Configurações",
					to: "/configuracoes",
				},
				{
					icon: "mdi-logout",
					title: "Sair",
					action: "logout",
				},
			],
		};
	},
	computed: {
		categoriasReceita() {
			return this.categoriasOptions
				.filter((c) => c.tipo === "Receita")
				.map((c) => ({ value: c.id, title: c.nome }));
		},
		categoriasDespesa() {
			return this.categoriasOptions
				.filter((c) => c.tipo === "Despesa")
				.map((c) => ({ value: c.id, title: c.nome }));
		},
		contasMap() {
			return this.contasOptions.map((c) => ({
				value: c.id,
				title: c.nome,
			}));
		},
	},
	methods: {
		async handleLogout() {
			try {
				await logout();
				this.$router.push("/login");
			} catch (error) {
				console.error("Erro ao fazer logout:", error);
			}
		},
		async salvarReceita() {
			await addTransacao({
				...this.novaReceita,
				usuario_id: this.user.id,
				tipo: "Receita",
			});
			this.clear();
			this.dialogReceita = false;
			await this.fetchSaldos();
		},
		async salvarDespesa() {
			await addTransacao({
				...this.novaDespesa,
				usuario_id: this.user.id,
				tipo: "Despesa",
			});
			this.clear();
			this.dialogDespesa = false;
			await this.fetchSaldos();
		},
		clear() {
			this.novaReceita = {
				valor: 0,
				descricao: "",
				conta_id: "",
				categoria_id: "",
				data: new Date().toISOString().split("T")[0],
			};
			this.novaDespesa = {
				valor: 0,
				descricao: "",
				conta_id: "",
				categoria_id: "",
				data: new Date().toISOString().split("T")[0],
			};
		},
		getName() {
			const fullName = this.user?.user_metadata?.full_name || "";
			return fullName.split(" ")[0];
		},
		getTextColor(amount: number) {
			return amount < 0 ? "text-red" : "text-green";
		},
		formatCurrency(value: number) {
			return new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(value);
		},
		formatarData(data) {
			const [ano, mes, dia] = data.split("T")[0].split("-");
			return `${dia}/${mes}/${ano}`;
		},
		async deleteTransacoes(transacao) {
			Swal.fire({
				title: "Deseja excluir esta transação?",
				text: transacao.descricao,
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#d33",
				cancelButtonColor: "#3085d6",
				confirmButtonText: "Sim, excluir!",
				cancelButtonText: "Cancelar",
				customClass: {
					confirmButton: "custom-confirm-btn",
					cancelButton: "custom-cancel-btn",
				},
			}).then(async (result) => {
				if (result.isConfirmed) {
					await deleteTransacao(transacao.id);
					await this.fetchSaldos();
				}
			});
		},
		iniciarPressionar(transacao: any) {
			this.timeoutId = setTimeout(() => {
				this.deleteTransacoes(transacao);
			}, 700);
		},
		cancelarPressionar() {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = null;
			}
		},
		async fetchSaldos() {
			this.saldoTotal = await getSaldoAtual(this.user.id);
			this.contas = await getSaldoContas(this.user.id);
			this.transacoes = await getUltimasTransacoes(this.user.id);
			this.despesasPendentes = await getSaldoDespesasPendentes(
				this.user.id
			);
			this.receitasPendentes = await getSaldoReceitasPendentes(
				this.user.id
			);
		},
		async fetchData() {
			this.contasOptions = await getContas(this.user.id);
			this.categoriasOptions = await getCategorias(this.user.id);
		},
	},
	async created() {
		this.user = await getUser();
		await this.fetchSaldos();
		await this.fetchData();
	},
});
</script>

<style scoped>
.home-card {
	width: 100%;
}
</style>