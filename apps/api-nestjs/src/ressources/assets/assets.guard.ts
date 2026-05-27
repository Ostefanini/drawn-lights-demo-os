import { CanActivate, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfig } from '../../common/config/environment.config.js';

@Injectable()
export class ProductionAssetsGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(): boolean {
    console.log(
      'Checking if asset upload is allowed in the current environment...',
    );
    const nodeEnv = this.configService.get<EnvironmentConfig['nodeEnv']>(
      'environment.nodeEnv',
    );
    console.log(`Current environment: ${nodeEnv}`);
    return nodeEnv !== 'production';
  }
}
