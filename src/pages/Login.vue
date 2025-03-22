<template>
	<!-- Container principal que ocupa toda a altura da tela e centraliza o conteúdo -->
	<v-container class="fill-height d-flex justify-center align-center custom-gradient">
		<!-- Cartão de login com fundo transparente e sem elevação -->
		<v-card class="login-card pa-5 bg-transparent" flat>
			<!-- Título do cartão com logo centralizado -->
			<v-card-title class="text-center mb-10">
				<CatLogo />
			</v-card-title>

			<v-card-text>
				<!-- Formulário de login -->
				<v-form @submit.prevent="handleLogin">
					<!-- Campo de entrada para e-mail -->
					<TextForm v-model="email" label="E-mail" prependIcon="mdi-email-outline" />

					<!-- Campo de entrada para senha com ícone de cadeado -->
					<TextForm v-model="password" label="Senha" prependIcon="mdi-lock-outline" isPassword />

					<!-- Linha contendo checkbox "Lembre de mim" e link para recuperação de senha -->
					<v-row align="center" justify="space-between">
						<v-checkbox label="Lembre de mim" hide-details></v-checkbox>
						<a href="#" class="text-black text-decoration-none">Esqueceu a senha?</a>
					</v-row>

					<!-- Botão de login, desabilitado enquanto a requisição está em andamento -->
					<v-btn
						type="submit"
						block
						color="primary"
						class="mt-4"
						size="large"
						rounded="lg"
						:loading="loading"
					>
						<!-- Indicador de carregamento ao tentar logar -->
						<span>Entrar</span>
					</v-btn>

					<!-- Exibe mensagem de erro caso o login falhe -->
					<Alerta v-model="showAlert" :type="alertType" :message="alertMessage" />

					<!-- Divisor visual entre seções -->
					<v-divider class="my-5" />

					<!-- Texto indicando opções alternativas de login -->
					<p class="text-center text-grey-darken-1">Ou continue com</p>

					<!-- Botões de login social (Google e Apple) -->
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

					<!-- Link para a página de cadastro -->
					<p class="text-center mt-4">
						Não tem uma conta?
						<v-btn
							variant="text"
							:to="'/cadastro'"
							class="font-weight-bold text-decoration-none"
						>Cadastre-se</v-btn>
					</p>
				</v-form>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { login } from "../api/authService";

export default defineComponent({
	name: "Login",
	data() {
		return {
			showAlert: false, // Controla a exibição do alerta
			alertType: "success", // Tipo do alerta (sucesso ou erro)
			alertMessage: "", // Mensagem do alerta
			email: "", // Armazena o e-mail digitado pelo usuário
			password: "", // Armazena a senha digitada pelo usuário
			loading: false, // Indica se a requisição de login está em andamento
		};
	},
	methods: {
		// Método responsável por realizar o login
		async handleLogin() {
			this.loading = true; // Ativa o estado de carregamento
			try {
				// Chama a API de login passando e-mail e senha
				await login(this.email, this.password);
				this.$router.push("/home"); // Redireciona para a página inicial após login bem-sucedido
			} catch (error) {
				console.error("Erro ao realizar login:", error);
				this.alertType = "error";
				this.alertMessage =
					"Erro ao realizar login. Verifique suas credenciais e tente novamente.";
				this.showAlert = true;
			} finally {
				this.loading = false; // Desativa o estado de carregamento
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
