import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Shorten } from './schemas/shorten.schema';
import { CreateShortenDto } from './dto/shorten.dto';
import { generateShort } from '../../utils/randomString';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class ShortenService {
  constructor(
    private redisService: RedisService,
    @InjectModel(Shorten.name) private shortenModel: Model<Shorten>,
  ) {}

  async create(createShortenDto: CreateShortenDto): Promise<Shorten> {
    const createdShorten = await this.shortenModel.create({
      shortCode: generateShort(),
      redirects: 0,
      original: createShortenDto.url,
    });

    await this.redisService.setEx(
      createdShorten.shortCode,
      3600,
      createdShorten.original,
    );
    return createdShorten.save();
  }
}
