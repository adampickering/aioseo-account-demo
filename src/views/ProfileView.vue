<script setup lang="ts">
import { useAccount } from '@/composables/useAccount'

const { user } = useAccount()
</script>

<template>
	<div class="space-y-10 max-w-3xl">
		<!-- Personal Information -->
		<section>
			<h2 class="text-xl font-heading font-semibold text-text-primary mb-6">Personal Information</h2>

			<div class="space-y-5">
				<!-- Name -->
				<div>
					<p class="text-sm font-semibold text-text-primary mb-1">
						Name: <span class="text-brand-red">*</span>
					</p>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label for="first-name" class="sr-only">First name</label>
							<input
								id="first-name"
								type="text"
								:value="user.firstName"
								placeholder="First name"
								class="aio-input text-sm"
							/>
						</div>
						<div>
							<label for="last-name" class="sr-only">Last name</label>
							<input
								id="last-name"
								type="text"
								:value="user.lastName"
								placeholder="Last name"
								class="aio-input text-sm"
							/>
						</div>
					</div>
				</div>

				<!-- Primary Email -->
				<div>
					<label for="email" class="text-sm font-semibold text-text-primary mb-1 block">
						Primary Email Address: <span class="text-brand-red">*</span>
					</label>
					<input
						id="email"
						type="email"
						:value="user.email"
						placeholder="Email address"
						class="aio-input text-sm"
					/>
				</div>
			</div>
		</section>

		<!-- Billing Address -->
		<section>
			<h2 class="text-lg font-heading font-semibold text-text-primary mb-6">Billing Address</h2>

			<div class="space-y-5">
				<div>
					<label for="address-1" class="text-sm font-semibold text-text-primary mb-1 block">Address Line 1</label>
					<input id="address-1" type="text" :value="user.billingAddress.line1" placeholder="Street address" class="aio-input text-sm" />
				</div>

				<div>
					<label for="address-2" class="text-sm font-semibold text-text-primary mb-1 block">Address Line 2</label>
					<input id="address-2" type="text" :value="user.billingAddress.line2" placeholder="Apt, suite, etc. (optional)" class="aio-input text-sm" />
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="city" class="text-sm font-semibold text-text-primary mb-1 block">City</label>
						<input id="city" type="text" :value="user.billingAddress.city" placeholder="City" class="aio-input text-sm" />
					</div>
					<div>
						<label for="zip" class="text-sm font-semibold text-text-primary mb-1 block">Zip / Postal Code</label>
						<input id="zip" type="text" :value="user.billingAddress.zip" placeholder="Zip / Postal code" class="aio-input text-sm" />
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="country" class="text-sm font-semibold text-text-primary mb-1 block">Country</label>
						<select id="country" :value="user.billingAddress.country" class="aio-input text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23717680%22%20d%3D%22M3%204.5l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]">
							<option value="">Select a country...</option>
							<option value="US">United States</option>
							<option value="CA">Canada</option>
							<option value="GB">United Kingdom</option>
							<option value="AU">Australia</option>
							<option value="DE">Germany</option>
							<option value="FR">France</option>
						</select>
					</div>
					<div>
						<label for="state" class="text-sm font-semibold text-text-primary mb-1 block">State / Province</label>
						<select id="state" :value="user.billingAddress.state" class="aio-input text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23717680%22%20d%3D%22M3%204.5l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]">
							<option value="">Select an option...</option>
							<option value="AL">Alabama</option>
							<option value="CA">California</option>
							<option value="DE">Delaware</option>
							<option value="FL">Florida</option>
							<option value="NY">New York</option>
							<option value="TX">Texas</option>
						</select>
					</div>
				</div>
			</div>
		</section>

		<!-- Change Password -->
		<section>
			<h2 class="text-lg font-heading font-semibold text-text-primary mb-6">Change Your Password</h2>

			<div class="space-y-5">
				<div>
					<label for="new-password" class="text-sm font-semibold text-text-primary mb-1 block">New Password</label>
					<input id="new-password" type="password" placeholder="Enter new password" class="aio-input text-sm" />
				</div>
				<div>
					<label for="confirm-password" class="text-sm font-semibold text-text-primary mb-1 block">Confirm Password</label>
					<input id="confirm-password" type="password" placeholder="Confirm new password" class="aio-input text-sm" />
				</div>
			</div>
		</section>

		<!-- Save button -->
		<div>
			<button class="aio-btn-blue hover:opacity-90 transition-all duration-200 cursor-pointer">
				Save Changes
			</button>
		</div>
	</div>
</template>
