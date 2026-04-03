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
</script>

<template>
	<footer style="background-color: #F2F7FD; color: #434960; font-size: 18px; line-height: 27px; font-family: 'Proxima Nova', system-ui, sans-serif;">
		<!-- Footer link columns -->
		<div
			class="flex"
			style="max-width: 1110px; gap: 24px; margin: 0 auto; padding: 40px 0; font-size: 15px; line-height: 22.5px;"
		>
			<!-- Company -->
			<div class="flex-1">
				<h2 style="font-size: 16px; font-weight: 600; line-height: 19.2px; color: #434960; margin: 0 0 16px 0;">Company</h2>
				<ul style="list-style: none; padding: 0; margin: 0;">
					<li v-for="link in companyLinks" :key="link.label">
						<a
							:href="link.href"
							class="no-underline hover:text-brand-blue transition-colors duration-200"
							style="color: #434960; font-size: 15px; font-weight: 400; line-height: 32.25px;"
						>
							{{ link.label }}
						</a>
					</li>
				</ul>
				<!-- Social icons -->
				<div class="flex items-center gap-4" style="margin-top: 20px;">
					<a
						v-for="social in socialLinks"
						:key="social.icon"
						:href="social.href"
						:title="social.label"
						class="hover:text-brand-blue transition-colors duration-200"
						style="color: #434960;"
					>
						<!-- X / Twitter -->
						<svg v-if="social.icon === 'x'" style="width: 13px; height: 13px;" viewBox="0 0 24 24" fill="currentColor">
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
						</svg>
						<!-- Facebook -->
						<svg v-else-if="social.icon === 'facebook'" style="width: 13px; height: 13px;" viewBox="0 0 24 24" fill="currentColor">
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
						</svg>
						<!-- YouTube -->
						<svg v-else-if="social.icon === 'youtube'" style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="currentColor">
							<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
						</svg>
					</a>
				</div>
			</div>

			<!-- Features col 1 -->
			<div class="flex-1">
				<h2 style="font-size: 16px; font-weight: 600; line-height: 19.2px; color: #434960; margin: 0 0 16px 0;">Features</h2>
				<ul style="list-style: none; padding: 0; margin: 0;">
					<li v-for="link in features1" :key="link.label">
						<a
							:href="link.href"
							class="no-underline hover:text-brand-blue transition-colors duration-200"
							style="color: #434960; font-size: 15px; font-weight: 400; line-height: 32.25px;"
						>
							{{ link.label }}
						</a>
					</li>
				</ul>
			</div>

			<!-- Features col 2 -->
			<div class="flex-1">
				<h2 style="font-size: 16px; font-weight: 600; line-height: 19.2px; color: #434960; margin: 0 0 16px 0; visibility: hidden;">Features</h2>
				<ul style="list-style: none; padding: 0; margin: 0;">
					<li v-for="link in features2" :key="link.label">
						<a
							:href="link.href"
							class="no-underline hover:text-brand-blue transition-colors duration-200"
							style="color: #434960; font-size: 15px; font-weight: 400; line-height: 32.25px;"
						>
							{{ link.label }}
						</a>
					</li>
				</ul>
			</div>

			<!-- Our Brands -->
			<div class="flex-1">
				<h2 style="font-size: 16px; font-weight: 600; line-height: 19.2px; color: #434960; margin: 0 0 16px 0;">Our Brands</h2>
				<ul style="list-style: none; padding: 0; margin: 0;">
					<li v-for="link in brands" :key="link.label">
						<a
							:href="link.href"
							class="no-underline hover:text-brand-blue transition-colors duration-200"
							style="color: #434960; font-size: 15px; font-weight: 400; line-height: 32.25px;"
						>
							{{ link.label }}
						</a>
					</li>
				</ul>
			</div>

			<!-- Helpful Links -->
			<div class="flex-1">
				<h2 style="font-size: 16px; font-weight: 600; line-height: 19.2px; color: #434960; margin: 0 0 16px 0;">Helpful Links</h2>
				<ul style="list-style: none; padding: 0; margin: 0;">
					<li v-for="link in helpfulLinks" :key="link.label">
						<a
							:href="link.href"
							class="no-underline hover:text-brand-blue transition-colors duration-200"
							style="color: #434960; font-size: 15px; font-weight: 400; line-height: 32.25px;"
						>
							{{ link.label }}
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Divider -->
		<div style="max-width: 1110px; margin: 0 auto;">
			<div style="border-top: 1px solid #D0D1D7;"></div>
		</div>

		<!-- Bottom bar -->
		<div style="max-width: 1110px; margin: 0 auto; padding: 32px 0;">
			<div class="flex items-start justify-between">
				<!-- Copyright + Logo -->
				<div>
					<div style="margin-bottom: 12px;">
						<img
							src="/assets/icons/aioseo-logo.svg"
							alt="AIOSEO"
							style="height: 20px; width: auto; opacity: 0.6;"
						/>
					</div>
					<div style="font-size: 15px; line-height: 22.5px; color: #434960;">
						<p style="margin: 0;">Copyright &copy; 2013-2026 All-in-One SEO Pack, LLC.</p>
						<p style="margin: 0;">All-in-One SEO Pack&reg; is a registered trademark Awesome Motive Inc.</p>
					</div>
				</div>

				<!-- Legal links -->
				<nav class="flex flex-wrap items-center" style="gap: 16px;">
					<a
						v-for="link in legalLinks"
						:key="link.label"
						:href="link.href"
						class="underline hover:text-brand-blue transition-colors duration-200"
						style="font-size: 15px; line-height: 22.5px; color: #434960;"
					>
						{{ link.label }}
					</a>
				</nav>
			</div>

			<!-- Badges -->
			<div class="flex items-center gap-6" style="margin-top: 24px;">
				<img
					src="https://aioseo.com/wp-content/uploads/2020/11/norton-secure-1.svg"
					alt="Norton Secured"
					style="width: 85px; height: 46px;"
				/>
				<img
					src="https://aioseo.com/wp-content/uploads/2020/10/PPbadgetp.png"
					alt="PayPal Verified"
					style="width: 54px; height: 54px;"
				/>
				<img
					src="https://aioseo.com/wp-content/uploads/2020/11/wpbeginner-badge-dark.svg"
					alt="WPBeginner Recommended"
					style="width: 256px; height: 46px;"
				/>
			</div>
		</div>
	</footer>
</template>
