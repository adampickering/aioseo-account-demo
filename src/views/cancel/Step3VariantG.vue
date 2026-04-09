<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'
import { useCancellation } from '@/composables/useCancellation'

const router = useRouter()
const store = useCancellationStore()
const { user } = useCancellation()

type SubOptionId = 'no-time' | 'dont-know' | 'no-need' | 'no-results'
interface SubOption {
	id: SubOptionId
	label: string
	description: string
	offer: { title: string; body: string; cta: string }
}

const selectedOption = ref<SubOptionId | null>(null)

const subOptions: SubOption[] = [
	{
		id: 'no-time',
		label: "No time to set it up",
		description: "We'll configure everything for you in ~15 minutes",
		offer: {
			title: "We'll set it up for you",
			body: "Our team can configure AIOSEO for your site in about 15 minutes. Once it's set up, it mostly runs on its own—sitemaps generate automatically, TruSEO scores update as you write, and the Redirection Manager catches broken links in the background.",
			cta: 'Yes, Set It Up for Me',
		},
	},
	{
		id: 'dont-know',
		label: "Not sure how to use it",
		description: "Book a free 15-minute walkthrough with our team",
		offer: {
			title: 'Free walkthrough with our team',
			body: "Book a 15-minute session and we'll show you the ropes. We'll walk through the features that matter most for your site, answer your questions, and make sure you're comfortable. No cost, no commitment.",
			cta: 'Yes, Walk Me Through It',
		},
	},
	{
		id: 'no-need',
		label: "Don't need SEO right now",
		description: "Pause for up to 3 months — reactivate anytime",
		offer: {
			title: 'Pause your subscription',
			body: "No problem—pause instead of cancelling. You'll keep full access until your renewal date, then your subscription freezes for up to 3 months. When you're ready to focus on SEO again, reactivate in one click.",
			cta: 'Pause My Subscription',
		},
	},
	{
		id: 'no-results',
		label: "Tried it, didn't see results",
		description: "Let our team review your setup and find what's off",
		offer: {
			title: 'Let us review your setup',
			body: "Results depend a lot on how AIOSEO is configured for your specific site. Our team can review your settings, check for misconfigurations, and suggest changes that could make a real difference. Your plan stays active while we look into it.",
			cta: 'Yes, Review My Setup',
		},
	},
]

const selectedOffer = computed(() => subOptions.find(o => o.id === selectedOption.value)?.offer ?? null)

function selectOption(id: SubOptionId) {
	selectedOption.value = selectedOption.value === id ? null : id
}

function handleOfferAction(action: string) {
	alert(`Action: ${action} (prototype)`)
}

function handleSaveOfferSkip() {
	store.skipOffer(router)
}
</script>

<template>
	<div class="max-w-[680px] mx-auto">
		<div class="text-center mb-8">
			<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
				{{ user.firstName }}, we'd love to help. What's getting in the way?
			</h2>
			<p class="text-[16px] text-text-muted mt-3 max-w-[480px] mx-auto">
				Pick the one that sounds most like you.
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
			<button
				v-for="opt in subOptions"
				:key="opt.id"
				@click="selectOption(opt.id)"
				:aria-pressed="selectedOption === opt.id"
				:class="[
					'aio-card aio-card-interactive text-left p-4 sm:p-5 flex items-start gap-3',
					selectedOption === opt.id ? 'selected' : ''
				]"
			>
				<div :class="[
					'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors',
					selectedOption === opt.id ? 'bg-brand-green text-white' : 'bg-brand-blue-5 text-brand-blue'
				]">
					<svg v-if="opt.id === 'no-time'" aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
					</svg>
					<svg v-else-if="opt.id === 'dont-know'" aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 18.72a9.094 9.094 0 003.741-7.347C21.741 5.725 17.02 1.286 11.346 1.514 5.672 1.742 1.195 6.518 1.427 12.165c.204 4.9 3.869 9.02 8.573 9.835"/>
						<path d="M12 17h.01M12 13.5a3.5 3.5 0 10-3.5-3.5"/>
					</svg>
					<svg v-else-if="opt.id === 'no-need'" aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
					</svg>
					<svg v-else-if="opt.id === 'no-results'" aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
				</div>
				<div>
					<span class="text-[15px] font-bold text-brand-navy leading-snug block mb-1">{{ opt.label }}</span>
					<span class="text-[13px] text-text-muted leading-snug block">{{ opt.description }}</span>
				</div>
			</button>
		</div>

		<transition name="cancel-fade">
			<div v-if="selectedOffer" class="aio-card mb-6">
				<h3 class="text-[20px] font-bold text-brand-navy m-0 mb-3">
					{{ selectedOffer.title }}
				</h3>
				<p class="text-[16px] text-brand-navy-60 leading-relaxed m-0 mb-5">
					{{ selectedOffer.body }}
				</p>
				<button
					@click="handleOfferAction(selectedOffer.cta)"
					class="aio-btn-green"
				>
					{{ selectedOffer.cta }}
				</button>
			</div>
		</transition>

		<div class="aio-or-divider">or</div>

		<div class="aio-card">
			<h3 class="text-[20px] font-bold text-brand-navy m-0 mb-3">
				50% off your next renewal
			</h3>
			<p class="text-[16px] text-brand-navy-60 leading-relaxed m-0 mb-5">
				None of the above? Keep your plan at half the price and give it another shot.
			</p>
			<button @click="handleOfferAction('apply-50-discount')" class="aio-btn-outline-blue">
				Apply 50% Discount
			</button>
		</div>

		<div class="text-center mt-8">
			<button @click="handleSaveOfferSkip" class="aio-link-skip">
				No thanks, continue cancelling
			</button>
		</div>
	</div>
</template>
