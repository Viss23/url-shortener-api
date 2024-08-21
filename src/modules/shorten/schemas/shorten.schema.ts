import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShortenDocument = HydratedDocument<Shorten>;

@Schema()
export class Shorten {
  @Prop()
  original: string;

  @Prop()
  shortCode: string;

  @Prop()
  redirects: number;
}

export const ShortenSchema = SchemaFactory.createForClass(Shorten);
