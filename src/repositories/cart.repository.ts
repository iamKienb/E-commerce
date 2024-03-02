import { Types } from "mongoose"
import CartModel from "../models/Cart.model"

export class CartRepository{
    async findCartById(cartId:string){
        if(!cartId) return null
        return  await CartModel.findOne({
            _id: new Types.ObjectId(cartId),
            cart_state:'active'
        }).lean()
    }
    


}