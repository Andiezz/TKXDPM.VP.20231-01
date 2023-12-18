import { CartDao, CartMongooseDao } from "../../daos/cart";
import { CartProductDao, CartProductMongooseDao } from "../../daos/cart-product";
import { ProductsMongooseDao } from "../../daos/products/providers/products.mongoose.dao";
import { Document, ObjectId } from 'mongodb'
import { ICartProduct } from '../../daos/cart-product/interfaces/cart-product.interface'
import { BadRequestError } from "../../../errors";
import { UpdateCartDto } from "../../../dtos/cart.dto";
import { OrderDao, OrderMongooseDao } from "../../daos/order";
import { OrderProductDao } from "../../daos/order-product/interface/order-product.dao";
import { OrderProductMongooseDao } from "../../daos/order-product/providers/order-product.mongoose.dao";
import { ProductModel } from "../../daos/products/schemas/product.model";
import { ProductsDao } from "../../daos/products/interfaces/products.dao.interface";
import { DeliveryInfoMongooseDao } from "../../daos/delivery-info/providers/delivery-info.mongoose.dao";
import { DeliveryInfoDao } from "../../daos/delivery-info/interfaces/delivery-info.dao";
import { CreateOrderDto } from "../../../dtos/order.dto";
import { CreateOrderProductDto } from "../../../dtos/order-product.dto";

export class OrderRepository {
    private orderDao: OrderDao
    private orderProductDao: OrderProductDao
    private cartDao:CartDao
    private cartProductDao: CartProductDao
    private productDao: ProductsDao
    private deliveryInfoDao: DeliveryInfoDao

    constructor(){
        this.orderDao=new OrderMongooseDao()
        this.orderProductDao= new OrderProductMongooseDao()
        this.productDao = new ProductsMongooseDao(ProductModel.getInstance())
        this.cartDao=new CartMongooseDao()
        this.cartProductDao= new CartProductMongooseDao()
        this.deliveryInfoDao= new DeliveryInfoMongooseDao()
    }

    public async createOrderFromCart(): Promise<boolean> {

        const cartIdObject = await this.cartDao.getLatestCartId();
        if (!cartIdObject) {
            throw new BadRequestError('Cart ID not found');
        }
        const cartId: string = cartIdObject.toString();

        // Get cart information
        const cartDoc = await this.cartDao.findById(cartId);
        if (!cartDoc) {
            throw new BadRequestError('Cart does not exist');
        }
    
        // Get products in cart
        const cartProducts = await this.cartProductDao.findProductsByCartId(cartId);
        if (!cartProducts) {
            throw new BadRequestError('No products in cart');
        }

        const deliveryInfoIdObject = await this.deliveryInfoDao.getLatestDeliveryInfoId();
        if (!deliveryInfoIdObject) {
            throw new BadRequestError('DeliveryInfo ID not found');
        }
        const deliveryInfoId: string = deliveryInfoIdObject.toString();
        const createOrderDto: CreateOrderDto = {
            totalPrice: cartDoc.totalPrice,
            totalPriceVAT: cartDoc.totalPriceVat,
            deliveryInfoId: deliveryInfoId,
            shippingCost: 123123,
            status: 0
        };
        // Create new order
        const order = await this.orderDao.create(createOrderDto);
        
        const orderIdObject = await this.orderDao.getLatestOrderId();
        if (!orderIdObject) {
            throw new BadRequestError('DeliveryInfo ID not found');
        }
        const orderId: string = orderIdObject.toString();
        // Add products to order
        for (const cartProduct of cartProducts) {
            
            const createOrderProductDto: CreateOrderProductDto = {
                productId: cartProduct.productId,
                orderId: orderId,
                quantity: cartProduct.quantity
            };
            await this.orderProductDao.create(createOrderProductDto);
        }
    
        return true;
    }

    public async getOrderInfo(){
        const orderIdObject = await this.orderDao.getLatestOrderId();
        if (!orderIdObject) {
            throw new BadRequestError('Order ID not found');
        }
        const orderId: string = orderIdObject.toString();
        const orderDoc = await this.orderDao.findById(orderId);
        if (!orderDoc) {
            throw new BadRequestError('cart not found')
        }
        const { totalPrice,totalPriceVAT,status,shippingCost,deliveryInfoId} = orderDoc
        const listProduct = await this.orderProductDao.findProductsByOrderId(orderId)
        const deliveryInfo= await this.deliveryInfoDao.findById(deliveryInfoId.toString())
        return { orderId: orderId, listProduct,deliveryInfo, totalPrice, totalPriceVAT,status,shippingCost };
    }
    
}
