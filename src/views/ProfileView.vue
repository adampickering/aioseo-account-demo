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
					<label class="text-sm font-semibold text-text-primary mb-1 block">
						Name: <span class="text-brand-red">*</span>
					</label>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<input
							type="text"
							:value="user.firstName"
							placeholder="First name"
							class="border border-gray-200 rounded-lg px-4 py-3 w-full text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all duration-200"
						/>
						<input
							type="text"
							:value="user.lastName"
							placeholder="Last name"
							class="border border-gray-200 rounded-lg px-4 py-3 w-full text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all duration-200"
						/>
					</div>
				</div>

				<!-- Primary Email -->
				<div>
					<label class="text-sm font-semibold text-text-primary mb-1 block">
						Primary Email Address: <span class="text-brand-red">*</span>
					</label>
					<input
						type="email"
						:value="user.email"
						placeholder="Email address"
						class="border border-gray-200 rounded-lg px-4 py-3 w-full text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all duration-200"
					/>
				</div>
			</div>
		</section>

		<!-- Billing Address -->
		<section>
			<h2 class="text-lg font-heading font-semibold text-text-primary mb-6">Billing Address</h2>

			<div class="space-y-5">
				<!-- Line 1 -->
				<div>
					<label class="text-sm font-semibold text-text-primary mb-1 block">Address Line 1</label>
					<input
						type="text"
						:value="user.billingAddress.line1"
						placeholder="Street address"
						class="border border-gray-200 rounded-lg px-4 py-3 w-full text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all duration-200"
					/>
				</div>

				<!-- Line 2 -->
				<div>
					<label class="text-sm font-semibold text-text-primary mb-1 block">Address Line 2</label>
					<input
						type="text"
						:value="user.billingAddress.line2"
						placeholder="Apt, suite, etc. (optional)"
						class="border border-gray-200 rounded-lg px-4 py-3 w-full text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all duration-200"
					/>
				</div>

				<!-- City + Zip -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label class="text-sm font-semibold text-text-primary mb-1 block">City</label>
						<input
							type="text"
							:value="user.billingAddress.city"
							placeholder="City"
							class="border border-gray-200 rounded-lg px-4 py-3 w-full text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all duration-200"
						/>
					</div>
					<div>
						<label class="text-sm font-semibold text-text-primary mb-1 block">Zip / Postal Code</label>
						<input
							type="text"
							:value="user.billingAddress.zip"
							placeholder="Zip / Postal code"
							class="border border-gray-200 rounded-lg px-4 py-3 w-full text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all duration-200"
						/>
					</div>
				</div>

				<!-- Country + State -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label class="text-sm font-semibold text-text-primary mb-1 block">Country</label>
						<select
							:value="user.billingAddress.country"
							class="border border-gray-200 rounded-lg px-4 py-3 w-full text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all duration-200 appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23717680%22%20d%3D%22M3%204.5l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]"
						>
							<option value="">Select a country...</option>
							<option value="US">United States</option>
							<option value="CA">Canada</option>
							<option value="GB">United Kingdom</option>
							<option value="AU">Australia</option>
							<option value="DE">Germany</option>
							<option value="FR">France</option>
							<option value="NL">Netherlands</option>
							<option value="BR">Brazil</option>
							<option value="IN">India</option>
							<option value="RO">Romania</option>
							<option value="PL">Poland</option>
						</select>
					</div>
					<div>
						<label class="text-sm font-semibold text-text-primary mb-1 block">State / Province</label>
						<select
							:value="user.billingAddress.state"
							class="border border-gray-200 rounded-lg px-4 py-3 w-full text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all duration-200 appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23717680%22%20d%3D%22M3%204.5l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]"
						>
							<option value="">Select an option...</option>
							<option value="AL">Alabama</option>
							<option value="AK">Alaska</option>
							<option value="AZ">Arizona</option>
							<option value="CA">California</option>
							<option value="CO">Colorado</option>
							<option value="CT">Connecticut</option>
							<option value="DE">Delaware</option>
							<option value="FL">Florida</option>
							<option value="GA">Georgia</option>
							<option value="NY">New York</option>
							<option value="TX">Texas</option>
							<option value="WA">Washington</option>
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
					<label class="text-sm font-semibold text-text-primary mb-1 block">New Password</label>
					<input
						type="password"
						placeholder="Enter new password"
						class="border border-gray-200 rounded-lg px-4 py-3 w-full text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all duration-200"
					/>
				</div>
				<div>
					<label class="text-sm font-semibold text-text-primary mb-1 block">Confirm Password</label>
					<input
						type="password"
						placeholder="Confirm new password"
						class="border border-gray-200 rounded-lg px-4 py-3 w-full text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all duration-200"
					/>
				</div>
			</div>
		</section>

		<!-- Save button -->
		<div>
			<button class="bg-brand-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-blue/90 transition-all duration-200 cursor-pointer">
				Save Changes
			</button>
		</div>
	</div>
</template>
