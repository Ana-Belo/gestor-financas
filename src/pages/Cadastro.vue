<template>
	<!-- Container centralizado para o formulário de cadastro -->
	<v-container class="fill-height d-flex justify-center align-center custom-gradient">
		<v-card class="login-card pa-5 bg-transparent" flat>
			<v-card-title class="text-center mb-10">
				<!-- Componente de logo -->
				<CatLogo />
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
						<v-checkbox v-model="acceptTerms" label="Eu aceito os termos de uso" hide-details></v-checkbox>
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

					<v-divider class="my-5" />

					<p class="text-center text-grey-darken-1">Ou continue com</p>

					<!-- Opções de login social -->
					<v-row class="mt-2">
						<v-col cols="6">
							<v-btn block variant="outlined" rounded="lg" @click="handleGoogleLogin">
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
import { loginWithGoogle, register } from "../api/authService";
import Swal from "sweetalert2"; // Importando SweetAlert2

export default defineComponent({
	name: "Cadastro",
	data() {
		return {
			loading: false, // Indica se a requisição de cadastro está em andamento
			fullName: "", // Armazena o nome completo do usuário
			email: "", // Armazena o email do usuário
			password: "", // Armazena a senha do usuário
			passwordConfirm: "", // Armazena a confirmação da senha
			acceptTerms: false, // Controle do checkbox de aceite dos termos
		};
	},
	methods: {
		// Método para registrar um novo usuário
		async handleRegister() {
			this.loading = true; // Ativa o estado de carregamento
			try {
				// Verifica se os termos foram aceitos
				if (!this.acceptTerms) {
					Swal.fire({
						title: "Atenção",
						text: "Você precisa aceitar os termos de uso para continuar.",
						icon: "warning",
						confirmButtonColor: "#f39c12",
						confirmButtonText: "OK",
					});
					this.loading = false;
					return;
				}

				// Verifica se as senhas coincidem
				if (this.password !== this.passwordConfirm) {
					Swal.fire({
						title: "Erro",
						text: "As senhas não coincidem.",
						icon: "error",
						confirmButtonColor: "#d33",
						confirmButtonText: "OK",
					});
					this.loading = false;
					return;
				}

				// Chama a API de registro
				await register(this.email, this.password, this.fullName);

				// Exibe mensagem de sucesso e redireciona
				Swal.fire({
					title: "Sucesso!",
					text: "Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.",
					icon: "success",
					confirmButtonColor: "#3085d6",
					confirmButtonText: "OK",
				}).then(() => {
					this.$router.push("/login");
				});
			} catch (error) {
				console.error("Erro ao cadastrar:", error);
				Swal.fire({
					title: "Erro",
					text: "Erro ao cadastrar. Tente novamente.",
					icon: "error",
					confirmButtonColor: "#d33",
					confirmButtonText: "OK",
				});
			} finally {
				this.loading = false; // Desativa o estado de carregamento
			}
		},
		async handleGoogleLogin() {
			try {
				await loginWithGoogle();
				// O usuário será redirecionado pelo Supabase
			} catch (error) {
				alert("Erro ao fazer login com Google.");
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
	background: linear-gradient(to bottom, #7e94ba, #ffffff);
}
</style>
