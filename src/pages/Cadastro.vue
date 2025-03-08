<template>
	<v-container class="fill-height d-flex justify-center align-center">
		<v-card class="login-card pa-5 bg-transparent" flat>
			<v-card-title class="text-center mb-10">
				<Logo />
			</v-card-title>

			<v-card-text>
				<v-form @submit.prevent="handleRegister">
					<FormField v-model="fullName" label="Nome completo" prependIcon="mdi-account-outline" />

					<FormField v-model="email" label="E-mail" prependIcon="mdi-email-outline" />

					<FormField v-model="password" label="Senha" prependIcon="mdi-lock-outline" isPassword />

					<FormField
						v-model="passwordConfirm"
						label="Confirme a senha"
						prependIcon="mdi-lock-outline"
						isPassword
					/>

					<v-row align="center" justify="space-between">
						<v-checkbox label="Eu aceito os termos de uso" hide-details></v-checkbox>
					</v-row>

					<v-btn type="submit" block color="primary" class="mt-4" size="large" rounded="lg">Criar conta</v-btn>

					<Alerta v-model="showAlert" :type="alertType" :message="alertMessage" />

					<v-divider class="my-5"></v-divider>

					<p class="text-center text-grey-darken-1">Ou continue com</p>

					<v-row class="mt-2">
						<v-col cols="6">
							<v-btn block variant="outlined" rounded="lg">
								<v-icon class="mr-2">mdi-google</v-icon>Google
							</v-btn>
						</v-col>
						<v-col cols="6">
							<v-btn block variant="outlined" rounded="lg">
								<v-icon class="mr-2">mdi-apple</v-icon>Apple
							</v-btn>
						</v-col>
					</v-row>

					<p class="text-center mt-4">
						Já tem uma conta?
						<v-btn
							variant="text"
							:to="'/login'"
							class="text-primary font-weight-bold text-decoration-none"
						>Login</v-btn>
					</p>
				</v-form>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { register } from "../api/authService";

export default defineComponent({
	name: "Cadastro",
	data() {
		return {
			showAlert: false,
			alertType: "success",
			alertMessage: "",
			showPassword: false,
			fullName: "",
			email: "",
			password: "",
			passwordConfirm: "",
		};
	},
	methods: {
		async handleRegister() {
			try {
				if (this.password !== this.passwordConfirm) {
					this.alertType = "error";
					this.alertMessage = "As senhas não coincidem.";
					this.showAlert = true;
					return;
				}
				await register(this.email, this.password, this.fullName);
				this.alertType = "success";
				this.alertMessage =
					"Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.";
				this.showAlert = true;
				this.$router.push("/login");
			} catch (error) {
				console.error("Erro ao cadastrar:", error);
				this.alertType = "error";
				this.alertMessage = "Erro ao cadastrar. Tente novamente.";
				this.showAlert = true;
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