import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OIDCStrategy, IOIDCStrategyOptionWithoutRequest } from 'passport-azure-ad';
import { UsersService } from '../users/users.service';

@Injectable()
export class AzureStrategy extends PassportStrategy(OIDCStrategy, 'azuread-openidconnect') {
  constructor(private readonly usersService: UsersService) {
    const options: IOIDCStrategyOptionWithoutRequest = {
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || 'common'}/v2.0/.well-known/openid-configuration`,
      clientID: process.env.AZURE_CLIENT_ID!,
      clientSecret: process.env.AZURE_CLIENT_SECRET!,
      responseType: 'code',
      responseMode: 'query',
      redirectUrl: process.env.AZURE_REDIRECT_URI!,
      allowHttpForRedirectUrl: false,
      scope: ['profile', 'offline_access', 'email', 'openid'],
      passReqToCallback: false, // ✅ 必须加上
    };
    super(options);
  }

  async validate(
    iss: any,
    sub: any,
    profile: any,
    accessToken: string,
    refreshToken: string,
    params: any,
    done: Function,
  ): Promise<any> {
    const oauthId = profile.oid || profile.sub || (params && params.id_token);
    const email =
      profile._json && (profile._json.preferred_username || profile._json.email)
        ? profile._json.preferred_username || profile._json.email
        : undefined;
    const username = profile.displayName || (email ? email.split('@')[0] : `azure_${oauthId}`);

    try {
      const user = await this.usersService.oauthLogin('azure', oauthId, email, username);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
