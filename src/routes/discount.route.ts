import express from 'express';

import { authentication, authenticationApiKey, permission } from '../middlewares/authToken';


import { asyncHandler } from '../utils/authKeyToken';

import { DiscountController } from '../controllers/discount.controller';

const discountRouter = express.Router();
discountRouter.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
discountRouter.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodeWithProduct))


//authentication
discountRouter.use(authentication)

discountRouter.post('/createDiscount', asyncHandler(DiscountController.createDiscountCode))
discountRouter.post('/cancelDiscount', asyncHandler(DiscountController.cancelDiscount))
discountRouter.get('/getAllDiscount', asyncHandler(DiscountController.getAllDiscountCode))


export = discountRouter