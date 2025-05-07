import { Injectable } from '@nestjs/common';
import { Pool, PoolConfig, QueryResult } from 'pg';
import * as fs from 'fs';

// configs
import { ConfigVarsService } from '../configs/config-vars.service';
// interfaces
import { SqlPGI } from '../interfaces/db.interface';
import { cascadeError } from '../configs/cascade-error';

@Injectable()
export class DatabaseAwsService {
  private _db: Pool;

  constructor(private readonly _config: ConfigVarsService) {
    console.log('DB_AWS_CNSTR:', this._config.DB_AWS_CNSTR);
    const conf: PoolConfig = {
      connectionString: this._config.DB_AWS_CNSTR!,
      max: this._config.DB_AWS_POOL!,
    };
    if (this._config.PROD!)
      conf.ssl = {
        ca: fs.readFileSync('/certs/us-east-1-bundle.pem').toString(),
      };
    this._db = new Pool(conf);
  }

  async call({ query, params }: SqlPGI) {
    try {
      console.log('Ejecutando consulta:', query, 'con parámetros:', params);
      const resp: QueryResult = await this._db.query(query, params);
      return resp;
    } catch (error) {
      console.error('Error en la consulta:', error);
      throw cascadeError(error, 'DBAws:call');
    }
  }
}
