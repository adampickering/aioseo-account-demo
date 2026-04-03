<script setup lang="ts">
import IframeEmbed from '@/components/IframeEmbed.vue'
</script>

<template>
	<div class="space-y-6">
		<div>
			<h2 class="text-2xl font-heading font-semibold text-text-primary mb-3">Suggest a Feature</h2>
			<p class="text-text-secondary">
				We'd love to hear your feedback! Use the form below to suggest a feature or share what you think.
			</p>
		</div>

		<IframeEmbed
			src="#"
			title="Suggest a Feature"
			placeholder="WPForms — Suggest a Feature Form"
			height="650px"
		/>
	</div>
</template>
