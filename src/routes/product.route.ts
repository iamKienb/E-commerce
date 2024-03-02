import express from 'express';
import { handleToken, login, logout, signUp } from '../controllers/auth.controller';
import { validationResource } from '../middlewares/validationResource';
import { loginSchema, signUpSchema } from '../dtos/auth.dto';
import { authentication, authenticationApiKey, permission } from '../middlewares/authToken';

import { PermissionsTypes } from '../types';
import { asyncHandler } from '../utils/authKeyToken';
import { ProductController } from '../controllers/product.controller';

const productRouter = express.Router();
productRouter.get('/search/:keySearch', asyncHandler(ProductController.searchProductByUser))
productRouter.get('/findAllProduct', asyncHandler(ProductController.findAllProduct))
productRouter.get('/findProduct/:id', asyncHandler(ProductController.findProduct))
//authentication

productRouter.use(authentication)
////


productRouter.post('/createProduct', asyncHandler(ProductController.createProduct))
productRouter.patch('/updateProduct/:id', asyncHandler(ProductController.updateProduct))
productRouter.post('/published/:id', asyncHandler(ProductController.publishProductByShop))
productRouter.post('/unPublished/:id', asyncHandler(ProductController.unPublishProductByShop))
productRouter.get('/published/all', asyncHandler(ProductController.getAllPublishForShop))
productRouter.get('/drafts/all', asyncHandler(ProductController.getAllDraftForShop))




export = productRouter;