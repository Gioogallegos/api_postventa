import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigVarsService {
  PORT: string;
  PROD: boolean = false;
  DB_DB2_CNSTR: string = '';
  DB_DB2_POOL: number = 1;
  DB_DB2_POOL_MAX: number = 15;
  DB_AWS_CNSTR: string = '';
  DB_AWS_POOL: number = 50;

  API_URL_TOKEN_VALIDATION: string = '';

  ENCRYPT_GC_PRIV_KEY: string = '';

  local: boolean = false;

  constructor() {
    this.PORT = process.env.PORT || '80';
    const prod = process.env.PROD
      ? process.env.PROD.toString().toUpperCase()
      : 'NO';
    this.PROD = prod === 'SI' ? true : false;
    this.DB_DB2_CNSTR = process.env.DB_DB2_CNSTR
      ? process.env.DB_DB2_CNSTR.toString()
          .replace(/[%]/g, '=')
          .replace(/[/]/g, ';')
      : '';
    this.DB_DB2_POOL = process.env.DB_DB2_POOL
      ? Number(process.env.DB_DB2_POOL)
      : 1;
    this.DB_DB2_POOL_MAX = process.env.DB_DB2_POOL_MAX
      ? Number(process.env.DB_DB2_POOL_MAX)
      : 15;
    this.DB_AWS_CNSTR = process.env.DB_AWS_CNSTR
      ? process.env.DB_AWS_CNSTR.toString()
      : '';
    this.DB_AWS_POOL = process.env.DB_AWS_POOL
      ? Number(process.env.DB_AWS_POOL)
      : 10;

    // url auth token
    const apiUrlTokenValidation = process.env.API_URL_TOKEN_VALIDATION;
    if (apiUrlTokenValidation)
      this.API_URL_TOKEN_VALIDATION = apiUrlTokenValidation;

    this.local =
      process.env.LOCAL && process.env.LOCAL.toString().toUpperCase() === 'NO'
        ? false
        : true;
  }
}
