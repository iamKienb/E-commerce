
import express from 'express';

import { authentication, authenticationApiKey, permission } from '../middlewares/authToken';


import { asyncHandler } from '../utils/authKeyToken';

import { CheckoutController } from '../controllers/checkout.controller';

const checkoutRouter = express.Router();
checkoutRouter.post('/review', asyncHandler(CheckoutController.checkoutReview))



//authentication


export = checkoutRouter