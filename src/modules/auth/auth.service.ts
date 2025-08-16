import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../admins/entities/admin.entity';
import { User, UserType, Gender } from '../users/entities/user.entity';
import { OTP } from './entities/otp.entity';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { SendOtpDto } from './dto/send-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    private jwtService: JwtService,
  ) {}

  async adminLogin(adminLoginDto: AdminLoginDto) {
    const { email, password } = adminLoginDto;
    
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await admin.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email, role: 'admin' };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    };
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { phone } = sendOtpDto;
    
    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    // Save OTP to database
    const otp = this.otpRepository.create({
      phone,
      code: otpCode,
      expiresAt,
    });
    
    await this.otpRepository.save(otp);
    
    // In a real application, you would send this OTP via SMS
    // For now, we'll just return it (remove this in production)
    return {
      message: 'OTP sent successfully',
      otp: otpCode, // Remove this in production
    };
  }

  async userLogin(userLoginDto: UserLoginDto) {
    const { phone, otp } = userLoginDto;
    
    // Find the most recent valid OTP for this phone
    const validOtp = await this.otpRepository.findOne({
      where: {
        phone,
        code: otp,
        isUsed: false,
        isExpired: false,
      },
      order: { createdAt: 'DESC' },
    });

    if (!validOtp || new Date() > validOtp.expiresAt) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark OTP as used
    validOtp.isUsed = true;
    await this.otpRepository.save(validOtp);

    // Find user
    let user = await this.userRepository.findOne({ 
      where: { phone },
      relations: ['cities']
    });
    
    if (!user) {
      // Auto-create regular user if they don't exist
      // Note: We need to set a default gender since it's now required
      user = this.userRepository.create({
        phone,
        name: `User_${phone.slice(-4)}`, // Generate a default name
        type: UserType.USER,
        gender: Gender.MALE, // Default gender - user can update later
        isPhoneVerified: true,
        isActive: true,
        cities: [], // Empty cities array, user can update later
      });
      user = await this.userRepository.save(user);
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    // Mark phone as verified if not already
    if (!user.isPhoneVerified) {
      user.isPhoneVerified = true;
      await this.userRepository.save(user);
    }

    const payload = { 
      sub: user.id, 
      phone: user.phone, 
      role: user.type === UserType.FREELANCER ? 'freelancer' : 'user',
      type: user.type
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        type: user.type,
        gender: user.gender,
        cities: user.cities,
        bio: user.bio,
        portfolio: user.portfolio,
      },
    };
  }

  async freelancerLogin(userLoginDto: UserLoginDto) {
    const { phone, otp } = userLoginDto;
    
    // Find the most recent valid OTP for this phone
    const validOtp = await this.otpRepository.findOne({
      where: {
        phone,
        code: otp,
        isUsed: false,
        isExpired: false,
      },
      order: { createdAt: 'DESC' },
    });

    if (!validOtp || new Date() > validOtp.expiresAt) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark OTP as used
    validOtp.isUsed = true;
    await this.otpRepository.save(validOtp);

    // Find freelancer (user with type FREELANCER)
    const freelancer = await this.userRepository.findOne({ 
      where: { phone, type: UserType.FREELANCER },
      relations: ['cities']
    });
    
    if (!freelancer) {
      throw new BadRequestException('Freelancer not found. Please contact admin to create your account.');
    }

    if (!freelancer.isActive) {
      throw new UnauthorizedException('Freelancer account is deactivated');
    }

    // Mark phone as verified if not already
    if (!freelancer.isPhoneVerified) {
      freelancer.isPhoneVerified = true;
      await this.userRepository.save(freelancer);
    }

    const payload = { 
      sub: freelancer.id, 
      phone: freelancer.phone, 
      role: 'freelancer',
      type: UserType.FREELANCER
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      freelancer: {
        id: freelancer.id,
        name: freelancer.name,
        phone: freelancer.phone,
        type: freelancer.type,
        gender: freelancer.gender,
        cities: freelancer.cities,
        bio: freelancer.bio,
        portfolio: freelancer.portfolio,
      },
    };
  }
}
