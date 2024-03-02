import statusCode from "../core/statusCode"
import reasonPhrases from '../core/reasonPhrases';
import { formateData } from '../utils/fomateData';
import { KeyTokenRepository } from '../repositories/keyToken.repository';

export class KeyTokenService {
    constructor(private readonly keyTokenRepository: KeyTokenRepository){}
    async createKeyToken(userId:string, publicKey:string, privateKey:string, refreshToken:string){
        const filter = {user: userId}
        const update = {publicKey, privateKey, refreshTokenUsed:[], refreshToken}
        const option = {upsert:true, new:true}
        const tokens = await this.keyTokenRepository.UpdateKeyToken(filter, update , option)
        if(!tokens){
            return formateData(false, statusCode.FORBIDDEN, reasonPhrases.FORBIDDEN, null)
        }
        return formateData(true, statusCode.CREATED, reasonPhrases.CREATED, tokens.publicKey);

    }
    async findByUserId(userId: string){
        
        return await this.keyTokenRepository.findUserById(userId)
    }

    async removeKeyById (userId: string) {
        
        return await this.keyTokenRepository.removeId(userId)
    }

    async findByRefreshTokenUsed(refreshToken: string){

        return await this.keyTokenRepository.findByRefreshTokenUsed(refreshToken)
    } 
    async findByRefreshToken(refreshToken: string){

        return await this.keyTokenRepository.findRefreshToken(refreshToken)
    } 

    async updateRefreshToken(refreshTokenUsed: string, refreshToken: string){

        return await this.keyTokenRepository.updateRefreshToken(refreshTokenUsed,refreshToken)
    }
}