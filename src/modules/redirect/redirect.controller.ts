import { Controller, Get, Param, Res, UseInterceptors } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { Response } from 'express';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CacheInterceptor } from 'src/common/interceptors/cache.interceptor';

@Controller('redirect')
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @ApiOperation({ summary: 'Redirect to the original URL using a short code' })
  @ApiParam({
    name: 'shortCode',
    description: 'The short code associated with the URL to redirect',
    required: true,
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Redirects to the original URL' })
  @ApiResponse({ status: 404, description: 'Short code not found' })
  @Get(':shortCode')
  @UseInterceptors(CacheInterceptor)
  async redirect(
    @Param() { shortCode }: { shortCode: string },
    @Res() res: Response,
  ): Promise<any> {
    const document = await this.redirectService.getByShortened(shortCode);
    const originalUrl = document?.original;
    res.redirect(originalUrl);
    return { url: originalUrl };
  }
}
