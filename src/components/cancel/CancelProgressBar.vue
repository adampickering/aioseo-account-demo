<script setup lang="ts">
defineProps<{
	current: number
	total?: number
}>()
</script>

<template>
	<div class="flex items-center gap-3">
		<span class="text-overline" role="status" aria-live="polite">
			Step {{ current }} of {{ total ?? 5 }}
		</span>
		<div class="aio-progress-bar" aria-hidden="true">
			<div
				v-for="i in (total ?? 5)"
				:key="i"
				:class="['aio-progress-segment', i <= current ? 'active' : '']"
			></div>
		</div>
	</div>
</template>
