<template>
	<v-main class="bg-white">
		<v-container>
			<v-app-bar>
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
				</v-btn>
				<v-toolbar-title>{{formMode === 'add' ? 'Nova' : 'Editar'}} Categoria</v-toolbar-title>
				<v-spacer></v-spacer>
			</v-app-bar>

			<FormField v-model="search" label="Pesquisar categorias" prependIcon="mdi-magnify" class="mb-3" />
		</v-container>
	</v-main>
	<v-footer class="d-flex justify-center pa-4">
		<v-btn
			type="submit"
			block
			color="primary"
			class="mt-4"
			size="large"
			rounded="lg"
			:disabled="loading"
		>
			<v-progress-circular v-if="loading" indeterminate color="white" size="20" />
			<span v-else>{{formMode === 'add' ? 'Cadastrar' : 'Editar'}} categoria</span>
		</v-btn>
	</v-footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getCategoriaById } from "../api/categoriaService";

export default defineComponent({
	name: "FormCategorias",
	data() {
		return {
			categoria: {},
			formMode: "add" as "edit" | "add",
			loading: false,
		};
	},
	methods: {
		async getData(categoriaId: string) {
			try {
				this.categoria = await getCategoriaById(categoriaId);
				console.log(this.categoria);
			} catch (error) {
				console.error("Erro ao obter a categoria:", error);
			}
		},
	},
	created() {
		const categoriaId = this.$route.query.id;
		if (categoriaId) {
			this.formMode = "edit";
			this.getData(categoriaId);
		}
	},
});
</script>