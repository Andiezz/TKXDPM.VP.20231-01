export interface ShippingCostStrategy {
    calculate(widthMax: number, totalPrice: number, province: string): number;
}