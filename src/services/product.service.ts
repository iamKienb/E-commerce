import { Inventory } from '../models/Inventory.model';
import { InventoryRepository } from '../repositories/inventory.repository';
import { ProductRepository } from '../repositories/product.repository';
import { Types } from "mongoose"
import HttpException from "../core/httpException"
import statusCode from "../core/statusCode"
import ProductModel from "../models/Product.model"
import { getSelectData, unGetSelectData } from '../utils';
import InventoryModel from '../models/Inventory.model';
const {  clothing, electronic, product, furniture} = ProductModel

class ProductService{
    constructor(
        
    ){}
    static productRegistry = {} as any
    static registerProductType (type:string, classRef:any){
         ProductService.productRegistry[type] = classRef 

    }

    static async createProduct (type:string, payload:any){
        if(!type || !payload) throw new HttpException(statusCode.BAD_REQUEST ,'Please provide information')
        const productClass =  ProductService.productRegistry[type]
   
        if (!productClass){
            throw new HttpException(statusCode.BAD_REQUEST,`invalid product type 1 ${type}`)
        }
        return new productClass(payload).createProduct()
    }
    
    
    static async updateProduct (type:string,productId:string, payload:any){
        if(!type || !payload) throw new HttpException(statusCode.BAD_REQUEST ,'Please provide information')
        const productClass =  ProductService.productRegistry[type]
   
        if (!productClass){
            throw new HttpException(statusCode.BAD_REQUEST,`invalid product type 1 ${type}`)
        }
        return new productClass(payload).updateProduct(new Types.ObjectId(productId))
    }   

    //query
    static  async findAllDraftForUser(product_shop:Types.ObjectId, limit = 50, skip = 0){
            const query = {product_shop, isDraft: true}
            if(!product_shop) throw new HttpException(statusCode.BAD_REQUEST, 'USER NOT FOUND')
            return await ProductRepository.findAllDraftForUser(query, limit, skip) 

    }

    static  async findAllPublishForUser(product_shop:Types.ObjectId, limit = 50, skip = 0){
            
            const query = {product_shop, isPublished: true}
            if(!product_shop) throw new HttpException(statusCode.BAD_REQUEST, 'USER NOT FOUND')
            return await ProductRepository. findAllPublishForUser(query, limit, skip) 

    }

    static async publicProductByShop(product_shop:Types.ObjectId, product_id:Types.ObjectId){
            return await ProductRepository.publicProductByShop(product_shop,product_id)
    }

    static  async unPublicProductByShop(product_shop:Types.ObjectId, product_id:Types.ObjectId){
            return await ProductRepository.unPublicProductByShop(product_shop,product_id)
    }

    static  async searchProductByUser(keySearchKey: string){
        return await ProductRepository.searchProductByUser(keySearchKey)
    }

    static  async findProductById(productId:Types.ObjectId){
        const selectProduct = ['__v' , 'product_variations']
        const unSelect = unGetSelectData(selectProduct) 
        return await ProductRepository.findProduct(productId , unSelect)
    }

    static async findAllProduct({limit = 50, sort = 'ctime' , page = 1 }:{limit:number, sort:string, page:number} ){
        const selectProduct = ['product_name', 'product_price', 'product_thumb']
        const filter = {isPublished : true}
        const select = getSelectData(selectProduct)
        return await ProductRepository.findAllProduct( {filter, limit, sort , page , select})
    }



}


class Product {
    product_name:string;
    product_thumb:string;
    product_description:string;
    product_price:number;
    product_quantity:number;
    product_type:string;
    product_shop: string;
    product_attributes:any

    constructor({
        product_name,
        product_thumb,
        product_description,
         product_price,
        product_quantity,
         product_type,
        product_shop,
        product_attributes,
    }:Record<string,any>) {
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes
    }

    async createProduct(productId:Types.ObjectId) {

        const create = await product.create({
            _id: productId,
            ...this
        })
        if(create){
            await InventoryModel.create({
                inventory_productId: productId,
                inventory_shopId: this.product_shop,
                inventory_stock: this.product_quantity
            })
        }
        return create
    }   

    async updateProduct(productId:Types.ObjectId , bodyUpdate:any) {    
        return await product.findByIdAndUpdate(
            productId,
            bodyUpdate,
            {
                new:true
            }
        )
    }
}

class Clothing extends Product {
    
    async createProduct(){
      
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
      

        if(!newClothing) throw new HttpException(statusCode.BAD_REQUEST,'create new clothing error')
        const Product = await super.createProduct(newClothing._id)   
    
        if(!Product) throw new HttpException(statusCode.BAD_REQUEST, 'create new Product error')
        return Product
        
    }   
    
    async updateProduct(productId: Types.ObjectId){
        const objParams  = this
        if(objParams.product_attributes){
            await clothing.findByIdAndUpdate(productId, objParams.product_attributes, {
                new : true
            })

            // miss validate update product 
        }
        const updateProduct = await super.updateProduct(productId, objParams)
        return updateProduct
    }
}

class Electronic extends Product {
    
    async createProduct(){
        
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new HttpException(statusCode.BAD_REQUEST,'create new Electronic error')
        const newProduct = await super.createProduct(newElectronic._id)   
        if(!newProduct) throw new HttpException(statusCode.BAD_REQUEST, 'create new Product error')
        return newProduct
        
    }   
}

class Furniture extends Product {
    
    async createProduct(){
        
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw new HttpException(statusCode.BAD_REQUEST,'create new Furniture error')
        const newProduct = await super.createProduct(newFurniture._id)   
        if(!newProduct) throw new HttpException(statusCode.BAD_REQUEST, 'create new Product error')
        return newProduct
        
    }   
}
ProductService.registerProductType('Clothing',Clothing)

ProductService.registerProductType('Electronic',Electronic)

ProductService.registerProductType('Furniture',Furniture)

export default ProductService