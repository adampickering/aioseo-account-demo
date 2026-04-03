export interface BillingAddress {
	line1: string
	line2: string
	city: string
	zip: string
	country: string
	state: string
}

export interface User {
	id: string
	firstName: string
	lastName: string
	email: string
	avatarUrl: string
	billingAddress: BillingAddress
}

export interface QuickLink {
	label: string
	href: string
}
