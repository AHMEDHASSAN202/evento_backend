import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('File Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('profile-picture/:type/:id')
  @ApiOperation({ summary: 'Upload profile picture for user or freelancer' })
  @ApiResponse({ status: 201, description: 'Profile picture uploaded successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Param('type') type: 'user' | 'freelancer',
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileUrl = await this.fileUploadService.uploadProfilePicture(file, id, type);
    return { fileUrl };
  }

  @Post('portfolio/:freelancerId')
  @ApiOperation({ summary: 'Upload portfolio image for freelancer' })
  @ApiResponse({ status: 201, description: 'Portfolio image uploaded successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPortfolioImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('freelancerId', ParseIntPipe) freelancerId: number,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileUrl = await this.fileUploadService.uploadPortfolioImage(file, freelancerId);
    return { fileUrl };
  }

  @Post('package/:packageId')
  @ApiOperation({ summary: 'Upload image for package' })
  @ApiResponse({ status: 201, description: 'Package image uploaded successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPackageImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('packageId', ParseIntPipe) packageId: number,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileUrl = await this.fileUploadService.uploadPackageImage(file, packageId);
    return { fileUrl };
  }
}

