import { Test, TestingModule } from '@nestjs/testing';
import { ShortenService } from './shorten.service';
import { RedisService } from '../../redis/redis.service';
import { getModelToken } from '@nestjs/mongoose';
import { Shorten } from './schemas/shorten.schema';
import { Model } from 'mongoose';
import { CreateShortenDto } from './dto/shorten.dto';
// import { generateShort } from '../../utils/randomString';

jest.mock('../../utils/randomString', () => ({
  generateShort: jest.fn(() => 'abc123'),
}));

describe('ShortenService', () => {
  let service: ShortenService;
  let redisService: RedisService;
  let shortenModel: Model<Shorten>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortenService,
        {
          provide: RedisService,
          useValue: {
            setEx: jest.fn(),
          },
        },
        {
          provide: getModelToken(Shorten.name),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ShortenService>(ShortenService);
    redisService = module.get<RedisService>(RedisService);
    shortenModel = module.get<Model<Shorten>>(getModelToken(Shorten.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(redisService).toBeDefined();
    expect(shortenModel).toBeDefined();
  });

  describe('create', () => {
    it('should create a shortened URL and store it in Redis', async () => {
      const createShortenDto: CreateShortenDto = { url: 'https://example.com' };
      const shortCode = 'abc123';
      const createdShorten = {
        shortCode,
        redirects: 0,
        original: createShortenDto.url,
        save: jest.fn().mockResolvedValue({
          shortCode,
          redirects: 0,
          original: createShortenDto.url,
        }),
      };

      jest.spyOn(shortenModel, 'create').mockReturnValue(createdShorten as any);
      jest.spyOn(redisService, 'setEx').mockResolvedValue(null);

      const result = await service.create(createShortenDto);

      expect(shortenModel.create).toHaveBeenCalledWith({
        shortCode: expect.any(String),
        redirects: 0,
        original: createShortenDto.url,
      });
      expect(redisService.setEx).toHaveBeenCalledWith(
        shortCode,
        3600,
        createShortenDto.url,
      );
      expect(result).toEqual({
        shortCode,
        redirects: 0,
        original: createShortenDto.url,
      });
    });
  });
});
