import { NextFunction , Request, Response} from "express";
import HttpResponse from "../core/httpResponse";
import statusCode from "../core/statusCode";
import { CheckoutService } from '../services/checkout.service';
const checkoutService = new CheckoutService()

export class CheckoutController {
    static checkoutReview  = async(req:Request, res:Response, next:NextFunction) => {
        const body = req.body;
        console.log(body);
        const data = await checkoutService.checkoutReview(body);
        return  res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, 'checkout review success', data));
    }
}    