import mongoose, { Schema } from "mongoose";

import { Types, Document } from "mongoose"
export {};
declare global {
  namespace Express {
    interface Request  {
      objKey: string;
      keyStore:any;
      user:{
        id:string;
        email:string;
      };
      refreshToken:string
    }
  }
}

export  enum RoleTypes {
    SHOP = "SHOP",
    WRIER  = "WRITER",
    EDITOR = "EDITOR",
    ADMIN = "ADMIN",

}

export enum PermissionsTypes{
    ZERO = "0000",
    ONE = "1111",
    TWO = "2222",
    
}
export enum StatusTypes{
    ACTIVE = "active",
    INACTIVE = "inactive",
    
}
export interface SignUpShop{
    name: string,
    email: string,
    password: string,
    status: StatusTypes,
    roles: RoleTypes,

}

export interface ApiKeyTypes{
    key: string;
    status: boolean;
    permissions: string;

}

export interface HeaderTypes{
    ApiKey:string,
    AUTHORIZATION:string,
    CLIENT_ID:string,
    REFRESH_TOKEN:string
}

export interface FormateData  {
  statusCode: number;
  message: string;
  isSuccess: boolean;
  data: any;
};

export interface LoginShop{
  email: string,
  password: string,

}

export interface ObjectId extends mongoose.ObjectId {
  _id: this;
}