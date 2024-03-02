import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validationResource = (schema: AnyZodObject) => (req: Request, res: Response, next:NextFunction) => {
    try{
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
            
        })
        return next()
    }catch(err:any){
        res.status(401).send(err.errors)

    }

}