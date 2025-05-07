import { Test, TestingModule } from '@nestjs/testing';
import { PostVentaController } from './post_venta.controller';

describe('PostVentaController', () => {
  let controller: PostVentaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostVentaController],
    }).compile();

    controller = module.get<PostVentaController>(PostVentaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
