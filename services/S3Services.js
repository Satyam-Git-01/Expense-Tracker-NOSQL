const AWS= require('aws-sdk')
const uploadTos3 = async (data, fileName) => {
  const BUCKET_NAME = process.env.MY_AWS_BUCKET_NAME;
  const MY_AWS_ACCESS_KEY = process.env.MY_AWS_ACCESS_KEY;
  const MY_AWS_SECRET_KEY = process.env.MY_AWS_SECRET_KEY;

  let s3bucket = new AWS.S3({
    accessKeyId: MY_AWS_ACCESS_KEY,
    secretAccessKey: MY_AWS_SECRET_KEY,
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
