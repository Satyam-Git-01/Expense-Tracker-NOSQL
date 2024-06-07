const AWS= require('aws-sdk')
const uploadTos3 = async (data, fileName) => {
  const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
  const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

  let s3bucket = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  });

  let params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(s3response);
        resolve(s3response.Location);
      }
    });
  });
};

module.exports = {
  uploadTos3,
};
