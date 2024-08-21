import { Body, Controller, Post } from '@nestjs/common';
import { CreateShortenDto } from './dto/shorten.dto';
import { ShortenService } from './shorten.service';

@Controller('shorten')
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}

  @Post()
  async generateShort(@Body() data: CreateShortenDto): Promise<any> {
    return this.shortenService.create(data);
  }
}
