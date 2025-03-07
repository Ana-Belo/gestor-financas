<template>
	<v-text-field
		:label="label"
		:variant="variant"
		:density="density"
		:rounded="rounded"
		:prepend-inner-icon="prependIcon"
		:bg-color="bgColor"
		:type="isPassword && !showPassword ? 'password' : 'text'"
		:append-inner-icon="isPassword ? (showPassword ? 'mdi-eye-off' : 'mdi-eye') : ''"
		@click:append-inner="togglePassword"
		v-model="model"
	/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "FormField",
	props: {
		modelValue: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		variant: {
			type: String,
			default: "outlined",
		},
		density: {
			type: String,
			default: "comfortable",
		},
		rounded: {
			type: String,
			default: "lg",
		},
		prependIcon: {
			type: String,
			default: "",
		},
		bgColor: {
			type: String,
			default: "white",
		},
		type: {
			type: String,
			default: "text",
		},
		isPassword: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			showPassword: false,
		};
	},
	computed: {
		model: {
			get() {
				return this.modelValue;
			},
			set(value: string) {
				this.$emit("update:modelValue", value);
			},
		},
	},
	methods: {
		togglePassword() {
			if (this.isPassword) {
				this.showPassword = !this.showPassword;
			}
		},
	},
});
</script>
