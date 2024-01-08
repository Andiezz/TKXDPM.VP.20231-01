import { PROVINCE } from '../../../configs/constants'
import { ShippingCostStrategy } from './shipping-cost-strategy.interface'

export class RushShippingCostStrategy implements ShippingCostStrategy {
    calculate(widthMax: number, totalPrice: number, province: string): number {
        const HN = PROVINCE.find((province) => province.code === 1) // 1 is the code for Hà Nội
        const HCM = PROVINCE.find((province) => province.code === 79) // 79 is the code for Hồ Chí Minh
        let shippingCost
        if (totalPrice * 1.1 > 100000) {
            shippingCost = 0
        } else if (province == HN?.name || province == HCM?.name) {
            if (widthMax <= 3) {
                shippingCost = widthMax * 22000
            } else {
                shippingCost = 3 * 22000 + (widthMax - 3) * 2 * 2500
            }
        } else {
            if (widthMax <= 0.5) {
                shippingCost = widthMax * 30000
            } else {
                shippingCost = 0.5 * 30000 + (widthMax - 0.5) * 2 * 2500
            }
        }
        shippingCost = shippingCost + 10000
        return shippingCost
    }
}
