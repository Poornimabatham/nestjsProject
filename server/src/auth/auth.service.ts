import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User, UserDocument } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
    // ,
    // private mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    console.log(user, "user")
    console.log(password, "password")

    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: User | UserDocument) {
    const userId = user._id ? user._id.toString() : (user as any)._id?.toString();
    
    if (!userId) {
      throw new Error('User ID is missing');
    }
    
    const payload: JwtPayload = { 
      email: user.email, 
      sub: userId
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userId,
        email: user.email,
        name: user.name,
      },
    };
  }

  async initiatePasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.userService.findOne(email);
    
    if (!user) {
      // Don't reveal if the user doesn't exist for security reasons
      return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour

    // Save the token and expiry to the user
    await this.userService.update(user._id, {
      resetToken,
      resetTokenExpiry
    });

    // Send email with reset link (you'll need to configure your email service)
    const resetUrl = `http://your-frontend-url.com/reset-password?token=${resetToken}`;
    
    // try {
    //   await this.mailerService.sendMail({
    //     to: user.email,
    //     subject: 'Password Reset Request',
    //     template: 'password-reset',
    //     context: {
    //       name: user.name,
    //       resetUrl,
    //     },
    //   });
    // } catch (error) {
    //   console.error('Error sending password reset email:', error);
    //   throw new Error('Failed to send password reset email');
    // }

    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    // Find user by reset token and check if it's not expired
    const user = await this.userService.findByResetToken(token);
    
    if (!user) {
      throw new NotFoundException('Invalid or expired reset token');
    }

    // Update password and clear reset token
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.update(user._id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: undefined,
    });

    return { message: 'Password has been reset successfully' };
  }

  async signUp(email: string, name: string, password: string) {
    const user = await this.userService.createUser(email, name, password);
    console.log(user,"user")
    return this.login(user);
  }
}
