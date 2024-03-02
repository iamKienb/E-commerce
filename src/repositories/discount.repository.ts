import { Types } from "mongoose"
import DiscountModel from "../models/Discount.model"

export class DiscountRepository{
    constructor(){}
     async findAllDiscountCodeSelect({filter, limit =50, sort = 'ctime', page=1, select}: {filter:any, limit:number, sort:string , page:number , select:{}}){
        const skip = (page - 1) * limit
        const sortBy = sort === 'ctime' ? {_id:-1} :{_id:1}
        const queryProduct = await DiscountModel.find(filter).sort(sortBy as any).skip(skip).limit(limit).select(select)
        if(!queryProduct){
            return null
        }
        return  queryProduct
    }

   
    async findAllDiscountCodeUnSelect({filter, limit =50, sort = 'ctime', page=1, unSelect}: {filter:any, limit:number, sort:string , page:number , unSelect:{}}){
       const skip = (page - 1) * limit
       const sortBy = sort === 'ctime' ? {_id:-1} :{_id:1}
       const queryProduct = await DiscountModel.find(filter).sort(sortBy as any).skip(skip).limit(limit).select(unSelect)
       if(!queryProduct){
           return null
       }
       return  queryProduct
   }
    async checkDiscountExists(filter:any){
        console.log(filter)
        return await DiscountModel.findOne(filter).lean()
        
    }

}

