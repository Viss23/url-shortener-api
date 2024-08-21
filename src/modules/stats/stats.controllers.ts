import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @ApiOperation({ summary: 'Get stats aboutoriginal URL using a short code' })
  @ApiParam({
    name: 'shortCode',
    description: 'The short code associated with the URL to redirect',
    required: true,
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Redirects to the original URL' })
  @ApiResponse({ status: 404, description: 'Short code not found' })
  @Get(':shortCode')
  async redirect(@Param() { shortCode }: { shortCode: string }): Promise<any> {
    const document = await this.statsService.getByShortened(shortCode);

    return { ...document };
  }
}
