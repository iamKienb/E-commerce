import ApiKeyModel from "../models/ApiKey.model";
import { ApiKeyTypes } from "../types";


export class ApiKeyRepository {
    constructor(){}
    async findKey(key: string){
        if(!key){
            return null;
        }
        return await ApiKeyModel.findOne({key, status: true}).lean()
    }

    async createApiKey(input:ApiKeyTypes){
        if(!input){
            return null;
        }
        return await ApiKeyModel.create(input)
    }
}
