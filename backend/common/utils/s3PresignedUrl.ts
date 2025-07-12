import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = process.env.AWS_REGION!;
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const EXPIRES_IN_SECONDS = 60 * 5; // presigned URL 유효시간 (5분)

// Initialize S3 client
const s3Client = new S3Client({ region: REGION });

// Generate a presigned URL for uploading an object to S3
export const generatePresignedUrl = async (key: string, contentType: string): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: EXPIRES_IN_SECONDS,
  });

  return presignedUrl;
};

// Generate a presigned URL for public downloading an object from S3
export const generatePresignedGetUrl = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 172800 }); // 2일 유효
};