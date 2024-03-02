import { Shop } from '../models/Shop.model';
import { KeyTokenRepository } from './../repositories/keyToken.repository';
import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import AuthService from '../services/auth.service';


import { loginDto, signUpDto } from '../dtos/auth.dto';
import { RoleTypes, StatusTypes } from '../types';
import HttpResponse from '../core/httpResponse';
import HttpException from '../core/httpException';
import statusCode from '../core/statusCode';
const authService = new AuthService(new UserRepository) 
const signUp = async (req:Request, res:Response, next:NextFunction) =>{
        const body = <signUpDto>req.body;
        const {passwordConfirmation , ...other} = body
        const {isSuccess, statusCode ,message,  data} = await authService.signUp({
            ...other,
            status: StatusTypes.ACTIVE,
            roles: RoleTypes.SHOP
        })
        
        if(!isSuccess){
            throw new HttpException(statusCode, message)
        }
        return res.status(statusCode).json(new HttpResponse(statusCode, message, data))

}
const login = async (req:Request, res:Response, next:NextFunction) =>{
    const body = <loginDto>req.body;
    const {isSuccess, statusCode ,message,  data} = await authService.login(body)
    
    if(!isSuccess){
        throw new HttpException(statusCode, message)
    }
    return res.status(statusCode).json(new HttpResponse(statusCode, message, data))

}
const logout = async (req:Request, res:Response, next:NextFunction) =>{

    const {isSuccess, statusCode ,message,  data} = await authService.logout(req.keyStore)
    if(!isSuccess){
        throw new HttpException(statusCode, message)
    }
    return res.status(statusCode).json(new HttpResponse(statusCode, message, data))
}

const handleToken = async (req:Request, res:Response, next:NextFunction) =>{
    const refreshToken = req.refreshToken
    const user = req.user
    
    const data = await authService.handleRefreshToken(refreshToken ,user , req.keyStore)
    return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, 'get token success', data))
}
export{
    signUp, login, logout, handleToken
}