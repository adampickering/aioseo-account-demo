<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'
import { useCancellation } from '@/composables/useCancellation'
import SupportBanner from '@/components/cancel/SupportBanner.vue'
import PlanSidebar from '@/components/cancel/PlanSidebar.vue'

const router = useRouter()
const store = useCancellationStore()
const { user, reasons } = useCancellation()

const selectedReasonId = ref<number | null>(null)
const followUpText = ref('')
const followUpDropdown = ref('')
const otherCompetitorText = ref('')

const selectedReason = computed(() =>
	reasons.value.find(r => r.id === selectedReasonId.value) ?? null
)

const canContinue = computed(() => {
	if (!selectedReason.value) return false
	const fu = selectedReason.value.followUp
	if (!fu) return true
	if (fu.type === 'text') return true
	if (fu.type === 'dropdown' && fu.required) return !!followUpDropdown.value
	return true
})

function handleContinue() {
	if (!canContinue.value || !selectedReason.value) return
	const fu = selectedReason.value.followUp
	const followUp = fu?.type === 'text' ? followUpText.value : followUpDropdown.value
	store.selectReason(router, selectedReason.value, followUp)
}

function selectReason(id: number) {
	selectedReasonId.value = id
	followUpText.value = ''
	followUpDropdown.value = ''
	otherCompetitorText.value = ''
	nextTick(() => {
		const el = document.querySelector<HTMLElement>('.follow-up-field')
		if (el) el.focus()
	})
}

function keepPlan() {
	store.keepPlan(router)
}
</script>

<template>
	<div>
		<SupportBanner />

		<div class="text-center mb-8">
			<h2 class="text-display m-0">
				{{ user.firstName }}, we're sorry to see you go.
			</h2>
			<p class="text-body-lg mt-3 mb-0 max-w-[520px] mx-auto">
				We appreciate you letting us know. Your feedback helps us improve.
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
			<div class="aio-card">
				<fieldset class="border-0 p-0 m-0 aio-cancel-radio">
					<legend class="text-[16px] font-bold text-brand-navy m-0 mb-4">Why do you want to cancel?</legend>

					<div class="space-y-0.5">
						<div v-for="reason in reasons" :key="reason.id">
							<label
								:class="[
									'flex items-center flex-wrap gap-3 py-2.5 px-3 rounded-card cursor-pointer border transition-all',
									selectedReasonId === reason.id
										? 'border-brand-blue bg-brand-blue-10/50'
										: 'border-transparent hover:bg-brand-blue-5'
								]"
							>
								<input
									type="radio"
									name="cancel-reason"
									:value="reason.id"
									v-model="selectedReasonId"
									@change="selectReason(reason.id)"
									class="shrink-0"
								>
								<span class="text-[15px] text-brand-navy leading-snug flex-1">
									{{ reason.label }}
								</span>
								<template v-if="selectedReasonId === reason.id && reason.followUp">
									<div class="w-full pl-[30px] mt-1" @click.stop>
										<input
											v-if="reason.followUp.type === 'text'"
											v-model="followUpText"
											:placeholder="reason.followUp.placeholder"
											aria-label="Additional details"
											class="follow-up-field aio-input w-full"
										>
										<div v-if="reason.followUp.type === 'dropdown'" class="relative">
											<select
												v-model="followUpDropdown"
												aria-label="Select an option"
												class="follow-up-field aio-select"
											>
												<option value="" disabled>{{ reason.followUp.placeholder }}</option>
												<option
													v-for="opt in reason.followUp.options"
													:key="opt"
													:value="opt"
												>
													{{ opt }}
												</option>
											</select>
											<svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M4 6l4 4 4-4" stroke-linecap="round" stroke-linejoin="round"/>
											</svg>
										</div>
										<input
											v-if="reason.followUp.type === 'dropdown' && reason.followUp.otherTextField && followUpDropdown === 'Other'"
											v-model="otherCompetitorText"
											placeholder="Which solution?"
											aria-label="Which solution?"
											class="aio-input w-full sm:w-[180px] mt-2"
										>
									</div>
								</template>
							</label>
						</div>
					</div>
				</fieldset>

				<div class="flex flex-col sm:flex-row gap-3 mt-5 pt-4 border-t border-border">
					<button @click="keepPlan" class="aio-btn-green-sm w-full sm:w-auto">
						Keep My Plan
					</button>
					<button
						@click="handleContinue"
						:class="[
							'aio-btn-gray transition-opacity w-full sm:w-auto',
							!canContinue ? 'opacity-40 cursor-not-allowed' : ''
						]"
						:disabled="!canContinue"
					>
						Continue Cancelling
					</button>
				</div>
			</div>

			<div class="aio-card">
				<PlanSidebar />
			</div>
		</div>
	</div>
</template>
