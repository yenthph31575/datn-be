import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';
import { AuthGuard } from './guards/auth.guard';

import { CreateAuthDto, SignInDto } from './dto/create-auth.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

import { User } from '@/shared/decorator/user.decorator';

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
  async googleAuth(@Body() dto: GoogleAuthDto) {
    const googleData = await this.googleAuthService.verify(dto.token);
    return this.authService.handleGoogleAuth(googleData);
  }

  // ========================= SIGN UP =========================
  @Post('sign-up')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  signup(@Body() dto: CreateAuthDto) {
    return this.authService.signup(dto);
  }

  // ========================= SIGN IN =========================
  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  // ========================= PROFILE =========================
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile returned' })
  getProfile(@User() user: { sub: string }) {
    return this.authService.getProfile(user.sub);
  }

  // ========================= VERIFY EMAIL =========================
  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiQuery({
    name: 'token',
    type: String,
    required: true,
    description: 'Email verification token',
  })
  @ApiResponse({ status: 200, description: 'Email verified' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // ========================= RESEND VERIFICATION =========================
  @Post('resend-verification')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200, description: 'Email sent' })
  @ApiResponse({ status: 400, description: 'Email already verified' })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(dto.email);
  }

  // ========================= FORGOT PASSWORD =========================
  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Reset email sent' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  // ========================= RESET PASSWORD =========================
  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
