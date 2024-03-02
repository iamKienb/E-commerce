import UserModel from '../models/Shop.model'
import {Shop} from '../models/Shop.model'
import { SignUpShop } from '../types'
export class UserRepository {

    constructor(){}
    async createUser(input: SignUpShop){
        if(!input){
            return null
        }
        return await UserModel.create(input)
    }

    async findUserByEmail(email: string){
        if(!email){
            return null
        }
        return await UserModel.findOne({email}).lean()
    }
}