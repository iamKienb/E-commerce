
import express from 'express';

import { authentication, authenticationApiKey, permission } from '../middlewares/authToken';


import { asyncHandler } from '../utils/authKeyToken';

import { CartController } from '../controllers/cart.controller';

const cartRouter = express.Router();
cartRouter.post('/createCart', asyncHandler(CartController.addToCart))
cartRouter.post('/updateCart', asyncHandler(CartController.updateCart))
cartRouter.delete('/deleteCart', asyncHandler(CartController.deleteItemCart))
cartRouter.get('/getListCart', asyncHandler(CartController.listToCart))


//authentication


export = cartRouter