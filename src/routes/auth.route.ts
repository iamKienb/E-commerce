import express from 'express';
import { handleToken, login, logout, signUp } from '../controllers/auth.controller';
import { validationResource } from '../middlewares/validationResource';
import { loginSchema, signUpSchema } from '../dtos/auth.dto';
import { authentication, authenticationApiKey, permission } from '../middlewares/authToken';


import { asyncHandler } from '../utils/authKeyToken';

const authRouter = express.Router();

//signUp

authRouter.post('/signup', validationResource(signUpSchema),  asyncHandler(signUp))
authRouter.post('/login', validationResource(loginSchema),  asyncHandler(login))

//authentication

authRouter.use(authentication)

authRouter.get('/logout',   asyncHandler(logout))
authRouter.get('/handleRefreshToken',   asyncHandler(handleToken))



export = authRouter;