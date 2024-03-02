import { InventoryRepository } from '../repositories/inventory.repository';
import { ObjectId, Types } from 'mongoose';
export  interface Inventory{
    stock:number,
    productId:string,
    shopId:string,
    location:string
}

import { ProductRepository } from '../repositories/product.repository';
import HttpException from '../core/httpException';
import statusCode from '../core/statusCode';
import InventoryModel from '../models/Inventory.model';

export class InventoryService{
    async addStockToInventory({stock, productId, shopId, location = '134, TranPhu, hcm'}:Inventory){
        const product = await ProductRepository.findProductById(productId);
        if(!product){
            throw new HttpException(statusCode.BAD_REQUEST, 'Product not found')
        }
        const query = {
            inventory_ShopId:shopId,
            inventory_productId:productId
        },updateSet = {
            $inc:{
                inventory_stock:stock,
            },
            $set:{
                inventory_location:location
            }
        },options = {
            upsert: true,
            new:true
        }

        return await InventoryModel.findOneAndUpdate(query, updateSet, options)

    }
}