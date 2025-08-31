import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signUp(@Body() signUpDto: SignUpDto) {
    console.log('Received signup request with data:', signUpDto);
    try {
      const result = await this.authService.signUp(
        signUpDto.email,
        signUpDto.name,
        signUpDto.password,
      );
      console.log('Signup successful:', result);
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    console.log('Received login request with data:', loginDto);
    try {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
      const result = await this.authService.login(user);
      if (result) {
        
        
      }
    console.log('Login successful:', result);
    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      return await this.authService.initiatePasswordReset(forgotPasswordDto.email);
    } catch (error) {
      // Return success even if there's an error to prevent email enumeration
      return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      return await this.authService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.newPassword
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }
      throw error;
    }
  }
}
