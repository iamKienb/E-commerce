import { DiscountService } from "../services/discount.service";
import { NextFunction , Request, Response} from "express";
import HttpResponse from "../core/httpResponse";
import statusCode from "../core/statusCode";
import { DiscountRepository } from "../repositories/discount.repository";
import reasonPhrases from "../core/reasonPhrases";
const discountService = new DiscountService(new DiscountRepository)
export class DiscountController {
    
    static createDiscountCode = async(req:Request, res:Response, next:NextFunction) => {
        const shopId = req.user.id
        const body = req.body;
        console.log(body)
        const data = await discountService.createDiscount({
            ...body,
            shopId: shopId
        })
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, reasonPhrases.CREATED, data));
    }

    static getAllDiscountCode = async(req:Request, res:Response, next:NextFunction) => {
        const shopId = req.user.id
        const query = req.query as any;
    
        const data = await discountService.getAllDiscountCodeByShop({
            ...query,
            shopId: shopId
        })

        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, 'successfully code found', data));
    }

    static getDiscountAmount = async(req:Request, res:Response, next:NextFunction) => {
        const body = req.body;

        const data = await discountService.getDiscountAmount({
            ...body,
        })
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, reasonPhrases.CREATED, data));
    }

    static getAllDiscountCodeWithProduct = async(req:Request, res:Response, next:NextFunction) => {
        const query = req.query as any ;
        console.log(query)
        const data = await discountService.getAllDiscountByProduct({
            ...query,
        })
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, 'get all product success', data));
    }

    static cancelDiscount = async (req:Request, res:Response, next:NextFunction) => {
        const body = req.body;
        const data = await discountService.cancelDiscountCode({
            ...body
        })
        return  res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, 'cancel  discount  success', data));
    }
}