import { Module, NestModule, RequestMethod } from '@nestjs/common';

import { PostVentaModule } from './post_venta/post_venta.module';
import { DatabaseAwsService } from './shared/connections/aws-db.service';
import { ConfigVarsService } from './shared/configs/config-vars.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PostVentaModule, ConfigModule.forRoot() ],
  providers: [DatabaseAwsService, ConfigVarsService],
})
export class AppModule implements NestModule { 
  configure(consumer: any) {

  }
}
