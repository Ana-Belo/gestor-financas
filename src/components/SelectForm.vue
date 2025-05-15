<template>
	<v-select
		:model-value="model"
		:items="items"
		:label="label"
		variant="outlined"
		rounded="lg"
		density="comfortable"
		class="mb-4"
		:prepend-inner-icon="prependIcon"
		@update:model-value="updateModel"
	/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "SelectForm",
	props: {
		modelValue: {
			type: String,
			required: true,
		},
		items: {
			type: Array as () => string[],
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		prependIcon: {
			type: String,
			default: "",
		},
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
		updateModel(value: string) {
			this.$emit("update:modelValue", value);
		},
	},
});
</script>
