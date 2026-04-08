<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedTag = ref<string | null>(null)

const issueTags = [
	{ label: 'I was charged unexpectedly' },
	{ label: "Something isn't working right" },
	{ label: 'I need help setting things up' },
	{ label: 'I have a billing question' },
]

function selectTag(tag: string) {
	selectedTag.value = selectedTag.value === tag ? null : tag
}

function handleSupport() {
	alert(`Opening support form with category: "${selectedTag.value}" (prototype)`)
}

function handleSkip() {
	router.push({ name: 'cancel-reason' })
}
</script>

<template>
	<div class="max-w-[560px] mx-auto">
		<div class="aio-card text-center py-8 px-5 sm:py-10 sm:px-8">
			<h2 class="text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[43px] m-0 mb-3">
				Before You Cancel &mdash; Is It One&nbsp;of&nbsp;These?
			</h2>
			<p class="text-[16px] text-text-muted mt-0 mb-8 max-w-[440px] mx-auto leading-relaxed">
				Many customers have something we can fix in just a few minutes. If any of these sound like you, let us take a look.
			</p>

			<div class="flex flex-wrap justify-center gap-3 mb-8">
				<button
					v-for="tag in issueTags"
					:key="tag.label"
					@click="selectTag(tag.label)"
					:class="[
						'px-5 py-3 sm:py-2.5 rounded-full text-[15px] font-medium cursor-pointer border transition-all',
						selectedTag === tag.label
							? 'bg-brand-blue text-white border-brand-blue shadow-[0_2px_8px_rgba(0,90,224,0.2)]'
							: 'bg-white text-brand-navy-60 border-border-input hover:border-brand-blue hover:text-brand-blue'
					]"
				>
					{{ tag.label }}
				</button>
			</div>

			<transition name="cancel-fade">
				<div v-if="selectedTag" class="mb-6">
					<button
						@click="handleSupport"
						class="aio-btn-green w-full max-w-[380px]"
					>
						Talk to Our Team &mdash; Priority Response
					</button>
					<p class="text-caption mt-3 mb-0">
						Your request will be escalated automatically. We'll be with you shortly.
					</p>
				</div>
			</transition>

			<div class="aio-or-divider mt-6">OR</div>

			<button
				@click="handleSkip"
				class="aio-link-skip mt-3"
			>
				None of these apply &mdash; continue with cancellation
			</button>
		</div>
	</div>
</template>
