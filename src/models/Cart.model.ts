import mongoose, {Schema, Types, model} from 'mongoose'

export interface Cart extends  mongoose.Document{
    cart_state: string, 
    cart_products:any,
    cart_count_product:number,
    cart_userId:number,
}


const cartSchema = new Schema<Cart>({
    cart_state:{
        type:String,
        enum:['active', 'completed', 'pending', 'failed']
    },

    cart_products:{
        type:Array,
        required:true,
        default:[]
        
    },
    cart_count_product:{
        type:Number,
        default:0

    },
    cart_userId:{
        type:Number,
        required:true
    }

},{
    timestamps:true,
    collection:'Carts'
})


export default model('Cart',cartSchema)