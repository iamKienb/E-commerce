import { object } from 'zod';
import { Request, Response, NextFunction } from "express"
import { ApiKeyRepository } from "../repositories/apiKey.repository"
import { ApiKeyService } from "../services/apiKey.service"
import { HeaderTypes } from "../types"
import { ObjectId } from 'mongoose';
const apiKeyService = new ApiKeyService(new ApiKeyRepository)
import crypto from 'crypto'
import { asyncHandler, validateToken } from '../utils/authKeyToken';
import HttpException from '../core/httpException';
import statusCode from '../core/statusCode';
import { KeyTokenRepository } from '../repositories/keyToken.repository';
import { Types } from 'mongoose';
import { KeyTokenService } from '../services/keyToken.service';



const keyTokenService = new KeyTokenService(new KeyTokenRepository)


const HEADER: HeaderTypes = {
    ApiKey: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESH_TOKEN: 'x-refresh-token',
}


const authenticationApiKey = async(req: Request, res: Response, next:NextFunction) => {
    try{
        const key = req.headers[HEADER.ApiKey]?.toString()
        
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        const objKey = await apiKeyService.findKeyById(key)

        
        if(!objKey){
            return res.status(403).json({
                message: ' Forbidden Error'
            })
        }
        
        req.objKey = objKey.data
        return next() 
    }catch(e){
        
    }
}

const permission =  (permission:string) =>{
    return (req:Request, res: Response, next:NextFunction) =>{
        if(!req.objKey){
            return res.status(403).json({
                message: 'permission denied'
            })
        }
        console.log('permission:', req.objKey)
        const validPermission = req.objKey.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                message: 'permission denied'
            })
        }
        return next() 
    }
} 






const authentication =  asyncHandler(async (req:Request, res:Response, next:NextFunction) =>{
    /* 
        1-check missing id
        2-get access token
        3-verify token
        4-check user in db
        5-check keyStore with this userId
        6-ok all => return next()

    */

   const userId = req.headers[HEADER.CLIENT_ID]?.toString();
   
   if(!userId){
    throw new HttpException(statusCode.BAD_REQUEST, 'Invalid request ')
   }

   const keyStore = await keyTokenService.findByUserId(userId)   
   if(!keyStore){
       throw new HttpException(statusCode.NOT_FOUND, 'authentication no found')
    }
    const privateKey = keyStore.privateKey.toString()

   const refreshToken = req.headers[HEADER.REFRESH_TOKEN]?.toString()
   if(refreshToken){
    try{
        const decodeUser = await validateToken(refreshToken, privateKey )
        if(userId !==  decodeUser.id){
            throw new HttpException(statusCode.UNAUTHORIZED, 'Invalid user')
        }
        req.keyStore = keyStore 
        console.log('keystoreId::',keyStore._id)
        req.user = decodeUser
        console.log('userId::' ,decodeUser.id)
        req.refreshToken = refreshToken 
        
        return next()
       }catch(e){
        throw e
       }
   }


   const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
   if(!accessToken){
       throw new HttpException(statusCode.UNAUTHORIZED, 'no found token');
   }

   try{
    const decodeUser = await validateToken(accessToken, privateKey )
    if(userId !==  decodeUser.id){
        throw new HttpException(statusCode.UNAUTHORIZED, 'Invalid user')
    }
    req.keyStore = keyStore as unknown as string
    return next()
   }catch(e){
    throw e
   }

})

export {
    authenticationApiKey, permission, authentication
}