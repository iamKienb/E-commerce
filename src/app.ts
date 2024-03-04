import cors from "cors";
import express, { Express, Request, Response, NextFunction} from "express";
import morgan from "morgan";
import helmet from 'helmet'
import compression from "compression";
import authRouter from "./routes/auth.route";
import errorHandler from "./middlewares/error-handle";
import { authenticationApiKey, permission } from "./middlewares/authToken";
import { PermissionsTypes } from "./types";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.route";
import checkoutRouter from "./routes/checkout.route";
import discountRouter from "./routes/discount.route";
import inventoryRouter from "./routes/inventory.route";
export const expressApp = (app: Express) => {
    //init middlewares
    app.use(cors({ origin: "*" }));
    app.use(express.json());
    app.use(morgan("dev"))
    app.use(helmet())
    app.use(compression());

    app.use(authenticationApiKey)        
    // app.use(permission(PermissionsTypes.ZERO));  

    //init routes
    app.use('/api/v1/inventory', inventoryRouter);
    app.use('/api/v1/checkout', checkoutRouter);
    app.use('/api/v1/cart', cartRouter);
    app.use('/api/v1/discount', discountRouter);
    app.use('/api/v1/product', productRouter);
    app.use('/api/v1/auth', authRouter);
    


    //handle error
    app.use(errorHandler)


};
