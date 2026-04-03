import { computed } from 'vue'
import { useMockProfile } from './useMockProfile'
import type { ProductType, License } from '@/types'

export function useLicenses() {
	const { data } = useMockProfile()

	const licenses = computed(() => data.value.licenses)

	const licensesByProduct = computed(() => {
		const grouped: Partial<Record<ProductType, License[]>> = {}
		for (const license of licenses.value) {
			const list = grouped[license.product]
			if (list) {
				list.push(license)
			} else {
				grouped[license.product] = [license]
			}
		}
		return grouped
	})

	function hasProduct(product: ProductType) {
		return computed(() => licenses.value.some((l) => l.product === product))
	}

	return { licenses, licensesByProduct, hasProduct }
}
