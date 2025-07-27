const  sharp = require('sharp');
const { S3Client} = require('@aws-sdk/client-s3');

const s3 = new S3Client();


exports.handler =async (event, context, callback) => {
    const Bucket = event.Records[0].s3.Bucket.naem;
    const Key = decodeURIComponent(event.Records[0].s3.object.key);
    const filename = Key.split('/').at(-1);
    const ext = Key.split('.').at(-1).toLowerCase();
    const requireFormat = ext ==='jpg'? 'jpeg' : ext;
    console.log( 'name' , filename,'ext',ext);
     
    try {
        const s3Object = await getObject({Bucket,key}); 
        console.log('original', s3Object);
        await sharp(s3Object.Body).resize(200 ,200,{fit:'inside'})
            .toFormat(requireFormat)
            .toBuffer();
        await s3.putObject({
            Bucket,
            Key: `thumb/${filename}`,
            Body: resizedImage,
        })
        console.log('put',resizedImage.length);
        return callback(null,'');
    } catch (error) {
        console.error(error);
        return callback(error);
        
    }

}