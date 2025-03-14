<template>
	<!-- Container centralizado para o formulário de cadastro -->
	<v-container class="fill-height d-flex justify-center align-center custom-gradient">
		<v-card class="login-card pa-5 bg-transparent" flat>
			<v-card-title class="text-center mb-10">
				<!-- Componente de logo -->
				<Logo />
			</v-card-title>

			<v-card-text>
				<!-- Formulário de cadastro -->
				<v-form @submit.prevent="handleRegister">
					<!-- Campos do formulário -->
					<TextForm v-model="fullName" label="Nome completo" prependIcon="mdi-account-outline" />

					<TextForm v-model="email" label="E-mail" prependIcon="mdi-email-outline" />

					<TextForm v-model="password" label="Senha" prependIcon="mdi-lock-outline" isPassword />

					<TextForm
						v-model="passwordConfirm"
						label="Confirme a senha"
						prependIcon="mdi-lock-outline"
						isPassword
					/>

					<!-- Checkbox para aceitar os termos de uso -->
					<v-row align="center" justify="space-between">
						<v-checkbox label="Eu aceito os termos de uso" hide-details></v-checkbox>
					</v-row>

					<!-- Botão de criação de conta -->
					<v-btn
						type="submit"
						block
						color="primary"
						class="mt-4"
						size="large"
						rounded="lg"
						:loading="loading"
					>
						<span>Criar conta</span>
					</v-btn>

					<!-- Componente de alerta para exibir mensagens -->
					<Alerta v-model="showAlert" :type="alertType" :message="alertMessage" />

					<v-divider class="my-5" />

					<p class="text-center text-grey-darken-1">Ou continue com</p>

					<!-- Opções de login social -->
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

					<!-- Link para a página de login caso o usuário já tenha conta -->
					<p class="text-center mt-4">
						Já tem uma conta?
						<v-btn variant="text" :to="'/login'" class="font-weight-bold text-decoration-none">Login</v-btn>
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
			showAlert: false, // Controla a exibição do alerta
			alertType: "success", // Tipo do alerta (sucesso ou erro)
			alertMessage: "", // Mensagem do alerta
			loading: false, // Indica se a requisição de login está em andamento
			fullName: "", // Armazena o nome completo do usuário
			email: "", // Armazena o email do usuário
			password: "", // Armazena a senha do usuário
			passwordConfirm: "", // Armazena a confirmação da senha
		};
	},
	methods: {
		// Método para registrar um novo usuário
		async handleRegister() {
			this.loading = true; // Ativa o estado de carregamento
			try {
				// Verifica se as senhas coincidem
				if (this.password !== this.passwordConfirm) {
					this.alertType = "error";
					this.alertMessage = "As senhas não coincidem.";
					this.showAlert = true;
					return;
				}

				// Chama a API de registro
				await register(this.email, this.password, this.fullName);
				this.alertType = "success";
				this.alertMessage =
					"Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.";
				this.showAlert = true;
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
.custom-gradient {
	background: linear-gradient(to bottom, #f7f5e3, #ffffff);
}
</style>