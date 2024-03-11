const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const objects = await s3.listObjectsV2({ Bucket: "moheedemployees3bucket" }).promise();
        const files = objects.Contents;

        const urls = await Promise.all(files.map(file => {
            const params = {
                Bucket: "moheedemployees3bucket",
                Key: file.Key,
                Expires: 60 * 5,
            };
            return s3.getSignedUrlPromise('getObject', params)
                .then(url => ({ fileName: file.Key, url }));
        }));

        console.log('Signed URLs: ', urls);
        return {
            statusCode: 200,
            body: JSON.stringify({ urls }),
        };
    } catch (err) {
        console.error('Error listing objects or generating signed URLs:', err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not list objects or generate signed URLs', details: err.message }),
        };
    }
};
