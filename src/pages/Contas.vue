<template>
	<v-container>
		<v-row class="my-5">
			<v-col cols="6">
				<v-btn :to="'/home'">Página Inicial</v-btn>
			</v-col>
			<v-col cols="6" class="text-right">
				<v-btn @click="openDialogAdd">Adicionar Conta</v-btn>
			</v-col>
		</v-row>

		<v-data-table :headers="headers" :items="contas" item-key="id">
			<template v-slot:item.actions="{ item }">
				<v-btn color="primary" class="mr-3" @click="editConta(item)">Editar</v-btn>
				<v-btn color="error" @click="delConta(item.id)">Deletar</v-btn>
			</template>
		</v-data-table>

		<v-dialog v-model="dialog" max-width="500px">
			<v-card>
				<v-card-title>{{ formMode === 'edit' ? 'Editar Conta' : 'Adicionar Conta' }}</v-card-title>
				<v-card-text>
					<v-text-field v-model="nome" label="Nome da Conta" />
					<v-text-field v-model="saldoInicial" label="Saldo Inicial" type="number" />
					<v-select v-model="tipo" :items="tiposConta" label="Tipo" />
				</v-card-text>
				<v-card-actions>
					<v-btn @click="dialog = false">Cancelar</v-btn>
					<v-btn @click="saveConta">{{ formMode === 'edit' ? 'Salvar' : 'Adicionar' }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script lang="ts">
import {
	getContas,
	addConta,
	updateConta,
	deleteConta,
} from "../api/contaService";
import { getUser } from "@/api/authService";

export default {
	data() {
		return {
			dialog: false,
			formMode: "add" as "edit" | "add",
			contaId: "",
			nome: "",
			saldoInicial: 0,
			tipo: "",
			tiposConta: ["carteira", "conta corrente", "conta digital"],
			contas: [] as any[],
			headers: [
				{ title: "Nome", key: "nome" },
				{ title: "Tipo", key: "tipo" },
				{
					title: "Saldo Inicial",
					key: "saldo_inicial",
					align: "center",
				},
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
		async fetchContas() {
			const user = await getUser();
			const usuarioId = user?.id || "";
			this.contas = await getContas(usuarioId);
		},
		openDialogAdd() {
			this.formMode = "add";
			this.nome = "";
			this.saldoInicial = 0;
			this.tipo = "";
			this.dialog = true;
		},
		async saveConta() {
			if (this.formMode === "add") {
				const user = await getUser();
				await addConta(
					user?.id || "",
					this.nome,
					this.tipo,
					this.saldoInicial
				);
			} else {
				await updateConta(
					this.contaId || "",
					this.nome,
					this.tipo,
					this.saldoInicial
				);
			}
			this.dialog = false;
			this.fetchContas();
		},
		editConta(item: any) {
			this.formMode = "edit";
			this.contaId = item.id;
			this.nome = item.nome;
			this.saldoInicial = item.saldo_inicial;
			this.tipo = item.tipo;
			this.dialog = true;
		},
		async delConta(contaId: string) {
			await deleteConta(contaId);
			this.fetchContas();
		},
	},
	created() {
		this.fetchContas();
	},
};
</script>
