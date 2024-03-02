import { NextFunction , Request, Response} from "express";
import HttpResponse from "../core/httpResponse";
import ProductService from "../services/product.service";
import statusCode from "../core/statusCode";
import { Types } from 'mongoose';

export class ProductController{
    constructor(){}
    static createProduct  = async(req:Request, res:Response, next:NextFunction) => {
        const type = req.body.product_type;

        const body = req.body

        const data = await ProductService.createProduct(type, {
            ...body,
            product_shop:req.user.id

        }) 
        return res.status(statusCode.OK).json(data);
    }

    static getAllDraftForShop =  async (req: Request, res: Response, next: NextFunction) => {
        const product_shop = req.user.id
        const data = await ProductService.findAllDraftForUser(new Types.ObjectId(product_shop))
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK,'get all draft success' ,data));
    }

    static getAllPublishForShop =  async (req: Request, res: Response, next: NextFunction) => {
        const product_shop = new Types.ObjectId(req.user.id)
        const data = await ProductService.findAllPublishForUser(product_shop)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK,'get all published success' ,data));
    }

    static publishProductByShop = async (req: Request, res: Response, next: NextFunction) => {
        const product_shop = new Types.ObjectId(req.user.id)
     
        const product_id =  new Types.ObjectId(req.params as unknown as string)

        const data = ProductService.publicProductByShop(product_shop, product_id)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK,' published success' ,data));
    }
    
    
    static unPublishProductByShop = async (req: Request, res: Response, next: NextFunction) => {
        const product_shop = new Types.ObjectId(req.user.id)
        const product_id =  new Types.ObjectId(req.params as unknown as string)
       
        
        const data = ProductService.unPublicProductByShop(product_shop, product_id)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK,' un published success' ,data));
    } 

    static searchProductByUser = async (req: Request, res: Response, next: NextFunction) => {
        const {keySearch} =  req.params ;
        
        const data = await ProductService.searchProductByUser(keySearch);

        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK,' search product success' ,data));
    } 


    static updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        const {productId} = req.params
        const product_shop = req.user.id
        const type = req.body.product_type
        const input = req.body 
        const data = await ProductService.updateProduct(type, productId, {
            ...input,
            product_shop
        });

        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK,' update product success' ,data));
    }

    static findProduct = async (req: Request, res: Response, next: NextFunction) => {
        const {product_id} = req.params

        const data = await ProductService.findProductById(new Types.ObjectId( product_id))
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK,' find product success' ,data));
    }

    static findAllProduct = async (req: Request, res: Response, next: NextFunction) => {
        const data = await ProductService.findAllProduct(req.query as unknown as {limit: number; sort: string; page: number})
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK,' find all product success' ,data));
    }
  
    
}