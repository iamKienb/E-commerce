import dotenv from "dotenv";
dotenv.config();

export default{
    db:{
        dbHost: process.env.DB_HOST!,
        port:process.env.PORT!
    }

}
