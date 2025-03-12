<template>
	<!-- Campo de entrada de texto utilizando Vuetify -->
	<v-text-field
		:label="label"
		:variant="variant"
		:density="density"
		:rounded="rounded"
		:prepend-inner-icon="prependIcon"
		:bg-color="bgColor"
		:type="isPassword && !showPassword ? 'password' : type"
		:append-inner-icon="isPassword ? (showPassword ? 'mdi-eye-off' : 'mdi-eye') : ''"
		@click:append-inner="togglePassword"
		v-model="formattedValue"
		@input="handleInput"
	/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "TextForm",
	props: {
		// Valor do campo (bind bidirecional)
		modelValue: {
			type: [String, Number],
			required: true,
		},
		// Rótulo do campo
		label: {
			type: String,
			required: true,
		},
		// Variante do campo (exemplo: "outlined", "filled")
		variant: {
			type: String,
			default: "outlined",
		},
		// Define a densidade do campo (exemplo: "compact", "comfortable")
		density: {
			type: String,
			default: "comfortable",
		},
		// Define o arredondamento do campo (exemplo: "lg", "md")
		rounded: {
			type: String,
			default: "lg",
		},
		// Ícone à esquerda dentro do campo
		prependIcon: {
			type: String,
			default: "",
		},
		// Cor de fundo do campo
		bgColor: {
			type: String,
			default: "white",
		},
		// Tipo de entrada (text, password ou number)
		type: {
			type: String,
			default: "text",
			validator: (value: string) =>
				["text", "password", "number"].includes(value),
		},
		// Define se o campo é do tipo senha (exibe ícone para mostrar/ocultar)
		isPassword: {
			type: Boolean,
			default: false,
		},
		// Define uma máscara para formatação de entrada (exemplo: "currency" para valores monetários)
		mask: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			// Controla a visibilidade da senha
			showPassword: false,
		};
	},
	computed: {
		// Gerencia o valor formatado do campo
		formattedValue: {
			get() {
				// Se a máscara for "currency", formata o valor como moeda brasileira
				if (this.mask === "currency") {
					return this.formatCurrency(this.modelValue);
				}
				// Caso contrário, retorna o valor normal
				return this.modelValue;
			},
			set(value: string) {
				// Se a máscara for "currency", converte o valor para número antes de emitir o evento de atualização
				this.$emit(
					"update:modelValue",
					this.mask === "currency" ? this.parseCurrency(value) : value
				);
			},
		},
	},
	methods: {
		// Alterna a visibilidade do campo de senha
		togglePassword() {
			if (this.isPassword) {
				this.showPassword = !this.showPassword;
			}
		},
		// Formata um número para o padrão monetário brasileiro (R$ 0,00)
		formatCurrency(value: number | string) {
			if (!value) return "R$ 0,00";
			const number = Number(value.toString().replace(/\D/g, "")) / 100;
			return number.toLocaleString("pt-BR", {
				style: "currency",
				currency: "BRL",
			});
		},
		// Converte um valor monetário formatado de volta para número
		parseCurrency(value: string) {
			return Number(value.replace(/\D/g, "")) / 100;
		},
		// Manipula a entrada do usuário para atualizar corretamente o valor formatado
		handleInput(event: Event) {
			const target = event.target as HTMLInputElement;
			this.formattedValue = target.value;
		},
	},
});
</script>
