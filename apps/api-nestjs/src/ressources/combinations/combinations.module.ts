import { Module } from '@nestjs/common';
import { CombinationsController } from './combinations.controller.js';
import { CombinationsRepository } from './combinations.repository.js';
import { CombinationsService } from './combinations.service.js';

@Module({
  controllers: [CombinationsController],
  providers: [CombinationsService, CombinationsRepository],
})
export class CombinationsModule {}
