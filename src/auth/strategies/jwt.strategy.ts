import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret_key',
    });
  }

  async validate(payload: any) {
    try {
      // Try to find the user, but don't throw an error if not found
      await this.authService.findById(payload.sub);
    } catch (error) {
      // User not found, but we'll still return the payload data
      console.log(`User with ID ${payload.sub} not found in database, but JWT is valid`);
    }

    // Return the payload data regardless
    return {
      idUser: payload.sub,
      username: payload.username,
      roles: payload.roles || ['user']
    };
  }
}
