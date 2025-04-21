<template>
	<v-main>
		<v-container min-height="75vh">
			<!-- Barra de navegação superior -->
			<v-app-bar>
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
				</v-btn>
				<v-toolbar-title>Gráficos</v-toolbar-title>
			</v-app-bar>

			<SelectForm
				v-if="months.length"
				v-model="mesSelecionado"
				:items="months"
				prependIcon="mdi-calendar-blank"
				label="Mês"
				class="mt-5"
			/>

			<v-card class="mt-n3 border-sm" rounded="lg">
				<v-tabs v-model="tab" grow small>
					<v-tab value="one" class="bg-green">
						<v-icon left class="mr-3">mdi-arrow-up</v-icon>Receitas
					</v-tab>
					<v-tab value="two" class="bg-red">
						<v-icon left class="mr-3">mdi-arrow-down</v-icon>Despesas
					</v-tab>
				</v-tabs>

				<v-card-text>
					<v-tabs-window v-model="tab">
						<v-tabs-window-item value="one">
							<div class="mt-n8">
								<PieChart
									v-if="receitaChartData?.labels"
									:chartData="receitaChartData"
									:chartOptions="options"
								/>
							</div>
							<div class="mt-n5">
								<v-progress-linear
									v-for="(receita, i) in receitas"
									:key="i"
									v-model="receita.porcentagem"
									:color="`${receita.cor}EE`"
									height="30"
									class="mb-2"
									rounded
								>
									<template v-slot:default="{}">
										<v-row class="font-weight-bold">
											<v-col class="ml-4">{{i}}</v-col>
											<v-spacer></v-spacer>
											<v-col class="mr-3" cols="auto">{{ formatCurrency(receita.total) }}</v-col>
										</v-row>
									</template>
								</v-progress-linear>
							</div>
						</v-tabs-window-item>

						<v-tabs-window-item value="two">
							<div class="mt-n8">
								<PieChart
									v-if="despesaChartData?.labels"
									:chartData="despesaChartData"
									:chartOptions="options"
								/>
							</div>
							<div class="mt-n5">
								<v-progress-linear
									v-for="(despesa, i) in despesas"
									:key="i"
									v-model="despesa.porcentagem"
									:color="`${despesa.cor}EE`"
									height="30"
									class="mb-2"
									rounded
								>
									<template v-slot:default="{}">
										<v-row class="font-weight-bold">
											<v-col class="ml-4">{{i}}</v-col>
											<v-spacer></v-spacer>
											<v-col class="mr-3" cols="auto">{{ formatCurrency(despesa.total) }}</v-col>
										</v-row>
									</template>
								</v-progress-linear>
							</div>
						</v-tabs-window-item>
					</v-tabs-window>
				</v-card-text>
			</v-card>

			<v-card class="mt-5 border-sm" rounded="lg" v-if="orcamentos">
				<v-card-title class="bg-blue">Meu orçamento</v-card-title>
				<v-divider />
				<v-card-text>
					<div class="mt-n10">
						<PieChart
							v-if="orcamentoChartData?.labels"
							:chartData="orcamentoChartData"
							:chartOptions="options"
						/>
					</div>
					<div class="mt-n10">
						<v-row class="font-weight-bold">
							<v-spacer></v-spacer>
							<v-col class="mr-3" cols="auto">Gasto / Projetado</v-col>
						</v-row>
						<v-divider class="my-1" />
						<div v-for="(orcamento, i) in orcamentos" :key="i">
							<v-row class="font-weight-bold">
								<v-spacer></v-spacer>
								<v-col
									class="mr-3"
									cols="auto"
								>{{ formatCurrency(orcamento.totalGasto) }}/{{ formatCurrency(orcamento.total) }}</v-col>
							</v-row>
							<v-progress-linear
								v-model="orcamento.porcentagem"
								:color="`${orcamento.cor}EE`"
								height="30"
								class="mb-2"
								rounded
							>
								<template v-slot:default="{}">
									<v-row class="font-weight-bold">
										<v-col class="ml-4">{{i}}</v-col>
										<v-spacer></v-spacer>
										<v-col class="mr-3" cols="auto">{{ orcamento.porcentagem.toFixed(2) }} %</v-col>
									</v-row>
								</template>
							</v-progress-linear>
						</div>
					</div>
				</v-card-text>
			</v-card>
		</v-container>
	</v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getUser } from "../api/authService";
import { getTransacao } from "../api/transacaoService";
import { getOrcamento } from "../api/orcamentoService";

