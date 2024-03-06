import mongoose, {Schema, Types, model} from 'mongoose'

export interface Order extends  mongoose.Document{
    order_userId:number,
    order_status: string, 
    order_products:any,
    order_checkout:object,
    order_shipping:object,
    order_payment:object,
    order_trackingNumber:string
}


const orderSchema = new Schema<Order>({
    order_userId:{
        type:Number,
        required:true
    },
    order_checkout:{
        type:Object,
        default:{}
    },
    /*
        order_checkout:{
            totalPrice: 0,  //tổng tiền hàng đã đặt
            feeShip:0, // phí vận chuyển 
            totalDiscount:0, // tổng tiền giảm giá 
            totalCheckout:0 // tổng thanh toán phải trả      
        }
    */

     order_shipping:{
        type:Object,
        default:{}
    },

        /*
        order_shipping:{
            street:
            city:
            state:
            country:
        }
    */

    order_payment:{
        type:Object,
        default:{}
    },

    order_products:{
        type:Array,
        required:true,
        default:[]
        
    }, // chính là shop_order_ids_new

    order_trackingNumber:{
        type:String,
        default:'#0000118052002'
    },
    order_status:{
        type:String,
        enum:['confirmed', 'shipped', 'pending', 'cancelled', 'delivered'],
        default:'pending'
    },



},{
    timestamps:true,
    collection:'Orders'
})


export default model('Order',orderSchema)