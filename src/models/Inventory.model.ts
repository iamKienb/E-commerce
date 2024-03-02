import mongoose, {Schema, Types, model} from 'mongoose'
import ProductModel, { Product } from './Product.model'
import {Shop} from './Shop.model'
export interface Inventory extends  mongoose.Document{
    inventory_productId: Product['_id'],
    inventory_location:string,
    inventory_stock:number,
    inventory_shopId:Shop['_id'],
    inventory_reservation:Array<any>

}


const inventorySchema = new Schema<Inventory>({
    inventory_productId:{
        type:Schema.Types.ObjectId,
        ref:'Product'
    },

    inventory_location:{
        type:String,
        default:'unknown'
    },

    inventory_stock:{
        type:Number,
        required:true
    },

    inventory_shopId:{
        type:Schema.Types.ObjectId,
        ref:'Shop'
    },
    inventory_reservation:{
        type:[],
        default:[]
    }

},{
    timestamps:true,
    collection:'Inventories'
})


export default model('Inventory',inventorySchema)