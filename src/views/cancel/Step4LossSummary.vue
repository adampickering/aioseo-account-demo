<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'
import { useCancellation } from '@/composables/useCancellation'

const router = useRouter()
const store = useCancellationStore()
const { user, lossItems } = useCancellation()

const confirmed = ref(false)
const showCheckboxWarning = ref(false)

const items = computed(() => lossItems.value[user.value.planKey] ?? lossItems.value.elite)

function attemptCancel() {
	if (!confirmed.value) {
		showCheckboxWarning.value = true
		return
	}
	store.confirmCancel(router)
}

function handlePause() {
	alert('Pausing subscription... (prototype)')
}

function onCheckboxChange() {
	showCheckboxWarning.value = false
}

function keepPlan() {
	store.keepPlan(router)
}
</script>

<template>
	<div class="max-w-[680px] mx-auto">
		<div class="text-center mb-8">
			<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
				Here's what your site loses on {{ user.renewalDate }}
			</h2>
			<p class="text-body-lg mt-3 max-w-[520px] mx-auto">
				Your {{ user.planName }} plan expires on {{ user.renewalDate }}. Everything below stops working for your site.
			</p>
		</div>

		<div class="aio-stagger-reveal space-y-3 mb-8">
			<div
				v-for="(item, idx) in items"
				:key="idx"
				class="aio-loss-item"
			>
				<div class="aio-loss-item-icon">
					<svg aria-hidden="true" class="w-5 h-5 text-brand-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
						<path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
				<div>
					<h4 class="text-[17px] font-bold text-brand-navy m-0 mb-1">{{ item.title }}</h4>
					<p class="text-[15px] text-brand-navy-60 leading-relaxed m-0">{{ item.body }}</p>
				</div>
			</div>
		</div>

		<div class="aio-card bg-brand-blue-5 mb-6 py-5 px-6">
			<div class="flex items-start gap-3">
				<svg aria-hidden="true" class="w-5 h-5 mt-0.5 shrink-0 text-brand-blue" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
				</svg>
				<div>
					<p class="text-[15px] text-brand-navy m-0">
						Your <strong>{{ user.planName }}</strong> covers {{ user.sites }} site(s) and includes {{ user.aiCredits }} AI Credits.
					</p>
					<p class="text-[15px] text-brand-navy m-0 mt-1.5">
						You've been with AIOSEO for <strong>{{ user.tenure }}</strong>. We'd hate to see that go.
					</p>
				</div>
			</div>
		</div>

		<div class="relative mb-6 aio-cancel-checkbox">
			<label class="flex items-start gap-3 cursor-pointer p-4 rounded-card border border-border bg-white hover:border-brand-blue/30 transition-colors">
				<input
					type="checkbox"
					v-model="confirmed"
					@change="onCheckboxChange"
					class="shrink-0 mt-0.5"
				>
				<span class="text-[15px] text-brand-navy leading-relaxed">
					I understand I will lose <strong>all the above</strong> when my plan expires on {{ user.renewalDate }}.
				</span>
			</label>

			<transition name="cancel-fade">
				<div
					v-if="showCheckboxWarning"
					role="alert"
					class="absolute top-full left-0 mt-2 p-4 bg-white border border-brand-amber rounded-card shadow-[0_4px_20px_rgba(20,27,56,0.12)] z-10 max-w-[400px]"
				>
					<p class="text-[15px] text-brand-navy m-0">
						Please confirm you've reviewed the features you'll lose when your plan expires.
					</p>
				</div>
			</transition>
		</div>

		<div class="text-center space-y-4">
			<button @click="keepPlan" class="aio-btn-green w-full max-w-[400px]">
				Keep my plan
			</button>

			<div class="flex items-center justify-center gap-6">
				<button @click="handlePause" class="text-[15px] text-brand-blue hover:underline bg-transparent border-none cursor-pointer font-bold">
					Pause my subscription instead
				</button>
				<span class="text-border">|</span>
				<button
					@click="attemptCancel"
					:class="[
						'text-[14px] bg-transparent border-none cursor-pointer transition-colors',
						!confirmed ? 'text-text-muted/40 cursor-not-allowed' : 'text-text-muted hover:text-brand-navy-60'
					]"
				>
					Confirm cancellation
				</button>
			</div>
		</div>
	</div>
</template>
