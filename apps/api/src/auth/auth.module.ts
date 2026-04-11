import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

const optionalProviders = [];

if (process.env.GOOGLE_CLIENT_ID) {
  optionalProviders.push(GoogleStrategy);
}

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET || 'dev-only-secret-change-in-production',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ...optionalProviders],
  exports: [AuthService],
})
export class AuthModule {}
