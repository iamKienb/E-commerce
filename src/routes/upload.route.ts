
import express from 'express';
import { uploadController } from '../controllers/upload.controller';
import { asyncHandler } from '../utils/authKeyToken';
import { uploadDisk } from '../middlewares/multer';

const uploadRouter = express.Router();

// inventoryRouter.use(authentication)
uploadRouter.post('/product', asyncHandler(uploadController.uploadFile))
uploadRouter.post('/product/singleThumb', uploadDisk.single('file'),asyncHandler(uploadController.uploadFileThumb))

//authentication

export = uploadRouter