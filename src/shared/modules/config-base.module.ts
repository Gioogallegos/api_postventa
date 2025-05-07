import { Module } from '@nestjs/common';
// services
import { ConfigVarsService } from '../configs/config-vars.service';
import { DatabaseAwsService } from '../connections/aws-db.service';
import { DatabaseDb2Service } from '../connections/db2-db.service';
import { LogsService } from '../services/logs.service';
import { MessagesResponse } from '../configs/messages.service';
import { HttpService } from '../connections/http.service';

@Module({
  controllers: [],
  providers: [
    ConfigVarsService,
    DatabaseAwsService,
    DatabaseDb2Service,
    LogsService,
    MessagesResponse,
    HttpService,
  ],
  exports: [
    ConfigVarsService,
    DatabaseAwsService,
    DatabaseDb2Service,
    LogsService,
    HttpService,
    MessagesResponse,
  ],
})
export class ConfigBaseModule { }
