export type SubscriptionStatus = 'active' | 'cancelled' | 'expired'

export type OrderStatus = 'completed' | 'refunded' | 'pending' | 'failed'

export type PaymentBrand = 'visa' | 'mastercard' | 'amex' | 'discover'

export interface Subscription {
	id: string
	date: string
	product: string
	status: SubscriptionStatus
	renewsAt: string
	actions: {
		changePlanUrl: string
		cancelUrl: string
		updatePaymentUrl: string
	}
}

export interface PaymentMethod {
	id: string
	brand: PaymentBrand
	last4: string
	expiresAt: string
	isDefault: boolean
}

export interface Order {
	id: string
	date: string
	product: string
	amount: string
	status: OrderStatus
	invoiceUrl: string
}
