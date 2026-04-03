<script setup lang="ts">
const companyLinks = [
	{ label: 'About', href: 'https://aioseo.com/about/' },
	{ label: 'Press', href: 'https://aioseo.com/press/' },
	{ label: 'Testimonials', href: 'https://aioseo.com/testimonials/' },
	{ label: 'Affiliates', href: 'https://aioseo.com/affiliates/' },
	{ label: 'Blog', href: 'https://aioseo.com/blog/' },
	{ label: 'Contact', href: 'https://aioseo.com/contact/' },
]

const socialLinks = [
	{ label: 'Twitter / X', href: 'https://twitter.com/aaborting', icon: 'x' },
	{ label: 'Facebook', href: 'https://www.facebook.com/aaborting/', icon: 'facebook' },
	{ label: 'YouTube', href: 'https://www.youtube.com/aioseo', icon: 'youtube' },
]

const features1 = [
	{ label: 'On Page SEO Optimization', href: 'https://aioseo.com/features/on-page-seo/' },
	{ label: 'Smart Sitemaps', href: 'https://aioseo.com/features/xml-sitemaps/' },
	{ label: 'Rich Snippets (Schema)', href: 'https://aioseo.com/features/rich-snippets-schema/' },
	{ label: 'TruSEO Score Analysis', href: 'https://aioseo.com/features/truseo-score/' },
	{ label: 'Internal Link Assistant', href: 'https://aioseo.com/features/internal-link-assistant/' },
	{ label: 'Redirection Manager', href: 'https://aioseo.com/features/redirection-manager/' },
	{ label: 'Local SEO', href: 'https://aioseo.com/features/local-seo/' },
]

const features2 = [
	{ label: 'WooCommerce SEO', href: 'https://aioseo.com/features/woocommerce-seo/' },
	{ label: 'Easy Breadcrumbs', href: 'https://aioseo.com/features/breadcrumbs/' },
	{ label: 'Webmaster Tools Connect', href: 'https://aioseo.com/features/webmaster-tools/' },
	{ label: 'Social Media Integration', href: 'https://aioseo.com/features/social-media-integration/' },
	{ label: 'Google AMP SEO', href: 'https://aioseo.com/features/google-amp-seo/' },
]

const brands = [
	{ label: 'WPForms', href: 'https://wpforms.com/' },
	{ label: 'OptinMonster', href: 'https://optinmonster.com/' },
	{ label: 'MonsterInsights', href: 'https://monsterinsights.com/' },
	{ label: 'WP Mail SMTP', href: 'https://wpmailsmtp.com/' },
	{ label: 'RafflePress', href: 'https://rafflepress.com/' },
	{ label: 'SeedProd', href: 'https://seedprod.com/' },
	{ label: 'TrustPulse', href: 'https://trustpulse.com/' },
]

const helpfulLinks = [
	{ label: 'Support', href: 'https://aioseo.com/support/' },
	{ label: 'Documentation', href: 'https://aioseo.com/docs/' },
	{ label: 'Plans & Pricing', href: 'https://aioseo.com/pricing/' },
	{ label: 'WordPress Hosting', href: 'https://aioseo.com/best-wordpress-hosting/' },
	{ label: 'Start a Blog', href: 'https://aioseo.com/start-a-blog/' },
	{ label: 'Make a Website', href: 'https://aioseo.com/make-a-website/' },
	{ label: 'WPBeginner', href: 'https://www.wpbeginner.com/' },
]

const legalLinks = [
	{ label: 'Terms of Service', href: 'https://aioseo.com/terms/' },
	{ label: 'Privacy Policy', href: 'https://aioseo.com/privacy-policy/' },
	{ label: 'FTC Disclosure', href: 'https://aioseo.com/ftc-disclosure/' },
	{ label: 'Sitemap', href: 'https://aioseo.com/sitemap/' },
	{ label: 'AIOSEO Coupon', href: 'https://aioseo.com/coupon/' },
]

const currentYear = new Date().getFullYear()
</script>

<template>
	<footer class="bg-white border-t border-gray-200">
		<!-- Columns -->
		<div class="max-w-[1200px] mx-auto px-6 py-12 sm:py-16">
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
				<!-- Company -->
				<div>
					<h4 class="text-text-primary font-semibold text-sm mb-4">Company</h4>
					<ul class="space-y-2.5">
						<li v-for="link in companyLinks" :key="link.label">
							<a
								:href="link.href"
								class="text-sm text-text-secondary hover:text-brand-blue transition-colors duration-200"
							>
								{{ link.label }}
							</a>
						</li>
					</ul>
					<div class="flex items-center gap-4 mt-5">
						<a
							v-for="social in socialLinks"
							:key="social.icon"
							:href="social.href"
							:title="social.label"
							class="text-text-muted hover:text-brand-blue transition-colors duration-200"
						>
							<!-- X / Twitter -->
							<svg v-if="social.icon === 'x'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
							</svg>
							<!-- Facebook -->
							<svg v-else-if="social.icon === 'facebook'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
							</svg>
							<!-- YouTube -->
							<svg v-else-if="social.icon === 'youtube'" class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
								<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
							</svg>
						</a>
					</div>
				</div>

				<!-- Features col 1 -->
				<div>
					<h4 class="text-text-primary font-semibold text-sm mb-4">Features</h4>
					<ul class="space-y-2.5">
						<li v-for="link in features1" :key="link.label">
							<a
								:href="link.href"
								class="text-sm text-text-secondary hover:text-brand-blue transition-colors duration-200"
							>
								{{ link.label }}
							</a>
						</li>
					</ul>
				</div>

				<!-- Features col 2 -->
				<div>
					<h4 class="text-text-primary font-semibold text-sm mb-4">&nbsp;</h4>
					<ul class="space-y-2.5">
						<li v-for="link in features2" :key="link.label">
							<a
								:href="link.href"
								class="text-sm text-text-secondary hover:text-brand-blue transition-colors duration-200"
							>
								{{ link.label }}
							</a>
						</li>
					</ul>
				</div>

				<!-- Our Brands -->
				<div>
					<h4 class="text-text-primary font-semibold text-sm mb-4">Our Brands</h4>
					<ul class="space-y-2.5">
						<li v-for="link in brands" :key="link.label">
							<a
								:href="link.href"
								class="text-sm text-text-secondary hover:text-brand-blue transition-colors duration-200"
							>
								{{ link.label }}
							</a>
						</li>
					</ul>
				</div>

				<!-- Helpful Links -->
				<div>
					<h4 class="text-text-primary font-semibold text-sm mb-4">Helpful Links</h4>
					<ul class="space-y-2.5">
						<li v-for="link in helpfulLinks" :key="link.label">
							<a
								:href="link.href"
								class="text-sm text-text-secondary hover:text-brand-blue transition-colors duration-200"
							>
								{{ link.label }}
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="border-t border-gray-100">
			<div class="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
				<p class="text-xs text-text-muted">
					Copyright &copy; 2007 - {{ currentYear }} AIOSEO. All rights reserved. AIOSEO is a trademark of Semper Plugins, LLC
				</p>
				<nav class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
					<a
						v-for="link in legalLinks"
						:key="link.label"
						:href="link.href"
						class="text-xs text-text-muted hover:text-brand-blue transition-colors duration-200"
					>
						{{ link.label }}
					</a>
				</nav>
			</div>
		</div>
	</footer>
</template>
