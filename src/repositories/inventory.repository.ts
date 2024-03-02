import { ObjectId } from './../types/index';
import InventoryModel, { Inventory } from "../models/Inventory.model"
import { Types } from 'mongoose';

export class InventoryRepository{
    constructor(){}
    static async insertInventory(productId:Types.ObjectId, shopId:string, stock:number, location:string):Promise<Inventory> {

        return await InventoryModel.create({
            inventory_productId: productId,
            inventory_shopId: shopId,
            inventory_stock: stock,
            inventory_location:location
        })
    }

    static async reservationInventory({productId, quantity, cartId}:{productId: string, quantity:number,cartId:string}){   // hàm đặt hàng - tồn kho 
        const query = {
            inventory_productId: new Types.ObjectId( productId),
            inventory_stock:{$gte: quantity}  // tìm kiếm số lượng khách đặt hàng phải lớn hơn hoặc bằng số lượng trong kho

        },updateSet ={
            $inc:{
                inventory_stock: -quantity
            }, // - đi số lượng khách đã đặt 
            $push:{
                inventory_reservations:{
                    quantity,
                    cartId,
                    createOn: new Date()
                }
            }
        }, option = {upsert:true, new:true}
        return await InventoryModel.updateOne(query,updateSet,option)
    }

         
}

