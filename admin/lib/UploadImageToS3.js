import AWS from 'aws-sdk';

const AWS_ACCESS_KEY_ID=process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY=process.env.AWS_SECRET_ACCESS_KEY
const AWS_S3_REGION=process.env.AWS_S3_REGION
const S3_BUCKET_NAME=process.env.S3_BUCKET_NAME

async function uploadImageToS3(file) {
  // Configure AWS SDK
  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_S3_REGION
  });

  const s3 = new AWS.S3();
  // Generate a unique filename for the uploaded image
  const fileName = `${Date.now()}_${file.name}`;

  // Set the parameters for S3 upload
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Body: file
  };

  try {
    // Upload the image to S3
    const data = await s3.upload(params).promise();
    console.log('Image uploaded successfully:', data.Location);
    return data.Location; // Return the S3 URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image:', error.message);
    throw error;
  }
}

export default uploadImageToS3;
