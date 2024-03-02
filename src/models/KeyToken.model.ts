
import mongoose, {Schema , model} from 'mongoose'
import { Shop } from './Shop.model'
interface KeyToken extends mongoose.Document {
    user: Shop['_id'],
    privateKey: string,
    publicKey: string,
    refreshTokenUsed: Array<string>,
    refreshToken: string,
    createdAt: Date,
    updatedAt: Date
}
const keyTokenSchema = new Schema<KeyToken>({
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    privateKey:{
        type: String,
        required:true
    },
    publicKey:{
        type: String,
        required:true
    },
    refreshTokenUsed:{
        type: [String],
        default: [],
     
    },
    refreshToken:{
        type: String,
        required:true
 
     
    }
},{
    timestamps:true,
    collection:'Keys'
})

export default model('Key', keyTokenSchema)