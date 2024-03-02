
import express from 'express';

import { authentication, authenticationApiKey, permission } from '../middlewares/authToken';


import { asyncHandler } from '../utils/authKeyToken';

import { CheckoutController } from '../controllers/checkout.controller';
import { InventoryController } from '../controllers/inventory.controller';

const inventoryRouter = express.Router();

inventoryRouter.use(authentication)
inventoryRouter.post('/', asyncHandler(InventoryController.addStockToInventory))



//authentication


export = inventoryRouter