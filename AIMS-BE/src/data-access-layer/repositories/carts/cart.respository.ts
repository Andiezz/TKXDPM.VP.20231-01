import { CartDao, CartMongooseDao } from "../../daos/cart";
import { CartProductDao, CartProductMongooseDao } from "../../daos/cart-product";

import { ProductsMongooseDao } from "../../daos/products/providers/products.mongoose.dao";
import { Document, ObjectId } from 'mongodb'
import { ICartProduct } from '../../daos/cart-product/interfaces/cart-product.interface'
import { BadRequestError } from "../../../errors";
import { UpdateCartDto } from "../../../dtos/cart.dto";
import { CreateCartProductDto } from "../../../dtos/cart-product.dto";
import { ProductsDao } from "../../daos/products/interfaces/products.dao.interface";
import { ProductModel } from "../../daos/products/schemas/product.model";

export class CartRepository {
    private cartDao:CartDao
    private cartProductDao: CartProductDao
    private productDao: ProductsDao

    constructor(){
        this.cartDao=new CartMongooseDao()
        this.cartProductDao= new CartProductMongooseDao()
        this.productDao = new ProductsMongooseDao(ProductModel.getInstance())
    }
    public async updateCartInfo(productId: string,quantity:number){
        const product = await this.productDao.findById(productId);
        if (!product) {
            throw new BadRequestError('product not found ')
        }
        const productPrice = product.price*quantity
        const cartIdObject = await this.cartDao.getLatestCartId();
        if (!cartIdObject) {
            throw new BadRequestError('Cart ID not found');
        }
        const cartId: string = cartIdObject.toString();
        const cartDoc = await this.cartDao.findById(cartId);
        if (!cartDoc) {
            throw new BadRequestError('User not found')
        }
        if (!productPrice) {
            throw new BadRequestError('User not found '+productPrice)
        }
        const { totalPrice} = cartDoc
        const totalPriceAfter =totalPrice+productPrice
        const totalPriceVatAfter=totalPriceAfter*0.1
        const updateCartDto: UpdateCartDto = {
            totalPrice: totalPriceAfter,
            totalPriceVat: totalPriceVatAfter
        };
        const createCartProductDto: CreateCartProductDto = {
            productId: productId,
            cartId: cartId,
            quantity:quantity
        };
        this.cartDao.updateInfo(cartId,updateCartDto)
        this.cartProductDao.create(createCartProductDto)
    }   

    public async getCartInfo(){
        const cartIdObject = await this.cartDao.getLatestCartId();
        if (!cartIdObject) {
            throw new BadRequestError('Cart ID not found');
        }
        const cartId: string = cartIdObject.toString();
        const cartDoc = await this.cartDao.findById(cartId);
        if (!cartDoc) {
            throw new BadRequestError('cart not found')
        }
        const { totalPrice,totalPriceVat} = cartDoc
        const listProductId = await this.cartProductDao.findProductsByCartId(cartId)
        return { cartId: cartId, listProductId, totalPrice, totalPriceVat };
    }

    public async resetCart(): Promise<void> {
        const cartIdObject = await this.cartDao.getLatestCartId();

        if (!cartIdObject) {
            throw new BadRequestError('Cart ID not found');
        }
        const cartId: string = cartIdObject.toString();
           await this.cartDao.resetCart(cartId);
           await this.cartProductDao.deleteAll()
    }
    

}