export default defineComponent({
	name: "Graficos",
	data() {
		return {
			tab: 0,
			mesSelecionado: this.getMesAtual(),
			months: this.gerarMeses(),
			despesaChartData: null,
			receitaChartData: null,
			orcamentoChartData: null,
			despesas: null,
			receitas: null,
			orcamentos: [],
			options: {
				responsive: true,
				cutout: "50%",
				plugins: {
					legend: {
						position: "right",
					},
					title: {
						display: false,
					},
					datalabels: {
						color: "#fff",
						font: {
							weight: "bold",
							size: 12,
						},
						formatter: (value: number) => {
							return `R$ ${value.toFixed(2)}`;
						},
					},
				},
			},
		};
	},
	methods: {
		formatCurrency(value: number) {
			return new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(value);
		},
		async fetchDados() {
			const user = await getUser();
			const usuarioId = user?.id || "";
			this.mesSelecionado = this.getMesAtual();
			const dados = await getTransacao(usuarioId, this.mesSelecionado);

			const despesas = dados.filter((item) => item.tipo === "Despesa");
			const receitas = dados.filter((item) => item.tipo === "Receita");

			// Agrupa e soma as despesas por categoria
			const despesasAgrupadas: Record<
				string,
				{ total: number; cor: string; porcentagem?: number }
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
			const totalDespesas = Object.values(despesasAgrupadas).reduce(
				(soma, item) => soma + item.total,
				0
			);
			for (const categoria in despesasAgrupadas) {
				const totalCategoria = despesasAgrupadas[categoria].total;
				despesasAgrupadas[categoria].porcentagem = Number(
					((totalCategoria / totalDespesas) * 100).toFixed(2)
				);
			}
			this.despesas = despesasAgrupadas;

			// Agrupa e soma as receitas por categoria
			const receitasAgrupadas: Record<
				string,
				{ total: number; cor: string; porcentagem?: number }
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
			const totalReceitas = Object.values(receitasAgrupadas).reduce(
				(soma, item) => soma + item.total,
				0
			);
			for (const categoria in receitasAgrupadas) {
				const totalCategoria = receitasAgrupadas[categoria].total;
				receitasAgrupadas[categoria].porcentagem = Number(
					((totalCategoria / totalReceitas) * 100).toFixed(2)
				);
			}
			this.receitas = receitasAgrupadas;

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
						borderWidth: 1,
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
						borderWidth: 1,
					},
				],
			};

			const orcamentos = await getOrcamento(usuarioId); // Busca as orcamentos associadas ao usuário

			// Cria um mapa de gastos reais por categoria (somando despesas e receitas)
			const gastosPorCategoria: Record<string, number> = {};

			despesas.forEach((d: any) => {
				const cat = d.categoria.nome;
				gastosPorCategoria[cat] =
					(gastosPorCategoria[cat] || 0) + d.valor;
			});

			receitas.forEach((r: any) => {
				const cat = r.categoria.nome;
				gastosPorCategoria[cat] =
					(gastosPorCategoria[cat] || 0) + r.valor;
			});

			// Agrupa e calcula os orçamentos com base nos gastos reais
			const orcamentosAgrupados: Record<
				string,
				{
					total: number;
					cor: string;
					totalGasto: number;
					porcentagem?: number;
				}
			> = {};

			orcamentos.forEach((o: any) => {
				const categoria = o.categoria.nome;
				const cor = o.categoria.cor_icone || "#ccc";
				const valorLimite = o.valor_limite;

				if (!orcamentosAgrupados[categoria]) {
					orcamentosAgrupados[categoria] = {
						total: valorLimite,
						cor,
						totalGasto: 0,
					};
				} else {
					orcamentosAgrupados[categoria].total += valorLimite;
				}

				// Atualiza totalGasto com os valores já computados
				const gasto = gastosPorCategoria[categoria] || 0;
				orcamentosAgrupados[categoria].totalGasto =
					(orcamentosAgrupados[categoria].totalGasto || 0) + gasto;
			});

			// Calcula a porcentagem de gasto com base no orçamento da categoria
			for (const categoria in orcamentosAgrupados) {
				const { total, totalGasto } = orcamentosAgrupados[categoria];
				orcamentosAgrupados[categoria].porcentagem = Number(
					((totalGasto / total) * 100).toFixed(2)
				);
			}

			this.orcamentos = orcamentosAgrupados;

			this.orcamentoChartData = {
				labels: Object.keys(orcamentosAgrupados),
				datasets: [
					{
						label: "Total R$",
						data: Object.values(orcamentosAgrupados).map(
							(r) => r.total
						),
						backgroundColor: Object.values(orcamentosAgrupados).map(
							(r) => r.cor
						),
						borderWidth: 1,
					},
				],
			};
		},
		getMesAtual() {
			const data = new Date();
			const mes = String(data.getMonth() + 1).padStart(2, "0");
			const ano = data.getFullYear();
			return `${mes}/${ano}`;
		},
		gerarMeses() {
			const meses = [];
			const dataAtual = new Date();

			// Começa 24 meses atrás
			dataAtual.setMonth(dataAtual.getMonth() - 24);

			for (let i = 0; i < 36; i++) {
				const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
				const ano = dataAtual.getFullYear();
				meses.push(`${mes}/${ano}`);

				// Avança um mês
				dataAtual.setMonth(dataAtual.getMonth() + 1);
			}

			return meses;
		},
	},
	created() {
		this.fetchDados();
	},
});
</script>
