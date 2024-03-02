import mongoose, { Schema, model } from 'mongoose';
import slugify from 'slugify'
import { Shop } from './Shop.model'
export interface Product extends mongoose.Document {
    product_name:string;
    product_thumb:string;
    product_description:string;
    product_slug:string;
    product_price:number;
    product_quantity:number;
    product_type:string;
    product_shop: Shop['_id'],
    product_attributes:any,
    product_ratingsAverage:number,
    product_variations:String,
    isDraft:boolean,
    isPublished:boolean
}

interface Electronic{   
    product_shop: Shop['_id'],
    manufacturer:string,
    model:string,
    color:string
}


export interface Clothing{
    product_shop: Shop['_id'],
    brand:string,
    size:string,
    material:string
}
const productSchema = new mongoose.Schema<Product>({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description:String,
    product_slug:String,
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type:{
        type: String,
        required: true,
        enum:['Electronic', 'Clothing', 'Furniture', ]
    },
    product_shop:{
        type:Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes:{
        type:Schema.Types.Mixed,
        required: true
    },
    product_ratingsAverage:{
        type: Number,
        default: 4.5,  
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val:number)=>Math.round(val *10)/10
    },
    product_variations:{
        type:Array,
        default: []
    },
    isDraft:{
        type:Boolean,
        default: true,
        index:true,
        select:false
    },
    isPublished:{
        type:Boolean,
        default: false,
        index:true,
        select:false
    }


},{
    collection:'Products',
    timestamps:true,
})

productSchema.index({product_name : 'text' , product_description : 'text'})
productSchema.pre('save', function (next){
    this.product_slug = slugify(this.product_name, {lower:true})
    next()
})


// define the product 
const clothingSchema = new mongoose.Schema<Clothing>({
    product_shop:{type:Schema.Types.ObjectId, required:true , ref:'Shop'},
    brand:{
        type:String,
        require:true
    },
    size:String,
    material:String
},{
    collection: 'clothings',
    timestamps:true
})

// define the electronic

const electronicSchema = new mongoose.Schema<Electronic>({
    product_shop:{type:Schema.Types.ObjectId, required:true , ref:'Shop'},
    manufacturer:{
        type:String,
        require:true
    },
    model:String,
    color:String
},{
    collection: 'electronics',
    timestamps:true
})

const FurnitureSchema = new mongoose.Schema<Electronic>({
    product_shop:{type:Schema.Types.ObjectId, required:true , ref:'Shop'},
    manufacturer:{
        type:String,
        require:true
    },
    model:String,
    color:String
},{
    collection: 'furnitures',
    timestamps:true
})

export default {
    product: model('Product', productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicSchema),
    furniture: model('Furniture', FurnitureSchema),
}
