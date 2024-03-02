import { ProductRepository } from '../repositories/product.repository';
import HttpException from "../core/httpException";
import statusCode from "../core/statusCode";
import { CartRepository } from "../repositories/cart.repository";
const cartRepository = new CartRepository()
import { DiscountService } from "./discount.service";
import { DiscountRepository } from '../repositories/discount.repository';
import OrderModel from '../models/Order.model';
const discountService = new DiscountService(new DiscountRepository)
export class CheckoutService {
   
    async checkoutReview({
        cartId, userId, shop_order_ids
    }:{ cartId:string, userId:number, shop_order_ids:any}){
        // check cardId co ton tai hay k 
        console.log(shop_order_ids)
        const foundCart = await cartRepository.findCartById(cartId);
        if(!foundCart){
            throw new HttpException(statusCode.BAD_REQUEST, 'Cart does not exists')
        }

        const checkout_order = {
            totalPrice: 0,  //tổng tiền hàng đã đặt
            feeShip:0, // phí vận chuyển 
            totalDiscount:0, // tổng tiền giảm giá 
            totalCheckout:0 // tổng thanh toán phải trả      
        }, shop_order_ids_new = []

        //tính tổng tiền bill
        
        for (let i =0 ; i < shop_order_ids.length ; i++ ){
            const {shopId, shop_discounts = [], item_products = []} = shop_order_ids[i]
            //check sản phẩm ở server
            console.log(item_products)
            const checkProductServer = await ProductRepository.checkProductByServer(item_products)
            console.log(`checkProductServer:::`, checkProductServer)
            if(!checkProductServer[0]) {
                throw new HttpException(statusCode.BAD_REQUEST, 'order wrong')
            }
            // tổng tiền đơn hàng 
            const checkoutPrice = checkProductServer.reduce((acc, product) =>{
                const price = product?.price;
                const quantity = product?.quantity;
                if (typeof price === 'number' && typeof quantity === 'number') {

                    return acc + (price * quantity)
                }
                else {
                    return acc;
                }
            }, 0)

            // tổng tiền trước khi xử lý 
            checkout_order.totalPrice +=checkoutPrice
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw:checkoutPrice, // tiền trước khi giảm giá
                priceApplyDiscount: checkoutPrice,
                item_products:checkProductServer
            }

            // nếu shop_discounts tồn tại > 0 check xem có hợp lệ hay k 
            if(shop_discounts.length > 0){
                // giả sử chỉ có 1 discount 
                // get amount discount
                const {totalPrice = 0, discount = 0} = await discountService.getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products:checkProductServer

                })
                // tổng cộng discount giảm giá 
                checkout_order.totalDiscount += discount 
                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
                
            }

            // tổng tiền thanh toán cuối cùng 
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)


        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }


    async orderByUser(shop_order_ids:any, userId:number, cartId:string,user_address:string, user_payment:number){
        const {shop_order_ids_new, checkout_order} = await new CheckoutService().checkoutReview({
            userId,
            cartId,
            shop_order_ids
        })

        const products =  shop_order_ids_new.flatMap(order => order.item_products) as any
        console.log(`[1]:`, products)

        const newOrder = await OrderModel.create({
            order_userId:userId,
            order_checkout:checkout_order,
            order_shipping:user_address,
            order_products:shop_order_ids_new
        })
        
        // trường hợp thành công thì remove product in cart 
        if(newOrder){
            // remove product from cart
        }


    }
}
