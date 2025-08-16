import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';

@ApiTags('Reviews')
@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Create a new review (User only)' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    // Ensure the review belongs to the authenticated user
    createReviewDto.userId = req.user.id;
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get all reviews (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all reviews' })
  @ApiQuery({ name: 'freelancerId', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  findAll(
    @Query('freelancerId') freelancerId?: number,
    @Query('userId') userId?: number,
  ) {
    if (freelancerId) {
      return this.reviewsService.findByFreelancer(freelancerId);
    }
    if (userId) {
      return this.reviewsService.findByUser(userId);
    }
    return this.reviewsService.findAll();
  }

  @Get('freelancer/:freelancerId')
  @ApiOperation({ summary: 'Get reviews for a specific freelancer (Public)' })
  @ApiResponse({ status: 200, description: 'Return reviews for freelancer' })
  findByFreelancer(@Param('freelancerId', ParseIntPipe) freelancerId: number) {
    return this.reviewsService.findByFreelancer(freelancerId);
  }

  @Get('my-reviews')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get current user reviews' })
  @ApiResponse({ status: 200, description: 'Return current user reviews' })
  getMyReviews(@Request() req) {
    return this.reviewsService.findByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get review by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return review by id' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  @Get('freelancer/:freelancerId/average-rating')
  @ApiOperation({ summary: 'Get average rating for a freelancer (Public)' })
  @ApiResponse({ status: 200, description: 'Return average rating' })
  getAverageRating(@Param('freelancerId', ParseIntPipe) freelancerId: number) {
    return this.reviewsService.getAverageRating(freelancerId);
  }

  @Patch(':id')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Update review by id (Owner user only)' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ) {
    // Verify ownership
    const review = await this.reviewsService.findOne(id);
    if (review.userId !== req.user.id) {
      throw new Error('Access denied. You can only update your own reviews.');
    }
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Delete review by id (Owner user only)' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Verify ownership
    const review = await this.reviewsService.findOne(id);
    if (review.userId !== req.user.id) {
      throw new Error('Access denied. You can only delete your own reviews.');
    }
    return this.reviewsService.remove(id);
  }

  @Delete('admin/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Delete review by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Review deleted by admin' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  removeByAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id);
  }
}
