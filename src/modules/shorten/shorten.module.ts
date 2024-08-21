import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortenController } from './shorten.controller';
import { ShortenService } from './shorten.service';
import { Shorten, ShortenSchema } from './schemas/shorten.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shorten.name, schema: ShortenSchema }]),
  ],
  controllers: [ShortenController],
  providers: [ShortenService],
})
export class ShortenModule {}
