

export const formateData = (
    isSuccess: boolean,
    statusCode: number,
    message: string,
    data:any
)=>{
    return {
        isSuccess,
        statusCode,
        message,
        data
    }
}