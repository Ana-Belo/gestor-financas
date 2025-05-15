<template>
	<v-container class="d-flex justify-center align-center pa-4">
		<!-- Botão para página anterior -->
		<v-btn icon @click="$emit('prevPage')" :disabled="currentPage === 1" density="compact">
			<v-icon>mdi-chevron-left</v-icon>
		</v-btn>

		<!-- Indicação da página atual -->
		<small class="mx-3">Página {{ currentPage }} de {{ totalPages }}</small>

		<!-- Botão para próxima página -->
		<v-btn icon @click="$emit('nextPage')" :disabled="currentPage === totalPages" density="compact">
			<v-icon>mdi-chevron-right</v-icon>
		</v-btn>
	</v-container>
</template>

<script lang="ts">
export default {
	name: "Paginacao",
	props: {
		currentPage: {
			type: Number,
			required: true,
		},
		totalPages: {
			type: Number,
			required: true,
		},
	},
};
</script>