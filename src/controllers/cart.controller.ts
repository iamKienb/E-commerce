import { CartService } from '../services/cart.service';
import { NextFunction , Request, Response} from "express";
import HttpResponse from "../core/httpResponse";
import statusCode from "../core/statusCode";
const cartService = new CartService()
export class CartController {
    static addToCart = async(req:Request, res:Response, next:NextFunction) => {
        const body = req.body;
        const data = await cartService.addToCart(body)
 
        return  res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, 'create new cart success', data));
    }
    static updateCart = async(req:Request, res:Response, next:NextFunction) => {
        const body = req.body;
        const data = await cartService.addToCartV2(body)
        return  res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, 'update  cart success', data));
    }

    static deleteItemCart =  async(req:Request, res:Response, next:NextFunction) => {
        const body = req.body;
        const data = await cartService.deleteItemCart(body)
        return  res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, 'delete cart success', data));
    }
    static listToCart = async(req:Request, res:Response, next:NextFunction) => {
        const query = req.query as any;
      
        const data = await cartService.getListUserCart(query)
        return  res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, 'get list cart success', data));
    }
}