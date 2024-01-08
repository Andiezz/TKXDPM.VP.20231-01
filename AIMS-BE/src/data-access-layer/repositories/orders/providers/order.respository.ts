import { CartDao, CartMongooseDao } from '../../../daos/cart'
import {
    CartProductDao,
    CartProductMongooseDao,
} from '../../../daos/cart-product'
import { ProductsMongooseDao } from '../../../daos/products/providers/products.mongoose.dao'
import { Document, ObjectId } from 'mongodb'
import { ICartProduct } from '../../../daos/cart-product/interfaces/cart-product.interface'
import { BadRequestError } from '../../../../errors'
import { UpdateCartDto } from '../../../../dtos/cart.dto'
import { OrderDao, OrderMongooseDao } from '../../../daos/order'
import { OrderProductDao } from '../../../daos/order-product/interface/order-product.dao'
import { OrderProductMongooseDao } from '../../../daos/order-product/providers/order-product.mongoose.dao'
import { ProductModel } from '../../../daos/products/schemas/product.model'
import { ProductsDao } from '../../../daos/products/interfaces/products.dao.interface'
import { DeliveryInfoMongooseDao } from '../../../daos/delivery-info/providers/delivery-info.mongoose.dao'
import { DeliveryInfoDao } from '../../../daos/delivery-info/interfaces/delivery-info.dao'
import { CreateOrderDto } from '../../../../dtos/order.dto'
import {
    CreateOrderFromCart,
    CreateOrderProductDto,
} from '../../../../dtos/order-product.dto'
import { DELIVERY_METHOD } from '../../../../configs/enums'
import { CreateDeliveryInfoDto } from '../../../../dtos/delivery-info.dto'
import { isValidObjectId } from 'mongoose'
import { ORDER_STATUS } from '../../../../configs/constants'
import {
    MailService,
    NotificationService,
    RecipientDto,
} from '../../../../subsystems/notification-service'
import { PROVINCE } from '../../../../configs/constants'

// Functional cohesion
//Thao tác với dữ liệu order từ cơ sở dữ liệu
// Data coupling
// Chỉ phụ thuộc vào các DAO thông qua interface, không phụ thuộc trực tiếp vào các implementation cụ thể
export class OrderRepository {
    private orderDao: OrderDao
    private orderProductDao: OrderProductDao
    // private cartDao: CartDao
    private cartProductDao: CartProductDao
    private productDao: ProductsDao
    private deliveryInfoDao: DeliveryInfoDao
    private notificationService: NotificationService

    constructor() {
        this.orderDao = new OrderMongooseDao()
        this.orderProductDao = new OrderProductMongooseDao()
        this.productDao = new ProductsMongooseDao(ProductModel.getInstance())
        // this.cartDao = new CartMongooseDao()
        this.notificationService = MailService.getInstance()
        this.cartProductDao = new CartProductMongooseDao()
        this.deliveryInfoDao = new DeliveryInfoMongooseDao()
    }

    public async createOrderFromCart(
        listProducts: CreateOrderFromCart[],
        createOrderDto: CreateOrderDto
    ): Promise<String> {
        // Create new order
        const order = await this.orderDao.create(createOrderDto)
        const orderIdObject = await this.orderDao.getLatestOrderId()
        const orderId: string = orderIdObject.toString()
        // Add products to order-product

        for (const productCart of listProducts) {
            const createOrderProductDto: CreateOrderProductDto = {
                productId: productCart.productId,
                orderId: orderId,
                quantity: productCart.quantity,
            }
            await this.orderProductDao.create(createOrderProductDto)
        }
        return orderId
    }

    public async getAllOrderInfo() {
        const listOrder = await this.orderDao.findAll()
        let listProduct
        let listOrderDetail = []
        for (const order of listOrder) {
            listProduct = await this.orderProductDao.findProductsByOrderId(
                order.id.toString()
            )
            const deliveryInfo = await this.deliveryInfoDao.findById(
                order.deliveryInfoId.toString()
            )
            listOrderDetail.push({ order, listProduct, deliveryInfo })
        }
        return listOrderDetail
    }
}
