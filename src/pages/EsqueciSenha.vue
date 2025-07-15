<template>
	<v-container class="fill-height d-flex justify-center align-center custom-gradient">
		<v-card class="login-card pa-5 bg-transparent" flat>
			<v-card-title class="text-center mb-6">
				<h2 class="text-h5 font-weight-bold">Recuperar Senha</h2>
			</v-card-title>

			<v-card-text>
				<v-form @submit.prevent="handleReset">
					<TextForm v-model="email" label="Digite seu e-mail" prependIcon="mdi-email-outline" />

					<v-btn
						type="submit"
						block
						color="primary"
						class="mt-4"
						size="large"
						rounded="lg"
						:loading="loading"
					>
						<span>Enviar recuperação</span>
					</v-btn>
				</v-form>

				<v-btn variant="text" class="mt-4" block @click="$router.back()">Voltar</v-btn>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { resetPassword } from "../api/authService";
import Swal from "sweetalert2";

export default defineComponent({
	name: "EsqueciSenha",
	data() {
		return {
			email: "",
			loading: false,
		};
	},
	methods: {
		async handleReset() {
			this.loading = true;
			try {
				await resetPassword(this.email);
				Swal.fire({
					icon: "success",
					title: "E-mail enviado",
					text: "Verifique sua caixa de entrada para redefinir sua senha.",
					customClass: {
						confirmButton: "custom-confirm-btn",
						cancelButton: "custom-cancel-btn",
					},
				});
				this.$router.push("/login");
			} catch (error) {
				console.error("Erro ao enviar recuperação:", error);
				Swal.fire({
					icon: "error",
					title: "Erro",
					text: "Não foi possível enviar o e-mail de recuperação.",
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
