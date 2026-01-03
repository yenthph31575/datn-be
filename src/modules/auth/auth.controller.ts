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
  ApiBody,
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
  @ApiBody({ type: GoogleAuthDto })
  @ApiResponse({ status: 200, description: 'Authenticated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  async googleAuth(@Body() dto: GoogleAuthDto) {
    const googleData = await this.googleAuthService.verify(dto.token);
    return this.authService.handleGoogleAuth(googleData);
  }

  // ========================= SIGN UP =========================
  @Post('sign-up')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: CreateAuthDto })
  signup(@Body() dto: CreateAuthDto) {
    return this.authService.signup(dto);
  }

  // ========================= SIGN IN =========================
  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: SignInDto })
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  // ========================= PROFILE =========================
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@User() user: { sub: string }) {
    return this.authService.getProfile(user.sub);
  }

  // ========================= VERIFY EMAIL =========================
  @Post('verify-email')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'verify-token' },
      },
      required: ['token'],
    },
  })
  verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // ========================= RESEND VERIFICATION =========================
  @Post('resend-verification')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiBody({ type: ResendVerificationDto })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(dto.email);
  }

  // ========================= FORGOT PASSWORD =========================
  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  // ========================= RESET PASSWORD =========================
  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordDto })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
