import { InventoryService } from '../services/inventory.service';
import { NextFunction , Request, Response} from "express";
import HttpResponse from "../core/httpResponse";
import statusCode from "../core/statusCode";
const inventoryService = new InventoryService()

export class InventoryController {
    static addStockToInventory  = async(req:Request, res:Response, next:NextFunction) => {
        const body = req.body;
        console.log(body);
        const data = await inventoryService.addStockToInventory(body);
        return  res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, 'create new inventory', data));
    }
}    