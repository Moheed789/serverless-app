const AWS = require('aws-sdk');
const {v4: uuidv4} = require('uuid');
AWS.config.update({
    signatureVersion: 'v4',
});
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    if (!body.fileName || !body.fileType) {
        return{
            statusCode: 400,
            body: JSON.stringify({message: "Bad Request"})
        };
    }
    console.log('body', body);
    let { fileName: reqFileName, fileType: reqFileType } = body;
    const generatedFileName = `${uuidv4()}-${reqFileName}`;
    const s3Key = `document/${generatedFileName}`;
    const expires = 360;
    const bucket = 'moheedemployees3bucket'
    const params = {
        Bucket: bucket,
        Key: s3Key,
        ContentType: reqFileType,
        Expires: expires
    };
    try {
        const signedUrl = await s3.getSignedUrlPromise('putObject', params);
        return {
            statusCode: 200,
            body: JSON.stringify({
                signedUrl,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to generate signed URL',
            }),
        };
    }
};
