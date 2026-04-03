<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
	expiresAt: string
}>()

const now = ref(Date.now())
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
	interval = setInterval(() => {
		now.value = Date.now()
	}, 1000)
})

onUnmounted(() => {
	if (interval) {
		clearInterval(interval)
	}
})

const remaining = computed(() => {
	const diff = new Date(props.expiresAt).getTime() - now.value
	if (diff <= 0) return null

	const hours = Math.floor(diff / (1000 * 60 * 60))
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
	const seconds = Math.floor((diff % (1000 * 60)) / 1000)

	return {
		hours: String(hours).padStart(2, '0'),
		minutes: String(minutes).padStart(2, '0'),
		seconds: String(seconds).padStart(2, '0'),
	}
})
</script>

<template>
	<span
		v-if="remaining"
		class="inline-flex items-center gap-1 rounded-full bg-amber-100 text-brand-amber px-3 py-1 text-sm font-semibold tabular-nums transition-all duration-200"
	>
		Offer Expires in {{ remaining.hours }}H {{ remaining.minutes }}M {{ remaining.seconds }}S
	</span>
	<span
		v-else
		class="inline-flex items-center rounded-full bg-brand-red/10 text-brand-red px-3 py-1 text-sm font-semibold transition-all duration-200"
	>
		Expired
	</span>
</template>
