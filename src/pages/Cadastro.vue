<template>
	<v-container class="fill-height d-flex justify-center align-center">
		<v-card class="login-card pa-5 bg-transparent" flat>
			<v-card-title class="text-center mb-10">
				<Logo />
			</v-card-title>

			<v-card-text>
				<v-form>
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

					<v-btn block color="primary" class="mt-4" size="large" rounded="lg">Criar conta</v-btn>

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
import FormField from "../components/FormField.vue";
import Logo from "../components/Logo.vue";

export default defineComponent({
	name: "Cadastro",
	components: { FormField, Logo },
	data() {
		return {
			showPassword: false,
			fullName: "",
			email: "",
			password: "",
			confirmPassword: "",
		};
	},
	methods: {},
});
</script>

<style scoped>
.login-card {
	width: 100%;
	border-radius: 16px;
}
</style>
