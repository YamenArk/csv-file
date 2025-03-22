import { JwtModuleOptions } from '@nestjs/jwt';
import { JwtConfigService } from 'src/lib/auth/jwt-config-service';

export const jwtConfig = (jwtConfigService: JwtConfigService): JwtModuleOptions => ({
  global: true,
  secret: jwtConfigService.getJwtSecret(),
  signOptions: { expiresIn: '60s' },
});
