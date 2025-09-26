import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategyLib, Profile } from 'passport-google-oauth20';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(GoogleStrategyLib, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_REDIRECT_URI || '',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const oauthId = profile.id;
    const email = profile.emails?.[0]?.value;
    const username = profile.displayName || (email ? email.split('@')[0] : `google_${oauthId}`);

    const user = await this.usersService.oauthLogin('google', oauthId, email, username);
    return user; // 返回给 Passport，AuthController 负责 JWT/cookie
  }
}
