import { Test, TestingModule } from '@nestjs/testing';
import { PostVentaService } from './post_venta.service';

describe('PostVentaService', () => {
  let service: PostVentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostVentaService],
    }).compile();

    service = module.get<PostVentaService>(PostVentaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
