import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';
import { Shorten, ShortenSchema } from '../shorten/schemas/shorten.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shorten.name, schema: ShortenSchema }]),
  ],
  controllers: [RedirectController],
  providers: [RedirectService],
})
export class RedirectModule {}
