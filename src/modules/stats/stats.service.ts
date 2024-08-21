import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Shorten } from '../shorten/schemas/shorten.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Shorten.name) private shortenModel: Model<Shorten>,
  ) {}

  async getByShortened(shortCode: string): Promise<Shorten> {
    const shortened = await this.shortenModel.findOne({ shortCode }).exec();
    if (!shortened) {
      throw new NotFoundException('Not Found');
    }
    return shortened.toObject();
  }
}
