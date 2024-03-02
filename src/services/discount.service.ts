import { Types } from "mongoose"
import HttpException from "../core/httpException"
import statusCode from "../core/statusCode"
import DiscountModel from "../models/Discount.model"
import { ProductRepository } from "../repositories/product.repository"
import { getSelectData, unGetSelectData } from "../utils"
import { DiscountRepository } from "../repositories/discount.repository"

export class  DiscountService {
    constructor(private readonly discountRepository: DiscountRepository){}
    async createDiscount(body:any){
        const {code, start_date, end_date, is_active, shopId, min_order_value, 
        product_ids, applies_to, name, description, type, max_value, max_uses, uses_count, max_uses_per_user, value,users_used
        }= body
        // kiem tra

      

        if(new Date(start_date) >= new Date(end_date)){
            throw new HttpException(statusCode.BAD_REQUEST, 'start date  must be before end day !')
        }
        //create index for discount code
        const foundDiscount = await DiscountModel.findOne({
            discount_code : code,
            discount_shopId: new Types.ObjectId(shopId),
        }).lean()
        if(foundDiscount && foundDiscount.discount_is_active){
            throw new HttpException(statusCode.BAD_REQUEST, 'discount exists')
        }

        const newDiscount = await DiscountModel.create({
            discount_name:name,
            discount_description:description,
            discount_type:type,
            discount_code:code,
            discount_value:value,
            discount_min_order_value:min_order_value,
            discount_max_value:max_value,
            discount_start_date:start_date,
            discount_end_date:end_date,
            discount_max_uses:max_uses,
            discount_uses_count:uses_count,
            discount_users_used:users_used,
            discount_shopId:shopId,
            discount_max_uses_per_user:max_uses_per_user,
            discount_is_active:is_active,
            discount_applies_to:applies_to,
            discount_product_ids:applies_to === 'all' ? [] : product_ids ,

        })
 
        return newDiscount

    }

    static updateDiscountCode(){

    }

    async getAllDiscountByProduct( {code, shopId, limit, page, sort }:{code:string, shopId:Types.ObjectId, userId:Types.ObjectId, limit:number, page:number, sort:string}) {
        const foundDiscount = await DiscountModel.findOne({
            discount_code : code,
            discount_shopId: new Types.ObjectId(shopId),
        }).lean()
   
        if(!foundDiscount|| !foundDiscount.discount_is_active){
            throw new HttpException(statusCode.BAD_REQUEST, 'discount not exists')
        }
        const {discount_applies_to, discount_product_ids} = foundDiscount
    
        const selectProduct = ['product_name', 'product_price']
        const select = getSelectData(selectProduct)
        let product
        if(discount_applies_to === 'all'){
            product = await ProductRepository.findAllProduct({
                filter:{
                    product_shop: new Types.ObjectId(shopId),
                    isPublished:true  
                  },
                  limit:+limit,
                  sort:sort,
                  page:+page,
                  select
            })
        }
        if(discount_applies_to === 'specific'){
            product = await ProductRepository.findAllProduct({
                filter:{
                    _id: {$in: discount_product_ids},
                    isPublished:true  
                  },
                  limit:+limit,
                  sort:sort,
                  page:+page,
                  select
            })
        }
        
        return product
    }

    async getAllDiscountCodeByShop({limit, shopId, page, sort}: {limit:number, shopId:string, page:number, sort:string}){
        const selectProduct = unGetSelectData(['__v', 'discount_shopId'])
        const discount = await this.discountRepository.findAllDiscountCodeUnSelect({
            filter:{
                discount_shopId: new Types.ObjectId(shopId),
                discount_is_active: true
            },
            limit:+limit,
            page:+page,
            sort:sort,
            unSelect:selectProduct
        })
        return discount
    }

    async getDiscountAmount({codeId, userId, shopId, products} : {codeId:string, userId:number, shopId:string, products:any}){
        console.log(new Types.ObjectId(shopId))
        const foundDiscount = await DiscountModel.findOne({
            discount_shopId: shopId,
            discount_code: codeId,

        })
        console.log(foundDiscount)
        if(!foundDiscount){
            throw new HttpException(statusCode.BAD_REQUEST, 'discount does not exists')
        }
        
        const {discount_is_active, discount_max_uses, discount_start_date,discount_value,
            discount_end_date, discount_min_order_value, discount_max_uses_per_user, discount_type,discount_uses_count, discount_users_used
        } = foundDiscount
        const findUser = discount_users_used.includes(userId.toString())

        if(findUser){
            throw new HttpException(statusCode.BAD_REQUEST, 'discount are out1 ')
        } 
        if(!discount_is_active){
            throw new HttpException(statusCode.BAD_REQUEST, 'discount expired')
        }
        if(!discount_max_uses){
            throw new HttpException(statusCode.BAD_REQUEST, 'discount are out ')
        }
        // if(new Date(discount_start_date) > new Date()|| new Date(discount_end_date) < new Date()){
        //     throw new HttpException(statusCode.BAD_REQUEST, 'Discount has expired!')
        // }
        const totalOrder = products.reduce((acc: any, product:any) =>{
            return acc + (product.quantity * product.price)
        }, 0)
        if(discount_min_order_value > totalOrder){
            // get total
            throw new HttpException(statusCode.BAD_REQUEST, 'Discount require a minimum order ')
        }
        if(discount_uses_count >discount_max_uses){
            throw new HttpException(statusCode.BAD_REQUEST, 'discount are out ')
        }



        // check xem discount la fix_amount hay percent
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
        await DiscountModel.updateMany({
            $set:{
                discount_max_uses: discount_max_uses - 1, 
                discount_uses_count:discount_uses_count +1,
                discount_max_uses_per_user:discount_max_uses_per_user -1
            },
            $addToSet:{
                discount_users_used:userId
            }

        })
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    async deleteDiscountCode({shopId, codeId}: {shopId: string, codeId: string}){
        const deleted = await DiscountModel.findOneAndDelete({
            discount_code:codeId,
            discount_shopId: new Types.ObjectId(shopId)
        })
        return deleted
    }

    async cancelDiscountCode({codeId, shopId, userId}: {codeId:string, shopId:string, userId:string}){
        const foundShop = await this.discountRepository.checkDiscountExists({
            discount_code:codeId,
            discount_shopId: new Types.ObjectId(shopId),
            discount_users_used:userId
        })
        if(!foundShop){
            throw new HttpException(statusCode.BAD_REQUEST, 'Discount does not exist ')
        }
        const {discount_max_uses,discount_uses_count, discount_max_uses_per_user} = foundShop
        console.log(discount_max_uses, discount_uses_count, discount_max_uses_per_user)
        const result = DiscountModel.findByIdAndUpdate( foundShop._id,{
            $pull:{
                discount_users_used:userId,
            },
            $inc:{
                discount_max_uses: +1, 
                discount_uses_count: -1,
                discount_max_uses_per_user:+1
            }
             
        })
        return result
    }



}