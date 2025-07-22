<template>
	<v-main>
		<v-container min-height="75vh">
			<!-- Barra de navegação -->
			<v-app-bar>
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
				</v-btn>

				<v-toolbar-title>Notificações</v-toolbar-title>

				<v-spacer />

				<!-- Botão para marcar todas como lidas -->
				<v-btn icon @click="marcarTodasComoLidas">
					<v-icon class="text-primary">mdi-check-all</v-icon>
				</v-btn>
			</v-app-bar>

			<!-- Campo de pesquisa -->
			<TextForm
				v-model="search"
				label="Pesquisar notificações"
				prependIcon="mdi-magnify"
				class="mb-3"
			/>

			<!-- Lista de notificações -->
			<v-list>
				<v-list-item
					v-for="(notificacao, index) in paginatedNotificacoes"
					:key="index"
					@click="abrirModal(notificacao)"
				>
					<v-list-item-action class="ml-3 mt-1 float-end">
						<v-icon v-if="notificacao.lida" color="green">mdi-check</v-icon>
						<v-icon v-else color="primary">mdi-email</v-icon>
					</v-list-item-action>

					<v-list-item-content>
						<v-list-item-title>{{ notificacao.mensagem }}</v-list-item-title>
						<v-list-item-subtitle class="text-caption">{{ formatarData(notificacao.data_envio) }}</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>

				<v-list-item v-if="!paginatedNotificacoes.length">
					<v-list-item-content>
						<v-list-item-title class="text-center">Nenhuma notificação encontrada</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-container>

		<!-- Paginação -->
		<Paginacao
			:currentPage="currentPage"
			:totalPages="totalPages"
			@prevPage="prevPage"
			@nextPage="nextPage"
		/>

		<!-- Modal de notificação -->
		<v-dialog v-model="dialog" max-width="500px">
			<v-card>
				<v-card-title class="font-weight-bold">Notificação</v-card-title>
				<v-divider></v-divider>
				<v-card-text class="pa-4">
					<p v-if="notificacaoSelecionada">{{ notificacaoSelecionada.mensagem }}</p>
					<p v-if="notificacaoSelecionada">{{ formatarData(notificacaoSelecionada.data_envio) }}</p>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="dialog = false">Fechar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-main>
</template>

<script lang="ts">
import { getUser } from "../api/authService";
import { getNotificacoes, updateNotificacao } from "../api/notificacaoService";

export default {
	name: "Notificacoes",
	data() {
		return {
			search: "",
			notificacoes: [],
			currentPage: 1,
			itemsPerPage: 10,
			dialog: false,
			notificacaoSelecionada: null,
		};
	},
	computed: {
		filteredNotificacoes() {
			return this.notificacoes.filter((n) =>
				n.mensagem.toLowerCase().includes(this.search.toLowerCase())
			);
		},
		paginatedNotificacoes() {
			const start = (this.currentPage - 1) * this.itemsPerPage;
			return this.filteredNotificacoes.slice(
				start,
				start + this.itemsPerPage
			);
		},
		totalPages() {
			return Math.ceil(
				this.filteredNotificacoes.length / this.itemsPerPage
			);
		},
	},
	methods: {
		async fetchNotificacoes() {
			const user = await getUser();
			const usuarioId = user?.id || "";
			this.notificacoes = await getNotificacoes(usuarioId);
		},
		async marcarComoLida(notificacao) {
			if (!notificacao.lida) {
				await updateNotificacao(notificacao.id, { lida: true });
				notificacao.lida = true; // Atualiza localmente sem recarregar tudo
			}
		},
		async marcarTodasComoLidas() {
			const promessas = this.notificacoes
				.filter((n) => !n.lida)
				.map((n) => updateNotificacao(n.id, { lida: true }));
			await Promise.all(promessas);
			// Atualiza localmente
			this.notificacoes.forEach((n) => (n.lida = true));
		},
		async abrirModal(notificacao) {
			this.notificacaoSelecionada = notificacao;
			await this.marcarComoLida(notificacao);
			this.dialog = true;
		},
		prevPage() {
			if (this.currentPage > 1) this.currentPage--;
		},
		nextPage() {
			if (this.currentPage < this.totalPages) this.currentPage++;
		},
		formatarData(timestamp: string) {
			const data = new Date(timestamp);
			return data.toLocaleString("pt-BR", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		},
	},
	created() {
		this.fetchNotificacoes();
	},
};
</script>
