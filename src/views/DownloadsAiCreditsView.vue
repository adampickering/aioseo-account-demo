<script setup lang="ts">
import { computed } from 'vue'
import { useAiCredits } from '@/composables/useAiCredits'

const { credits, percentUsed, remaining } = useAiCredits()

const hasCredits = computed(() => credits.value.total > 0)

const formattedRemaining = computed(() => remaining.value.toLocaleString())
const formattedTotal = computed(() => credits.value.total.toLocaleString())

const formattedExpiry = computed(() => {
	if (!credits.value.expiresAt) return ''
	return new Date(credits.value.expiresAt).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})
})

const percentRemaining = computed(() => 100 - percentUsed.value)
</script>

<template>
	<div>
		<!-- Has credits -->
		<div v-if="hasCredits" class="bg-white" style="border: 1px solid #E6EEFC; border-radius: 5px; box-shadow: 0px 5px 10px 0px rgba(0, 90, 224, 0.06); padding: 40px;">
			<div class="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
				<div class="flex-1 space-y-5">
					<!-- Header with icon -->
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
							<svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
							</svg>
						</div>
						<h3 class="text-xl font-heading font-semibold text-text-primary">AI Credits</h3>
					</div>

					<!-- Large remaining display -->
					<div>
						<p class="text-3xl font-heading font-bold text-text-primary">
							{{ formattedRemaining }}
							<span class="text-lg font-normal text-text-secondary">/ {{ formattedTotal }}</span>
						</p>
						<p class="text-sm text-text-muted mt-1">AI Credits Remaining</p>
					</div>

					<!-- Progress bar -->
					<div>
						<div class="w-full h-2.5 bg-brand-blue-10 rounded-full overflow-hidden">
							<div
								class="h-full bg-brand-blue rounded-full transition-all duration-500"
								:style="{ width: percentRemaining + '%' }"
							/>
						</div>
						<div class="flex justify-between mt-1.5">
							<span class="text-xs text-text-muted">{{ percentUsed }}% used</span>
							<span class="text-xs text-text-muted">{{ percentRemaining }}% remaining</span>
						</div>
					</div>

					<!-- Details -->
					<div class="space-y-1.5 text-sm text-text-secondary">
						<p>{{ credits.includedInSubscription.toLocaleString() }} credits included in subscription</p>
						<p v-if="credits.paidCredits > 0">{{ credits.paidCredits.toLocaleString() }} additional paid credits</p>
						<p v-if="formattedExpiry" class="text-text-muted">
							Expires {{ formattedExpiry }}
						</p>
					</div>

					<!-- CTA -->
					<a
						href="#"
						class="inline-flex items-center gap-2 text-white bg-brand-blue hover:bg-brand-blue/90 transition-all duration-200"
						style="border-radius: 4.5px; padding: 14.85px 22.5px; font-size: 18px; font-weight: 600;"
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						Purchase Credits
					</a>
				</div>
			</div>
		</div>

		<!-- No credits -->
		<div v-else class="bg-white text-center max-w-lg" style="border: 1px solid #E6EEFC; border-radius: 5px; box-shadow: 0px 5px 10px 0px rgba(0, 90, 224, 0.06); padding: 40px;">
			<div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
				<svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
				</svg>
			</div>
			<h3 class="text-xl font-heading font-semibold text-text-primary mb-2">AI Credits</h3>
			<p class="text-sm text-text-secondary mb-5">
				Supercharge your SEO with AI-powered title and description generation, content optimization, and more.
			</p>
			<a
				href="#"
				class="inline-flex items-center gap-2 text-white bg-brand-blue hover:bg-brand-blue/90 transition-all duration-200"
				style="border-radius: 4.5px; padding: 14.85px 22.5px; font-size: 18px; font-weight: 600;"
			>
				Purchase Credits
			</a>
		</div>
	</div>
</template>
