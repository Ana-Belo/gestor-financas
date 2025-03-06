<template>
	<v-container class="login-container">
		<v-card width="100%" class="pa-5 mx-auto">
			<v-card-title class="text-center">Login</v-card-title>
			<v-card-text>
				<v-form @submit.prevent="handleLogin">
					<v-text-field v-model="email" label="Email" type="email" variant="outlined" required />

					<v-text-field v-model="password" label="Senha" type="password" variant="outlined" required />

					<v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>

					<v-btn type="submit" color="primary" block :disabled="loading" class="mt-3">
						<v-progress-circular v-if="loading" indeterminate color="white" size="20" />
						<span v-else>Login</span>
					</v-btn>
				</v-form>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { login } from "@/api/authService";

export default defineComponent({
	data() {
		return {
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
.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
}
</style>
