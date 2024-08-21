import { ApiProperty } from '@nestjs/swagger';

export class CreateShortenDto {
  @ApiProperty({
    default: 'https://www.google.com/',
  })
  url: string;
}
