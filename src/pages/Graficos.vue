<template>
	<v-main>
		<v-container height="85vh">
			<!-- Barra de navegação superior -->
			<v-app-bar>
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
				</v-btn>
				<v-toolbar-title>Relatórios</v-toolbar-title>
			</v-app-bar>

			<!-- Gráfico de Despesas -->
			<v-card class="pa-5 mb-4 text-center" v-if="despesaChartData && despesaChartData.labels">
				<v-card-title>Totais de Despesas</v-card-title>
				<v-card-text>
					<BarChart :chart-data="despesaChartData" :chart-options="chartOptions" />
				</v-card-text>
			</v-card>

			<!-- Gráfico de Receitas -->
			<v-card class="pa-5 mb-4 text-center" v-if="receitaChartData && receitaChartData.labels">
				<v-card-title>Totais de Receitas</v-card-title>
				<v-card-text>
					<BarChart :chart-data="receitaChartData" :chart-options="chartOptions" />
				</v-card-text>
			</v-card>
		</v-container>
	</v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getUser } from "../api/authService";
import { getTransacao } from "../api/transacaoService";

export default defineComponent({
	name: "Graficos",
	data() {
		return {
			despesaChartData: null,
			receitaChartData: null,
			chartOptions: {
				responsive: true,
				plugins: {
					legend: { display: false },
					title: { display: false },
				},
			},
		};
	},
	methods: {
		async fetchDados() {
			const user = await getUser();
			const usuarioId = user?.id || "";
			const dados = await getTransacao(usuarioId);

			const despesas = dados.filter((item) => item.tipo === "Despesa");
			const receitas = dados.filter((item) => item.tipo === "Receita");

			// Agrupa e soma as despesas por categoria
			const despesasAgrupadas: Record<
				string,
				{ total: number; cor: string }
			> = {};
			despesas.forEach((d: any) => {
				const categoria = d.categoria.nome;
				if (!despesasAgrupadas[categoria]) {
					despesasAgrupadas[categoria] = {
						total: d.valor,
						cor: d.categoria.cor_icone || "#ccc", // cor padrão se não tiver
					};
				} else {
					despesasAgrupadas[categoria].total += d.valor;
				}
			});

			// Agrupa e soma as receitas por categoria
			const receitasAgrupadas: Record<
				string,
				{ total: number; cor: string }
			> = {};
			receitas.forEach((r: any) => {
				const categoria = r.categoria.nome;
				if (!receitasAgrupadas[categoria]) {
					receitasAgrupadas[categoria] = {
						total: r.valor,
						cor: r.categoria.cor_icone || "#ccc",
					};
				} else {
					receitasAgrupadas[categoria].total += r.valor;
				}
			});

			this.despesaChartData = {
				labels: Object.keys(despesasAgrupadas),
				datasets: [
					{
						label: "Total R$",
						data: Object.values(despesasAgrupadas).map(
							(d) => d.total
						),
						backgroundColor: Object.values(despesasAgrupadas).map(
							(d) => d.cor
						),
					},
				],
			};

			this.receitaChartData = {
				labels: Object.keys(receitasAgrupadas),
				datasets: [
					{
						label: "Total R$",
						data: Object.values(receitasAgrupadas).map(
							(r) => r.total
						),
						backgroundColor: Object.values(receitasAgrupadas).map(
							(r) => r.cor
						),
					},
				],
			};
		},
	},
	created() {
		this.fetchDados();
	},
});
</script>
