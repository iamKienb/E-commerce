import { ObjectId } from 'mongoose';
import KeyTokenModel from "../models/KeyToken.model"
import {Types} from 'mongoose' 
export class KeyTokenRepository {
    constructor(){}
    async createKey(user:string, publicKey:string, privateKey:string){
        if(!user || !publicKey || !privateKey){
            return null
        }
        return await KeyTokenModel.create({user, publicKey, privateKey})
    }

    async findUserById(user:string){
        if(!user){
            return null
        }
        return await KeyTokenModel.findOne({user}).lean()
    }
    
    async UpdateKeyToken(filter:{}, update:{}, option:{}){
        if(!filter || !update){
            return null
        }
        return await KeyTokenModel.findOneAndUpdate(filter, update,option)
    }

    async removeId(user:string){
        if(!user){
            return null
        }
        return await KeyTokenModel.deleteOne({user})
    }
    async findByRefreshTokenUsed(refreshTokenUsed:string){
        if(!refreshTokenUsed ){
            return null
        }
        return await KeyTokenModel.findOne({refreshTokenUsed})
    }
    async findRefreshToken(refreshToken:string){
        if(!refreshToken ){
            return null
        }
        return await KeyTokenModel.findOne({refreshToken})
    }

    async updateRefreshToken(refreshTokenUsed:string, refreshToken:string){
        if(!refreshToken ){
            return null
        }
        return await KeyTokenModel.updateMany({
            $set:{
                refreshToken:refreshToken
            },
            $addToSet:{
                refreshTokenUsed:refreshTokenUsed
            }
        })
    }

}