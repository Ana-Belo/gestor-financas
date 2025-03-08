<template>
	<v-alert v-if="showAlert" :type="type" class="my-5" variant="outlined" rounded="lg">
		{{ message }}
		<v-icon @click="closeDialog" class="float-end">mdi-close</v-icon>
	</v-alert>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
	name: "Alerta",
	props: {
		type: {
			type: String as PropType<"success" | "error" | "warning">,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		modelValue: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["update:updateValue"],
	computed: {
		showAlert: {
			get() {
				return this.modelValue;
			},
			set(value) {
				this.$emit("update:modelValue", value);
			},
		},
	},
	methods: {
		closeDialog() {
			this.showAlert = false;
		},
	},
});
</script>