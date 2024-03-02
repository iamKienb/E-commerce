import HttpException from "../core/httpException";
import statusCode from "../core/statusCode";
import CartModel from "../models/Cart.model";

import { ProductRepository } from '../repositories/product.repository';

export class CartService{
    //START REPO CART
    //END REPO CART
    async createUserCart({userId, product}: {userId:number, product:any}){
        console.log('step 2')
        const query = {
            cart_userId:userId,
            cart_state:'active'
        },
        updateOrInsert ={
            $addToSet:{
                cart_products:product
            }
        },options = {upsert:true, new:true}
        const data = await CartModel.findOneAndUpdate(query, updateOrInsert, options);
        if(!data){
            throw new HttpException(statusCode.BAD_REQUEST, 'not created')
        };
        return data
    }

    async updateUserCart({userId, product}: {userId:number, product:any}){
        const {quantity, productId} = product;
        const query = {
            cart_userId:userId,
            'cart_products.productId':productId,
            cart_state:'active'
        },
        updateSet ={
            $inc:{
                'cart_product.$quantity':quantity
            }
        },options = {upset:true, new:true}
        return await CartModel.findOneAndUpdate(query, updateSet, options);
    }
    async addUserCart({userId, product}: {userId:number, product:any}){
        const query = {
            cart_userId:userId,
            cart_state:'active'
        },
        updateSet ={
            $push:{
                cart_products:product
            }
        },options = {upset:true, new:true}
        return await CartModel.findOneAndUpdate(query, updateSet, options);
    }
    async addToCart({userId, product}: {userId:number, product:any}){
        const userCart = await CartModel.findOne({cart_userId:userId})
     
        if (!userCart){
            // tạo giỏ hàng
            console.log("!userCart")
            return await new CartService().createUserCart({userId, product})
        }

        // nếu có giỏ hàng rồi nhưng chưa có sản phẩm 
        if(!userCart.cart_products.length){ //! có nghĩa là = rỗng  
            console.log("!userCart1")
            userCart.cart_products = [product] 
            return await userCart.save()
        }
        if(userCart.cart_products.length > 0){
            return await new CartService().addUserCart({userId, product})
        }
        //giỏ hàng tồn tại và có sản phẩm thì update quantity
        return await new CartService().updateUserCart({userId, product})
    }

    async addToCartV2({userId, shop_order_ids}: {userId:number, shop_order_ids:any}){
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0]
        const foundShop = await ProductRepository.findProductById(productId)
        if(!foundShop){
            throw new HttpException(statusCode.NOT_FOUND, 'not found product')
        }
        if(foundShop.product_shop.toString() !== shop_order_ids[0].shopId){
            throw new HttpException(statusCode.NOT_FOUND, 'Product not belong to shop')
        }
        if(quantity ===0){
            return await new CartService().deleteItemCart({userId, productId})
        }
        return await new CartService().updateUserCart({
            userId,
            product:{
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    async deleteItemCart({userId, productId}: {userId:number, productId:string} ){
      
        const query = {
            cart_userId:userId,
            cart_state:'active'
        },
        updateSet ={
            $pull:{
                cart_products:{
                    productId
                }
            }
        }
        const deleteCart = await CartModel.updateOne(query,updateSet)
        return deleteCart
    }

    async getListUserCart(query:any){
        const {userId} = query
        console.log(userId)
        return CartModel.findOne({cart_userId:userId}).lean()
    } 
}