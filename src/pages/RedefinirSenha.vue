<template>
	<v-container class="fill-height d-flex justify-center align-center custom-gradient">
		<v-card class="login-card pa-5 bg-transparent" flat>
			<v-card-title class="text-center mb-6">
				<h2 class="text-h5 font-weight-bold">Redefinir Senha</h2>
			</v-card-title>

			<v-card-text>
				<v-form @submit.prevent="handleChangePassword">
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
						<span>Redefinir Senha</span>
					</v-btn>
				</v-form>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { supabase } from "../api/supabase";
import Swal from "sweetalert2";

export default defineComponent({
	name: "RedefinirSenha",
	data() {
		return {
			newPassword: "",
			confirmPassword: "",
			loading: false,
		};
	},
	methods: {
		async handleChangePassword() {
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

			this.loading = true;
			try {
				const { error } = await supabase.auth.updateUser({
					password: this.newPassword,
				});
				if (error) {
					throw error;
				}
				Swal.fire({
					icon: "success",
					title: "Senha atualizada",
					text: "Sua senha foi redefinida com sucesso.",
					customClass: {
						confirmButton: "custom-confirm-btn",
						cancelButton: "custom-cancel-btn",
					},
				});
				this.$router.push("/login");
			} catch (error) {
				Swal.fire({
					icon: "error",
					title: "Erro",
					text:
						error?.message ||
						"Não foi possível redefinir sua senha.",
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
.custom-gradient {
	background: linear-gradient(to bottom, #04070c, #12213f);
}
</style>
