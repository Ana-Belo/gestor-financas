<template>
	<v-container>
		<v-row class="my-5">
			<v-col cols="6">
				<v-btn :to="'/home'">Página Inicial</v-btn>
			</v-col>
			<v-col cols="6" class="text-right">
				<v-btn @click="openDialogAdd">Adicionar Categoria</v-btn>
			</v-col>
		</v-row>

		<v-data-table :headers="headers" :items="categorias" item-key="id">
			<template v-slot:item.actions="{ item }">
				<v-btn color="primary" class="mr-3" @click="editCategoria(item)">Editar</v-btn>
				<v-btn color="error" @click="delCategoria(item.id)">Deletar</v-btn>
			</template>
		</v-data-table>

		<v-dialog v-model="dialog" max-width="500px">
			<v-card>
				<v-card-title>{{ formMode === 'edit' ? 'Editar Categoria' : 'Adicionar Categoria' }}</v-card-title>
				<v-card-text>
					<v-text-field v-model="nome" label="Nome da Categoria" />
					<v-select v-model="tipo" :items="tiposCategoria" label="Tipo" />
					<v-text-field v-model="icone" label="Ícone" />
				</v-card-text>
				<v-card-actions>
					<v-btn @click="dialog = false">Cancelar</v-btn>
					<v-btn @click="saveCategoria()">{{ formMode === 'edit' ? 'Salvar' : 'Adicionar' }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script lang="ts">
import {
	getCategorias,
	addCategoria,
	updateCategoria,
	deleteCategoria,
} from "../api/categoriaService";
import { getUser } from "../api/authService";
import { defineComponent } from "vue";

export default defineComponent({
	data() {
		return {
			dialog: false,
			formMode: "add" as "edit" | "add",
			categoriaId: "",
			nome: "",
			tipo: "",
			icone: "",
			tiposCategoria: ["receita", "despesa"],
			categorias: [] as any[],
			headers: [
				{ title: "Nome", key: "nome" },
				{ title: "Tipo", key: "tipo" },
				{ title: "Ícone", key: "icone" },
				{
					title: "Ações",
					key: "actions",
					sortable: false,
					align: "center",
				},
			],
		};
	},
	methods: {
		async fetchCategorias() {
			const user = await getUser();
			const usuarioId = user?.id || "";
			this.categorias = await getCategorias(usuarioId);
		},
		openDialogAdd() {
			this.formMode = "add";
			this.nome = "";
			this.tipo = "";
			this.icone = "";
			this.dialog = true;
		},
		async saveCategoria() {
			if (this.formMode === "add") {
				const user = await getUser();
				await addCategoria(
					user?.id || "",
					this.nome,
					this.tipo,
					this.icone
				);
			} else {
				await updateCategoria(
					this.categoriaId,
					this.nome,
					this.tipo,
					this.icone
				);
			}
			this.dialog = false;
			this.fetchCategorias();
		},
		editCategoria(item: any) {
			this.formMode = "edit";
			this.nome = item.nome;
			this.tipo = item.tipo;
			this.icone = item.icone;
			this.categoriaId = item.id;
			this.dialog = true;
		},
		async delCategoria(categoriaId: string) {
			await deleteCategoria(categoriaId);
			this.fetchCategorias();
		},
	},
	created() {
		this.fetchCategorias();
	},
});
</script>