<template>
	<div>
		<h2 class="text-primary">CoinPets</h2>
		<p class="text-subtitle-2">Gestor de gastos pessoais</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			hover: false,
		};
	},
	methods: {
		toggleHover(state) {
			this.hover = state;
		},
	},
};
</script>
