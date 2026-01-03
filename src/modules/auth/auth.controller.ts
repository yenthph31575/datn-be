import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';
import { AuthGuard } from './guards/auth.guard';

import { CreateAuthDto, SignInDto } from './dto/create-auth.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/forgot-password.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

import { User } from '@/shared/decorator/user.decorator';
import { JwtPayload } from '@/shared/types/jwt-payload.type';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  // ========================= GOOGLE AUTH =========================
  @Post('google')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate with Google' })
  @ApiResponse({ status: 200, description: 'Authenticated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  googleAuth(@Body() dto: GoogleAuthDto) {
    return this.authService.googleLogin(dto.token);
  }

  // ========================= SIGN UP =========================
  @Post('sign-up')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  signup(@Body() dto: CreateAuthDto) {
    return this.authService.signup(dto);
  }

  // ========================= SIGN IN =========================
  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  // ========================= PROFILE =========================
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200 })
  getProfile(@User() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }

  // ========================= VERIFY EMAIL =========================
  @Post('verify-email')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  // ========================= RESEND VERIFICATION =========================
  @Post('resend-verification')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200 })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(dto.email);
  }

  // ========================= FORGOT PASSWORD =========================
  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200 })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  // ========================= RESET PASSWORD =========================
  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200 })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
