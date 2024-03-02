import mongoose, {Schema, Types, model} from 'mongoose'
import ProductModel, { Product } from './Product.model'
import {Shop} from './Shop.model'
export interface Discount extends  mongoose.Document{
    discount_name:string,
    discount_description:string,
    discount_type:string,
    discount_value:number,
    discount_max_value:number
    discount_code:string,
    discount_start_date:Date,
    discount_end_date:Date,
    discount_max_uses:number,
    discount_uses_count:number,
    discount_users_used:Array<string>,
    discount_max_uses_per_user:number,
    discount_min_order_value:number,
    discount_shopId: Shop['_id'],
    discount_is_active:boolean,
    discount_applies_to:string,
    discount_product_ids:Array<string>

}


const discountSchema = new Schema<Discount>({
    discount_name:{
        type: String,
        required: true
    },

    discount_description: {
        type: String,
        required: true
    },

    discount_type:{
        type: String,
        default: 'fixed_amount' // giảm giá theo tiền or percentage : theo %

    },

    discount_value: {
        type:Number,
        required: true 
    },
     // số tiền cố định để giảm giá
    discount_max_value: {
        type:Number,
        required: true 
    }, // tổng lượt sử dụng tối đa cho mặt hàng
    discount_code:{
        type: String,
        required: true
    }, //mã code giảm giá

    discount_start_date:{
        type: Date,
        required: true
    },

    discount_end_date:{
        type: Date,
        required: true
    },
    discount_max_uses:{
        type: Number,
        required: true
    }, // số lượng discount được áp dụng cho mặt hàng

    discount_uses_count:{
        type: Number,
        default: 0
    }, // số lượng discount đã sử dụng

    discount_users_used:{
        type: [String],
        default: []
    }, // ai đã sử dụng cái mã code này

    discount_max_uses_per_user:{
        type: Number,
        required: true
    }, // số lương cho phép tối đa user được sử dụng 
    discount_min_order_value:{
        type: Number,
        required: true
    }, // giá trị đơn hàng tối thiểu 
    discount_shopId:{
        type:Schema.Types.ObjectId,
        ref: 'Shop'
    },
    discount_is_active:{
        type:Boolean,
        default:true
    },
    discount_applies_to:{
        type:String,
        required:true,
        enum:['all', 'specific']
    },

    discount_product_ids:{
        type:[String],
        default:[]
    }// số sản phẩm được áp dụng
},{
    timestamps:true,
    collection:'discounts'
});


export default model('Discount',discountSchema)