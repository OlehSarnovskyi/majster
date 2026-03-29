import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Request()
    req: {
      user: {
        googleId: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar?: string;
      };
    },
    @Res() res: Response
  ) {
    const result = await this.authService.googleLogin(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    res.redirect(
      `${frontendUrl}/auth/callback?token=${result.accessToken}`
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: { user: { id: string } }) {
    return this.authService.validateUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('role')
  updateRole(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateRoleDto
  ) {
    return this.authService.updateRole(req.user.id, dto.role as Role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @Request() req: { user: { id: string } },
    @Body() dto: { firstName?: string; lastName?: string; phone?: string; bio?: string }
  ) {
    return this.authService.updateProfile(req.user.id, dto);
  }
}
