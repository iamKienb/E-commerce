import { formateData } from '../utils/fomateData';
import { KeyTokenRepository } from '../repositories/keyToken.repository';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword, validatePassword } from '../utils/handlePassword';
import { LoginShop, PermissionsTypes, RoleTypes, SignUpShop } from '../types';
import crypto from 'crypto';
import { KeyTokenService } from './keyToken.service';
import { generateToken, validateToken } from '../utils/authKeyToken';
import { getInfoData } from '../utils';
import statusCode from '../core/statusCode';
import reasonPhrases from '../core/reasonPhrases';
import HttpException from '../core/httpException';
const keyTokenService = new KeyTokenService(new KeyTokenRepository)
export default class AuthService {
    constructor(
        private readonly  userRepository: UserRepository,

    ){}
    async signUp(input:SignUpShop, refreshToken = null){
        
        const checkEmailExist = await this.userRepository.findUserByEmail(input.email);
        if(checkEmailExist){
            return formateData(false, statusCode.BAD_REQUEST, 'user already exists', null);
        }
        input.password = await hashPassword(input.password)        
        const newUser = await this.userRepository.createUser(input)
        if(newUser){

            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')
      
            const tokens = await generateToken({id: newUser._id, email: newUser.email}, privateKey)
            if(!tokens){
                return formateData(false, statusCode.FORBIDDEN, reasonPhrases.FORBIDDEN, null)
            }
            console.log('create token success: ', tokens)
            const publicKeyString = await keyTokenService.createKeyToken(newUser._id, publicKey, privateKey, tokens.refreshToken)
            if(!publicKeyString){
                return formateData(false, statusCode.FORBIDDEN, reasonPhrases.FORBIDDEN, null)
            }

            // const createApiKey = await apiKeyService.createKey({key:crypto.randomBytes(64).toString('hex'),status:true, permissions: PermissionsTypes.ZERO})
            // if(!createApiKey){
            //     return {
            //         message: 'api key Error'
            //     }
            // }
            return formateData(true, statusCode.CREATED , reasonPhrases.CREATED, {
                user: getInfoData({filed: ['name', 'email'] as never[] , objects: newUser}),
                tokens
            })

        }

        return formateData(false, statusCode.BAD_REQUEST, 'fail to create user', null)



    }


    async login(input: LoginShop){
        const foundUser = await this.userRepository.findUserByEmail(input.email)
        if(!foundUser){
            return formateData(false,statusCode.BAD_REQUEST, 'fail to login', null )
        } 
        const checkPassword = await validatePassword(input.password, foundUser.password)
        if(!checkPassword){
            return formateData(false,statusCode.UNAUTHORIZED, 'authorized error', null)
        }
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
   
        const tokens = await generateToken({id: foundUser._id, email: foundUser.email}, privateKey)
        await keyTokenService.createKeyToken(
            foundUser._id,
            publicKey,
            privateKey,
            tokens.refreshToken,
        )
        return formateData(true, statusCode.CREATED , reasonPhrases.CREATED, {
            user: getInfoData({filed: ['name', 'email'] as never[] , objects: foundUser}),
            tokens
        })


    }

    async logout (keyStore:any){
        
        const delKey = await keyTokenService.removeKeyById(keyStore._id)
        if(!delKey){ 
            return formateData(false, statusCode.UNAUTHORIZED, 'Invalid request', null)
        }
        return formateData(true, statusCode.OK, 'logout success', delKey)
    }

    async handleRefreshToken(refreshToken:string , user:{id:string, email:string}, keyStore:any){
        const {id, email} = user
        if(keyStore.refreshTokenUsed.includes(refreshToken)){
            await keyTokenService.removeKeyById(id)
            throw new HttpException(statusCode.FORBIDDEN, 'something went wrong please re login')
        }

        if(keyStore.refreshToken != refreshToken){
            throw new HttpException(statusCode.UNAUTHORIZED, 'shop not registered')
        }

        const foundShop = await keyTokenService.findByUserId(id) 
        if(!foundShop){
            throw new HttpException(statusCode.UNAUTHORIZED, 'shop not registered')
        }
        //create 1 cap key moi
        const tokens = await generateToken({id, email}, keyStore.privateKey.toString()) 
        //updateKeyToken
        const refreshTokenUsed = refreshToken
        const updateTokens = await keyTokenService.updateRefreshToken(refreshTokenUsed,tokens.refreshToken)
        if(!updateTokens){
            throw new HttpException(statusCode.UNAUTHORIZED, 'invalid')
        }
        
       return {
        user,
        tokens
       }

    }
}


