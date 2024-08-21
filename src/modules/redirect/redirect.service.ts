import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Shorten } from '../shorten/schemas/shorten.schema';

@Injectable()
export class RedirectService {
  constructor(
    @InjectModel(Shorten.name) private shortenModel: Model<Shorten>,
  ) {}

  async getByShortened(shortCode: string): Promise<Shorten> {
    console.log('service');
    const shortened = await this.shortenModel
      .findOneAndUpdate(
        { shortCode },
        { $inc: { redirects: 1 } },
        { new: true },
      )
      .exec();
    if (!shortened) {
      throw new NotFoundException('Not Found');
    }
    return shortened.toObject();
  }
}
