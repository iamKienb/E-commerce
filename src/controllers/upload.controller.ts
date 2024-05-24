import HttpResponse from "../core/httpResponse"
import { NextFunction, Request, Response } from 'express';
import statusCode from "../core/statusCode"
import {UpLoad} from "../services/upload.service"
import HttpException from "../core/httpException";
export class uploadController{
    static uploadFile = async (req:Request, res:Response, next:NextFunction) => {
        const data = await UpLoad.uploadImage()
        return res.status(200).json(new HttpResponse(statusCode.OK, "upload success",data))
    }

    static uploadFileThumb = async (req:Request, res:Response, next:NextFunction) => {
        const {file} = req
        if(!file){
            throw new HttpException(statusCode.BAD_REQUEST, "Upload file failed")
        }
        const data = await UpLoad.uploadImageFromLocal(file.path)
        return res.status(200).json(new HttpResponse(statusCode.OK, "upload success",data))
    }
}

