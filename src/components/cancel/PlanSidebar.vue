<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'

const router = useRouter()
const store = useCancellationStore()

function keepPlan() {
	store.keepPlan(router)
}
</script>

<template>
	<div class="plan-sidebar-pitch">
		<div class="pitch-illustration">
			<img src="/dashboard-illustration.svg" alt="AIOSEO Dashboard showing SEO score, traffic growth, and rankings" />
		</div>

		<p class="pitch-headline">
			Trusted by 3,000,000+ professionals
		</p>

		<div class="pitch-stars">
			<div class="stars-row">
				<svg v-for="n in 5" :key="n" aria-hidden="true" class="star-icon" viewBox="0 0 20 20" fill="#F5A623">
					<path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7 6 11.21l-4-3.9 5.53-.8L10 1.5z"/>
				</svg>
			</div>
			<p class="stars-label">4.7 / 5 based on 7,000+ reviews</p>
		</div>

		<div class="border-t border-border my-5"></div>

		<div class="pitch-testimonials">
			<blockquote class="testimonial">
				<p>AIOSEO helped us increase our organic traffic by 200%. It's been a game-changer for our business.</p>
				<cite>Sarah M., Marketing Director</cite>
			</blockquote>
			<blockquote class="testimonial">
				<p>The best SEO plugin we've ever used. Period.</p>
				<cite>James L., Agency Owner</cite>
			</blockquote>
			<blockquote class="testimonial">
				<p>Setup took 10 minutes and we saw ranking improvements within weeks.</p>
				<cite>David R., Small Business Owner</cite>
			</blockquote>
		</div>

		<button @click="keepPlan" class="aio-btn-green pitch-cta">
			Keep my plan
		</button>
	</div>
</template>

<style>
.plan-sidebar-pitch { text-align: center; }
.pitch-illustration { margin: -4px -4px 0; }
.pitch-illustration img,
.pitch-illustration object { width: 100%; height: auto; display: block; }
.pitch-headline {
	font-size: 16px; font-weight: 600;
	color: var(--color-brand-navy); margin: 20px 0 12px; line-height: 1.3;
}
.pitch-stars { margin-bottom: 20px; }
.stars-row { display: flex; justify-content: center; gap: 3px; margin-bottom: 6px; }
.star-icon { width: 18px; height: 18px; }
.stars-label { font-size: 13px; color: var(--color-text-muted); margin: 0; }
.pitch-testimonials { text-align: left; margin-bottom: 20px; }
.testimonial {
	margin: 0 0 6px; padding: 12px 14px 12px 38px; border: none; position: relative;
	background-image: url("data:image/svg+xml,%3Csvg fill='%236B6E78' viewBox='0 0 13 11' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 7.3C0 9.687 1.356 11 2.9 11c1.402 0 2.478-1.168 2.478-2.58 0-1.46-.936-2.482-2.245-2.482-.234 0-.561.049-.608.049.14-1.558 1.497-3.505 2.993-4.527L3.788 0C1.637 1.606 0 4.332 0 7.301zm7.482 0c0 2.386 1.356 3.7 2.9 3.7c1.402 0 2.524-1.168 2.524-2.58 0-1.46-.982-2.482-2.29-2.482-.235 0-.562.049-.609.049.187-1.558 1.497-3.505 2.993-4.527L11.27 0C9.119 1.606 7.482 4.332 7.482 7.301z'/%3E%3C/svg%3E");
	background-position: 12px 14px; background-size: 13px; background-repeat: no-repeat;
}
.testimonial:last-child { margin-bottom: 0; }
.testimonial p { font-size: 15px; font-style: normal; color: var(--color-brand-navy); line-height: 1.4; margin: 0 0 6px; }
.testimonial cite { font-size: 13px; font-style: normal; color: var(--color-text-muted); font-weight: 500; }
.pitch-cta { width: 100%; margin-top: 4px; }
</style>
