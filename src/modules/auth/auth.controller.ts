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
  constructor(private readonly authService: AuthService) {}

  // ========================= GOOGLE AUTH =========================
  @Post('google')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate with Google' })
  @ApiBody({ type: GoogleAuthDto })
  @ApiResponse({ status: 200, description: 'Authenticated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  googleAuth(@Body() dto: GoogleAuthDto): Promise<unknown> {
    return this.authService.googleLogin(dto.token);
  }

  // ========================= SIGN UP =========================
  @Post('sign-up')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: CreateAuthDto })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  signup(@Body() dto: CreateAuthDto): Promise<unknown> {
    return this.authService.signup(dto);
  }

  // ========================= SIGN IN =========================
  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signin(@Body() dto: SignInDto): Promise<unknown> {
    return this.authService.signin(dto);
  }

  // ========================= PROFILE =========================
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200 })
  getProfile(@User() user: JwtPayload): Promise<unknown> {
    return this.authService.getProfile(user.sub);
  }

  // ========================= VERIFY EMAIL =========================
  @Post('verify-email')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  verifyEmail(@Body() dto: VerifyEmailDto): Promise<unknown> {
    return this.authService.verifyEmail(dto.token);
  }

  // ========================= RESEND VERIFICATION =========================
  @Post('resend-verification')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiBody({ type: ResendVerificationDto })
  @ApiResponse({ status: 200 })
  resendVerification(
    @Body() dto: ResendVerificationDto,
  ): Promise<unknown> {
    return this.authService.resendVerificationEmail(dto.email);
  }

  // ========================= FORGOT PASSWORD =========================
  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200 })
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<unknown> {
    return this.authService.forgotPassword(dto.email);
  }

  // ========================= RESET PASSWORD =========================
  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200 })
  resetPassword(@Body() dto: ResetPasswordDto): Promise<unknown> {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
