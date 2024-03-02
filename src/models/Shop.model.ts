import mongoose, {model, Schema, Types} from 'mongoose'
import { RoleTypes } from '../types';
export interface Shop extends mongoose.Document {

    name: string,
    email: string,
    password: string,
    status: string,
    verify: Schema.Types.Boolean,
    roles:RoleTypes,
    createdAt: Date,
    updatedAt: Date
    
}
const shopSchema = new Schema<Shop>({

    name:{
        type: String,
        trim:true,
        maxLength:150,
        required:true
        
    },
    email:{
        type: String,
        unique:true,
        trim:true,
        required:true
    },
    password:{
        type: String,
        required:true,
    },
    status: {
        type: String,
        enum:['active', 'inactive'],
        default:'inactive'
    },
    verify:{
        type: Schema.Types.Boolean,
        default:false,
    },
    roles:{
        type:String,
        enum:RoleTypes,
        
    }

},{
    timestamps:true,
    collection: 'Shops',
})

export default model('Shop', shopSchema);