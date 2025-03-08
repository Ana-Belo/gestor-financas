<template>
	<v-container class="fill-height d-flex justify-center align-center">
		<v-card class="login-card pa-5 bg-transparent" flat>
			<v-card-title class="text-center mb-15">
				<Logo />
			</v-card-title>

			<v-card-text>
				<v-form @submit.prevent="handleLogin">
					<FormField v-model="email" label="E-mail" prependIcon="mdi-email-outline" />

					<FormField v-model="password" label="Senha" prependIcon="mdi-lock-outline" isPassword />

					<v-row align="center" justify="space-between">
						<v-checkbox label="Lembre de mim" hide-details></v-checkbox>
						<a href="#" class="text-primary text-decoration-none">Esqueceu a senha?</a>
					</v-row>

					<v-btn
						type="submit"
						block
						color="primary"
						class="mt-4"
						size="large"
						rounded="lg"
						:disabled="loading"
					>
						<v-progress-circular v-if="loading" indeterminate color="white" size="20" />
						<span v-else>Entrar</span>
					</v-btn>

					<v-alert
						v-if="errorMessage"
						type="error"
						class="my-5"
						variant="outlined"
						rounded="lg"
					>{{ errorMessage }}</v-alert>

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
						Não tem uma conta?
						<v-btn
							variant="text"
							:to="'/cadastro'"
							class="text-primary font-weight-bold text-decoration-none"
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
			showPassword: false,
			email: "",
			password: "",
			errorMessage: "",
			loading: false,
		};
	},
	methods: {
		async handleLogin() {
			this.loading = true;
			this.errorMessage = "";

			try {
				await login(this.email, this.password);
				this.$router.push("/home");
			} catch (error) {
				this.errorMessage = error.message;
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
