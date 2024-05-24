import multer from "multer";
const uploadMemory = multer({
    storage: multer.memoryStorage()
})

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb){  //destination: nơi chứa file up load 
            cb(null, './src/uploads')
        },
        filename: function (req, file, cb){ //filename: nơi ta điều chỉnh tên file
            cb(null, `${Date.now()}-${file.originalname}`)


        }
    })
})

export {
    uploadMemory, uploadDisk
}