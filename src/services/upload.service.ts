import cloudinary from '../config/cloudinary'
export class UpLoad{
    static uploadImage = async () =>{
        try{
            const urlImage = "https://lh3.googleusercontent.com/a/ACg8ocL8SFhYQQ5P9ZboS1eeMKOsF8dQxcNZji3gDEvwXmE5eDM=s83-c-mo"
            const folderName = 'product/shopId', newFileName = 'testDemo'
            const result = await cloudinary.uploader.upload(urlImage,{
                // public_id:newFileName
                folder:folderName
            })

            return result
        }catch(err){
            console.log('error uploading image::', err)
        }
    }

    static uploadImageFromLocal = async (
        path:any, folderName = 'product/8409'
    ) =>{
        try{
            const result = await cloudinary.uploader.upload(path.toString(),{
                public_id:'thumb', // tên ảnh
                folder:folderName
            })
            return {
                image_url: result.secure_url,
                shopId:8409,
                thumb_url: await cloudinary.url(result.public_id,{
                    height:100,
                    width:100,
                    format:'jpg'
                })
            }
        }catch(err){
            console.log('error uploading image::', err)
        }
    }
}





