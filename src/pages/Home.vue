<template>
	<!-- Container principal da aplicação -->
	<v-main class="bg-black">
		<!-- Barra de aplicativo no topo -->
		<v-app-bar>
			<!-- Botão para abrir/fechar o menu lateral -->
			<v-btn icon @click="drawer = !drawer">
				<v-icon>mdi-menu</v-icon>
			</v-btn>

			<!-- Avatar do usuário com a inicial do nome -->
			<v-avatar color="primary" class="ml-2">{{ getName().split(" ")[0] }}</v-avatar>

			<!-- Saudação com o nome do usuário -->
			<v-toolbar-title>Olá, {{ getName() }}</v-toolbar-title>

			<v-spacer></v-spacer>

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
			<v-card class="home-card pa-1 mb-4" rounded="lg" flat elevation="1">
				<v-card-text>
					<div class="text-start mb-4">
						<div class="text-subtitle-1">Saldo Total</div>
						<div class="text-h4 font-weight-bold">R$ 24.562,80</div>
					</div>

					<v-row justify="center">
						<!-- Botão para adicionar receita -->
						<v-col cols="6">
							<v-btn block color="green" flat rounded="lg">
								<v-icon left class="mr-3">mdi-arrow-up</v-icon>Receita
							</v-btn>
						</v-col>
						<!-- Botão para adicionar despesa -->
						<v-col cols="6">
							<v-btn block color="red" flat rounded="lg">
								<v-icon left class="mr-3">mdi-arrow-down</v-icon>Despesa
							</v-btn>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>

			<v-row class="mb-2 fill-height">
				<!-- Card de despesas pendentes -->
				<v-col cols="6" class="d-flex flex-column">
					<v-card class="home-card pa-3" rounded="lg" flat elevation="1" style="flex: 1;">
						<div class="text-subtitle-2">
							<v-icon left class="mr-3" color="red">mdi-arrow-bottom-right</v-icon>Despesas Pendentes
						</div>
						<div class="text-subtitle-1 text-red font-weight-bold">R$ 1.240,00</div>
					</v-card>
				</v-col>
				<!-- Card de receitas pendentes -->
				<v-col cols="6" class="d-flex flex-column">
					<v-card class="home-card pa-3" rounded="lg" flat elevation="1" style="flex: 1;">
						<div class="text-subtitle-2">
							<v-icon left class="mr-3" color="green">mdi-arrow-top-right</v-icon>Receitas Pendentes
						</div>
						<div class="text-subtitle-1 text-green font-weight-bold">R$ 3.500,00</div>
					</v-card>
				</v-col>
			</v-row>

			<!-- Seção de transações recentes -->
			<div class="d-flex justify-space-between align-center mb-5">
				<div class="text-subtitle-1 font-weight-bold">Transações Recentes</div>
				<v-btn flat size="x-small" class="bg-transparent">Ver mais</v-btn>
			</div>

			<!-- Lista de transações -->
			<v-card
				v-for="(transaction, index) in transactions"
				:key="index"
				class="home-card pa-1 mb-2"
				rounded="lg"
				flat
				elevation="1"
			>
				<v-card-text>
					<v-row no-gutters align="center">
						<v-col cols="2">
							<v-avatar size="40" :color="transaction.colorIcon">
								<v-icon>{{ transaction.icon }}</v-icon>
							</v-avatar>
						</v-col>
						<v-col cols="6">
							<div class="text-subtitle-1">{{ transaction.title }}</div>
							<div class="text-caption">{{ transaction.subtitle }}</div>
						</v-col>
						<v-col cols="4" class="text-end font-weight-bold">
							<div :class="transaction.color">{{ transaction.amount }}</div>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-container>

		<!-- Navegação inferior -->
		<v-bottom-navigation grow color="white" class="mt-4">
			<v-btn>
				<v-icon>mdi-home</v-icon>
				<span>Início</span>
			</v-btn>
			<v-btn>
				<v-icon>mdi-chart-bar</v-icon>
				<span>Estatísticas</span>
			</v-btn>
			<v-btn>
				<v-icon>mdi-wallet</v-icon>
				<span>Carteira</span>
			</v-btn>
			<v-btn>
				<v-icon>mdi-account-circle</v-icon>
				<span>Perfil</span>
			</v-btn>
		</v-bottom-navigation>
	</v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { logout, getUser } from "../api/authService";

export default defineComponent({
	name: "Home",
	data() {
		return {
			drawer: false,
			user: {},
			menuItems: [
				{
					icon: "mdi-view-list",
					title: "Categorias",
					to: "/categorias",
				},
				{ icon: "mdi-bank", title: "Contas", to: "/contas" },
				{
					icon: "mdi-chart-line",
					title: "Relatórios",
					to: "/relatorios",
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
			transactions: [
				{
					icon: "mdi-cart",
					colorIcon: "red",
					title: "Compras",
					subtitle: "Amazon.com",
					amount: "R$ 84,99",
					color: "text-red",
				},
				{
					icon: "mdi-office-building",
					colorIcon: "blue",
					title: "Salário",
					subtitle: "Empresa Inc",
					amount: "R$ 4.250,00",
					color: "text-green",
				},
				{
					icon: "mdi-food-fork-drink",
					colorIcon: "orange",
					title: "Restaurante",
					subtitle: "Burger King",
					amount: "R$ 32,50",
					color: "text-red",
				},
			],
		};
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
		getName() {
			const fullName = this.user?.user_metadata?.full_name || "";
			return fullName.split(" ")[0];
		},
	},
	async created() {
		this.user = await getUser();
	},
});
</script>

<style scoped>
.home-card {
	width: 100%;
}
</style>