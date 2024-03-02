import { Types } from "mongoose";
import ProductModel  from "../models/Product.model";

const { product, clothing, furniture} = ProductModel

interface EnumServiceItem {
    productId:string,
    quantity:number,
    price:number
}

interface EnumServiceItems extends Array<EnumServiceItem>{}
export class ProductRepository {
    constructor(){}
    static async findAllDraftForUser(query:{product_shop:Types.ObjectId , isDraft:boolean}, limit:number, skip:number){
        if(!query || !limit || !skip){
            return await product.find(query).populate('product_shop', 'name email -_id'). sort({updateAt: -1}).skip(skip).limit(limit).lean()
        }
    }
    static async findAllPublishForUser(query:{product_shop:Types.ObjectId , isPublished:boolean}, limit:number, skip:number){
        return await ProductRepository.queryProduct(query, limit, skip)
    }
            
    static  async queryProduct(query:{}, limit:number, skip:number){
        if(!query || !limit || !skip){
        return await product.find(query).populate('product_shop', 'name email ').sort({updateAt: -1}).skip(skip).limit(limit).lean()
        }
    }

    static async publicProductByShop(product_shop:Types.ObjectId, product_id:Types.ObjectId){
        if(!product_shop || !product_id){
            return null
        }
        const foundShop = await product.findOne({
            product_shop: product_shop,
            _id: product_id
        })
        if(!foundShop){
            return null
        }
        foundShop.isDraft = false
        foundShop.isPublished = true
        const modifiedCount = await foundShop.updateOne(foundShop)
        return modifiedCount.nModified 

    }
    
    static async findProductById(product_id:string){
        if(!product_id){
            return null
        }
        return await product.findById({_id:product_id})
    }
    static async unPublicProductByShop(product_shop:Types.ObjectId, product_id:Types.ObjectId){
        if(!product_shop || !product_id){
            return null
        }
        const foundShop = await product.findOne({
            product_shop: product_shop,
            _id: product_id
        })
        if(!foundShop){
            return null
        }
        foundShop.isDraft = true
        foundShop.isPublished = false
        const modifiedCount = await foundShop.updateOne(foundShop)
        return modifiedCount.nModified 

    }
    
    static async searchProductByUser( keySearchKey: string){

        const regexSearch = new RegExp(keySearchKey).toString()
        console.log(regexSearch)
        const result = await product.find({
            isPublished: true,
            $text:{ $search: regexSearch},
            
        },
            {score: {$meta: 'textScore'}}
        ).sort({score: {$meta: 'textScore'}}).lean()
        console.log(result)
        if(!result){
            return null
        } 
        return result
    }

    static async findProduct(product_id:Types.ObjectId, unselect:{}){
        if(!product_id){
            return null
        }
        return await product.findOne(product_id).select(unselect)
    }

    static async findAllProduct({filter, limit, sort, page, select}: {filter:any, limit:number, sort:string , page:number , select:{}}){
        const skip = (page - 1) * limit
        const sortBy = sort === 'ctime' ? {_id:-1} :{_id:1}
        const queryProduct = await product.find(filter).sort(sortBy as any).skip(skip).limit(limit).select(select)
        if(!queryProduct){
            return null
        }
        return  queryProduct
    }

    static async updateProduct(product_id:Types.ObjectId, input:any){
        if(!product_id) return null
        return await product.findByIdAndUpdate({
            _id: product_id,
            input
        })
    }
    static async checkProductByServer (products:EnumServiceItems){

        return await Promise.all(products.map(async product =>{
            const foundProduct = await ProductRepository.findProductById(product.productId)
            if(foundProduct){
                return {
                    price: foundProduct.product_price,
                    quantity: product.quantity,
                    productId: product.productId
                }
            }

        }))
    }
}

