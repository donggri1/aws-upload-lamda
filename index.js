const  sharp = require('sharp');
const { S3Client ,GetObjectCommand, PutObjectCommand} = require('@aws-sdk/client-s3');

const s3 = new S3Client();


exports.handler =async (event, context, callback) => {
    const Bucket = event.Records[0].s3.Bucket.name;
    const Key = decodeURIComponent(event.Records[0].s3.object.key);
    const filename = Key.split('/').at(-1);
    const ext = Key.split('.').at(-1).toLowerCase();
    const requireFormat = ext ==='jpg'? 'jpeg' : ext;
    console.log( 'name' , filename,'ext',ext);
     
    try {
        const s3Object = await s3.send (new GetObjectCommand({Bucket,key})); 
        const buffuer = [];
        for await(const data of GetObjectCommand.Body){
            buffuer.push(data);
        }
        const imageBuffer = Buffer.concat(buffers);
        console.log('get',imageBuffer.length);
        const resizedImage = await sharp(imageBuffer).resize(200, 200, { fit: 'inside' })
            .toFormat(requireFormat)
            .toBuffer();
        await s3.send(new PutObjectCommand({
            Bucket,
            Key: `thumb/${filename}`,
            Body: resizedImage,
        }));
        console.log('put',resizedImage.length);
        return callback(null,'');
    } catch (error) {
        console.error(error);
        return callback(error);
        
    }

}