<template>
	<v-main>
		<v-container class="py-6">
			<v-app-bar>
				<v-btn icon @click="$router.go(-1)">
					<v-icon>mdi-arrow-left</v-icon>
				</v-btn>
				<v-toolbar-title>Configurações</v-toolbar-title>
			</v-app-bar>

			<v-card class="mx-auto mt-6 pa-4" max-width="500">
				<!-- Alterar Senha -->
				<h2 class="text-h6 mb-4">Alterar Senha</h2>
				<v-form @submit.prevent="confirmChangePassword">
					<TextForm v-model="newPassword" label="Nova senha" prependIcon="mdi-lock-outline" isPassword />
					<TextForm
						v-model="confirmPassword"
						label="Confirmar nova senha"
						prependIcon="mdi-lock-outline"
						isPassword
					/>

					<v-btn
						type="submit"
						block
						color="primary"
						class="mt-4"
						size="large"
						rounded="lg"
						:loading="loading"
					>
						<span>Alterar Senha</span>
					</v-btn>
				</v-form>
			</v-card>
		</v-container>
	</v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Swal from "sweetalert2";
import { updatePassword } from "../api/authService";

export default defineComponent({
	name: "Configuracoes",
	data() {
		return {
			newPassword: "",
			confirmPassword: "",
			loading: false,
		};
	},
	methods: {
		async confirmChangePassword() {
			if (this.newPassword !== this.confirmPassword) {
				Swal.fire({
					icon: "error",
					title: "Erro",
					text: "As senhas não coincidem.",
					customClass: {
						confirmButton: "custom-confirm-btn",
						cancelButton: "custom-cancel-btn",
					},
				});
				return;
			}

			const confirmResult = await Swal.fire({
				title: "Confirmar alteração",
				text: "Deseja realmente alterar sua senha?",
				icon: "question",
				showCancelButton: true,
				confirmButtonText: "Sim, alterar",
				cancelButtonText: "Cancelar",
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				customClass: {
					confirmButton: "custom-confirm-btn",
					cancelButton: "custom-cancel-btn",
				},
			});

			if (confirmResult.isConfirmed) {
				this.changePassword();
			}
		},

		async changePassword() {
			this.loading = true;
			try {
				await updatePassword(this.newPassword);

				Swal.fire({
					icon: "success",
					title: "Senha alterada",
					text: "Sua senha foi alterada com sucesso.",
					customClass: {
						confirmButton: "custom-confirm-btn",
						cancelButton: "custom-cancel-btn",
					},
				});

				this.newPassword = "";
				this.confirmPassword = "";
			} catch (error) {
				console.error("Erro ao alterar senha:", error);
				Swal.fire({
					icon: "error",
					title: "Erro",
					text:
						error?.message || "Não foi possível alterar sua senha.",
					customClass: {
						confirmButton: "custom-confirm-btn",
						cancelButton: "custom-cancel-btn",
					},
				});
			} finally {
				this.loading = false;
			}
		},
	},
});
</script>

<style scoped>
.login-card {
	width: 100%;
	border-radius: 16px;
}
</style>
