import {S3Client} from '@aws-sdk/client-s3'
import dotenv from "dotenv";
dotenv.config();

const s3Config  = {
    region: 'ap-southeast-1',
    credentials:{
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY
    }
}
module.exports = new S3Client([s3Config])
