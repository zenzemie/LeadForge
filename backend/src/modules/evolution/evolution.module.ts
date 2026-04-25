import { Module } from '@nestjs/common';
import { EvolutionService } from './evolution.service';
import { PrismaModule } from '../../infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EvolutionService],
  exports: [EvolutionService],
})
export class EvolutionModule {}
