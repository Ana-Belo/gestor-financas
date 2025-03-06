<template>
	<v-container>
		<v-app-bar color="primary" dark>
			<v-toolbar-title>{{ title }}</v-toolbar-title>
		</v-app-bar>

		<v-row justify="center" class="mt-15">
			<v-col cols="12" md="6">
				<v-card class="pa-5 text-center">
					<v-card-title>Bem-vindo ao Sistema de Gestão Financeira</v-card-title>
					<v-card-text>Escolha uma opção abaixo para navegar.</v-card-text>

					<v-btn block color="primary" class="mb-3" @click="goTo('contas')">Gerenciar Contas</v-btn>
					<v-btn block color="secondary" @click="goTo('categorias')">Gerenciar Categorias</v-btn>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	data() {
		return {
			title: "Gestão Financeira",
		};
	},
	methods: {
		goTo(route: string) {
			this.$router.push(`/${route}`);
		},
	},
});
</script>
