import reasonPhrases from '../core/reasonPhrases';
import statusCode from '../core/statusCode';
import { ApiKeyTypes } from '../types';
import { formateData } from '../utils/fomateData';
import { ApiKeyRepository } from '../repositories/apiKey.repository';
export class ApiKeyService{
    constructor(private readonly apiKeyRepository: ApiKeyRepository){}
    async createKey(input:ApiKeyTypes){
        const newKey = await this.apiKeyRepository.createApiKey(input)
        if(!newKey){
            return formateData(false, statusCode.FORBIDDEN, reasonPhrases.FORBIDDEN, null)
        }
  
        return formateData(true, statusCode.CREATED, reasonPhrases.CREATED, newKey)

    }
    async findKeyById(key:string){
        const objKey = await this.apiKeyRepository.findKey(key);
        if(!objKey){
            return formateData(false, statusCode.NOT_FOUND, reasonPhrases.NOT_FOUND, null)
        }
        return formateData(true, statusCode.OK, reasonPhrases.OK, objKey.permissions)
    }
}

 