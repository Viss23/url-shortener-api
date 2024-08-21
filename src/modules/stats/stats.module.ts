import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controllers';
import { StatsService } from './stats.service';
import { Shorten, ShortenSchema } from '../shorten/schemas/shorten.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shorten.name, schema: ShortenSchema }]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
