import { CartDao, CartMongooseDao } from '../../daos/cart'
import { CartProductDao, CartProductMongooseDao } from '../../daos/cart-product'
import { ProductsMongooseDao } from '../../daos/products/providers/products.mongoose.dao'
import { Document, ObjectId } from 'mongodb'
import { ICartProduct } from '../../daos/cart-product/interfaces/cart-product.interface'
import { BadRequestError } from '../../../errors'
import { UpdateCartDto } from '../../../dtos/cart.dto'
import { OrderDao, OrderMongooseDao } from '../../daos/order'
import { OrderProductDao } from '../../daos/order-product/interface/order-product.dao'
import { OrderProductMongooseDao } from '../../daos/order-product/providers/order-product.mongoose.dao'
import { ProductModel } from '../../daos/products/schemas/product.model'
import { ProductsDao } from '../../daos/products/interfaces/products.dao.interface'
import { DeliveryInfoMongooseDao } from '../../daos/delivery-info/providers/delivery-info.mongoose.dao'
import { DeliveryInfoDao } from '../../daos/delivery-info/interfaces/delivery-info.dao'
import { CreateOrderDto } from '../../../dtos/order.dto'
import {
    CreateOrderFromCart,
    CreateOrderProductDto,
} from '../../../dtos/order-product.dto'
import { DELIVERY_METHOD, ORDER_STATUS } from '../../../configs/enums'
import { CreateDeliveryInfoDto } from '../../../dtos/delivery-info.dto'
import { isValidObjectId } from 'mongoose'

export class OrderRepository {
    private orderDao: OrderDao
    private orderProductDao: OrderProductDao
    // private cartDao: CartDao
    private cartProductDao: CartProductDao
    private productDao: ProductsDao
    private deliveryInfoDao: DeliveryInfoDao

    constructor() {
        this.orderDao = new OrderMongooseDao()
        this.orderProductDao = new OrderProductMongooseDao()
        this.productDao = new ProductsMongooseDao(ProductModel.getInstance())
        // this.cartDao = new CartMongooseDao()
        this.cartProductDao = new CartProductMongooseDao()
        this.deliveryInfoDao = new DeliveryInfoMongooseDao()
    }

    public async createOrderFromCart(
        listProductsCart: CreateOrderFromCart[],
        createDeliveryInfoDto: CreateDeliveryInfoDto
    ): Promise<String> {
        // Check input null
        if (!listProductsCart || !createDeliveryInfoDto) {
            return 'List product or Delivery info error '
        }
        // Check address support rush
        if (createDeliveryInfoDto.deliveryMethod == DELIVERY_METHOD.RUSH) {
            if (createDeliveryInfoDto.province != 'Hà Nội') {
                return 'Address not available in your province'
            }
        }

        // Create Delivery Detail
        await this.deliveryInfoDao.create(createDeliveryInfoDto)
        // Get ID delivery
        const deliveryInfoIdObject =
            await this.deliveryInfoDao.getLatestDeliveryInfoId()
        if (!deliveryInfoIdObject) {
            throw new BadRequestError('DeliveryInfo error')
        }
        const deliveryInfoId: string = deliveryInfoIdObject.toString()

        //Caculate Price
        let totalPrice = 0
        let widthMax = 0
        for (const productCart of listProductsCart) {
            const productDetail = await this.productDao.findById(
                productCart.productId.toString()
            )
            if (!productDetail) {
                throw new BadRequestError('Product not found')
            }
            totalPrice += productDetail.price * productCart.quantity
            if (
                productDetail.productDimensions &&
                productDetail.productDimensions.width &&
                widthMax <= productDetail.productDimensions.width
            ) {
                widthMax = productDetail.productDimensions.width
            }
        }

        //Caculate ShippingCost
        let shippingCost
        if (totalPrice * 1.1 > 100000) {
            shippingCost = 0
        } else if (
            createDeliveryInfoDto.province == 'Hà Nội' ||
            createDeliveryInfoDto.province == 'Hồ Chí Minh'
        ) {
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
        if (createDeliveryInfoDto.deliveryMethod == DELIVERY_METHOD.RUSH) {
            shippingCost = shippingCost + 10000
        }

        const createOrderDto: CreateOrderDto = {
            totalPrice: totalPrice,
            totalPriceVAT: totalPrice * 0.1,
            deliveryInfoId: deliveryInfoId,
            shippingCost: shippingCost,
            status: ORDER_STATUS.PENDING,
        }
        // Create new order
        const order = await this.orderDao.create(createOrderDto)
        const orderIdObject = await this.orderDao.getLatestOrderId()
        if (!orderIdObject) {
            throw new BadRequestError('DeliveryInfo ID not found')
        }
        const orderId: string = orderIdObject.toString()
        // Add products to order

        for (const productCart of listProductsCart) {
            const createOrderProductDto: CreateOrderProductDto = {
                productId: productCart.productId,
                orderId: orderId,
                quantity: productCart.quantity,
            }
            await this.orderProductDao.create(createOrderProductDto)
        }

        return 'Ok'
    }

    public async getOrderInfo() {
        const orderIdObject = await this.orderDao.getLatestOrderId()
        if (!orderIdObject) {
            throw new BadRequestError('Order ID not found')
        }
        const orderId: string = orderIdObject.toString()
        const orderDoc = await this.orderDao.findById(orderId)
        if (!orderDoc) {
            throw new BadRequestError('cart not found')
        }
        const {
            totalPrice,
            totalPriceVAT,
            status,
            shippingCost,
            deliveryInfoId,
        } = orderDoc
        const listProduct =
            await this.orderProductDao.findProductsByOrderId(orderId)
        const deliveryInfo = await this.deliveryInfoDao.findById(
            deliveryInfoId.toString()
        )
        return {
            orderId: orderId,
            listProduct,
            deliveryInfo,
            totalPrice,
            totalPriceVAT,
            status,
            shippingCost,
        }
    }
}
