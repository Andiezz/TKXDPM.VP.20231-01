import { KIND } from "../../../configs/enums";
import { ProductsDao } from "./interfaces/products.dao";
import BooksMongooseDao from "./providers/books.mongoose.dao";

class ProductDaoFactory {
    private productDaos: Record<string, ProductsDao>

    constructor() {
        this.productDaos = {};
        this.productDaos[KIND.BOOK] = new BooksMongooseDao()
    }
}