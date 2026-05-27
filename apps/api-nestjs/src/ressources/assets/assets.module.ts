import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller.js';
import { AssetsRepository } from './assets.repository.js';
import { AssetsService } from './assets.service.js';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, AssetsRepository],
})
export class AssetsModule {}
