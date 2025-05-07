import { Module } from '@nestjs/common';
import { PostVentaService } from './post_venta.service';
import { SolicitudController } from './post_venta.controller';
import { DatabaseAwsService } from 'src/shared/connections/aws-db.service';
import { ConfigVarsService } from 'src/shared/configs/config-vars.service';
import { ConfigBaseModule } from 'src/shared/modules/config-base.module';



@Module({
  imports: [ConfigBaseModule],
  controllers: [SolicitudController],
  providers: [PostVentaService, DatabaseAwsService, ConfigVarsService],
})
export class PostVentaModule {}
