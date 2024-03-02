import { Schema, Types , model} from 'mongoose';
import { PermissionsTypes } from '../types';
interface ApiKey{
    key: string;
    status: boolean;
    permissions: PermissionsTypes;
    createdAt: Date;
    updatedAt: Date;
}
const apiKeySchema = new Schema<ApiKey>({
    key: {
        type: String,
        required: true,
        unique: true
    },

    status:{
        type: Boolean,
        default: true
    },

    permissions:{
        type: String,
        required: true,
        enum: PermissionsTypes
    }

},{
    timestamps: true,
    collection: 'ApiKeys'
})

export default model('ApiKey', apiKeySchema)