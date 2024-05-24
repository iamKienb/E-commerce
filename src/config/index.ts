import dotenv from "dotenv";
dotenv.config();

export default{
    app:{
        port:process.env.PORT!
    },
    db:{
        url: process.env.DB_URL!,
    }

}
