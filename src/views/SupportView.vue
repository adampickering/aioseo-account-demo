<script setup lang="ts">
import { ref } from 'vue'
import IframeEmbed from '@/components/IframeEmbed.vue'

const showChat = ref(true)
</script>

<template>
	<div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
		<!-- Left column -->
		<div class="lg:col-span-3 space-y-4 aio-card">
			<!-- Chat state -->
			<template v-if="showChat">
				<IframeEmbed
					src="#"
					title="AI Support Chat"
					placeholder="AI Support Chat — Powered by DeskBot"
					height="450px"
				/>
				<p class="text-sm">
					<a
						href="#"
						class="text-brand-blue hover:underline"
						@click.prevent="showChat = false"
					>Prefer to submit a ticket?</a>
				</p>
			</template>

			<!-- Form state -->
			<template v-else>
				<IframeEmbed
					src="#"
					title="Contact Support"
					placeholder="WPForms — Support Contact Form"
					height="500px"
				/>
				<p class="text-sm">
					<a
						href="#"
						class="text-brand-blue hover:underline"
						@click.prevent="showChat = true"
					>Try our AI assistant instead</a>
				</p>
			</template>
		</div>

		<!-- Right column: sidebar -->
		<div class="lg:col-span-2">
			<div class="aio-card-md text-center space-y-4">
				<!-- Avatar group -->
				<div class="flex items-center justify-center -space-x-3">
					<img
						src="/assets/images/support-avatar-1.jpg"
						alt="Support team member"
						class="w-12 h-12 rounded-full ring-2 ring-white object-cover"
					/>
					<img
						src="/assets/images/support-avatar-2.jpg"
						alt="Support team member"
						class="w-12 h-12 rounded-full ring-2 ring-white object-cover"
					/>
					<img
						src="/assets/images/support-avatar-3.jpg"
						alt="Support team member"
						class="w-12 h-12 rounded-full ring-2 ring-white"
					/>
				</div>

				<!-- Heading -->
				<h2 class="text-xl font-heading font-semibold">We're here to help!</h2>

				<!-- Body -->
				<p class="text-sm text-text-muted leading-relaxed">
					Our support team is available to assist with setup, troubleshooting, and general questions. Most requests receive a response within one business day.
				</p>

				<p class="text-sm font-semibold text-text-primary">
					Support hours are Monday to Friday, 9am–5pm Eastern Time.
				</p>

				<p class="text-sm text-text-muted leading-relaxed">
					Want to get a head start on finding a solution? Be sure to check out our
					<a href="#" class="text-brand-blue hover:underline">troubleshooting guide</a>
					and our
					<a href="#" class="text-brand-blue hover:underline">documentation</a>.
				</p>

				<!-- Extra hint when contact form is shown -->
				<p v-if="!showChat" class="text-sm text-text-muted leading-relaxed">
					If you need more help, create a support ticket and our team will assist you shortly.
				</p>
			</div>
		</div>
	</div>
</template>
