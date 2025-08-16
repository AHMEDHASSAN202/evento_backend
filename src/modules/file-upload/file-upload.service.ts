import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB');
    }

    const fileName = `${folder}/${uuidv4()}-${file.originalname}`;
    const bucket = this.configService.get('AWS_S3_BUCKET');

    const uploadParams: AWS.S3.PutObjectRequest = {
      Bucket: bucket,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const result = await this.s3.upload(uploadParams).promise();
      return result.Location;
    } catch (error) {
      throw new BadRequestException('Failed to upload file');
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    try {
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // Remove leading slash
      const bucket = this.configService.get('AWS_S3_BUCKET');

      await this.s3.deleteObject({
        Bucket: bucket,
        Key: key,
      }).promise();
    } catch (error) {
      // Log error but don't throw to avoid breaking the main operation
      console.error('Failed to delete file from S3:', error);
    }
  }

  async uploadProfilePicture(file: Express.Multer.File, userId: number, type: 'user' | 'freelancer'): Promise<string> {
    const folder = `profile-pictures/${type}/${userId}`;
    return this.uploadFile(file, folder);
  }

  async uploadPortfolioImage(file: Express.Multer.File, freelancerId: number): Promise<string> {
    const folder = `portfolio/${freelancerId}`;
    return this.uploadFile(file, folder);
  }

  async uploadPackageImage(file: Express.Multer.File, packageId: number): Promise<string> {
    const folder = `packages/${packageId}`;
    return this.uploadFile(file, folder);
  }
}

