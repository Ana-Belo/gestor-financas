<template>
	<Pie :data="chartData" :options="chartOptions" />
</template>

<script lang="ts">
import ChartDataLabels from "chartjs-plugin-datalabels";
import { defineComponent } from "vue";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Registro dos elementos necessários para um gráfico de pizza
ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

export default defineComponent({
	name: "PieChart",
	components: { Pie },
	props: {
		chartData: {
			type: Object,
			required: true,
		},
		chartOptions: {
			type: Object,
			required: true,
		},
	},
});
</script>
