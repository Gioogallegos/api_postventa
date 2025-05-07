import {
  CanActivate,
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
  ExecutionContext,
} from '@nestjs/common';
// services
import { ConfigVarsService } from '../configs/config-vars.service';
import { DatabaseAwsService } from '../connections/aws-db.service';
import { HttpService } from '../connections/http.service';
// guards
import { Permisos } from './has-permiso.guard';
// utilities
import { cascadeError } from '../configs/cascade-error';
import { response } from 'express';

export interface RequestApiAuth {
  token: string;
  permisosId?: number[];
}

export interface ResponseApiAuth {
  status: number;
  codResp: string;
  resp: string;
  idLog?: number;
  usuario?: UsuarioToken;
}

export interface UsuarioToken {
  id: number;
  esCliente: boolean;
  esInterno: boolean;
  esAdministrador: boolean;
  permisos: [string, string][];
}

@Injectable()
export class JwtGuard implements CanActivate, OnModuleInit {
  private readonly _baseUrl: string;
  private _permisosBase: number[] = [];

  constructor(
    private readonly _config: ConfigVarsService,
    private readonly _dbAws: DatabaseAwsService,
    private readonly _http: HttpService,
  ) {
    this._baseUrl = this._config.API_URL_TOKEN_VALIDATION
      ? this._config.API_URL_TOKEN_VALIDATION
      : this._config.PROD
      ? 'https://cl-suve-auth-token.aws.paris.cl/api'
      : 'https://cl-suve-auth-token.aws-test.paris.cl/api';
      
  }

  async onModuleInit(): Promise<void> {
    this._permisosBase = await this._getPermisosBase();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();

      let t = '';
      const cookies = req.cookies;
      if (cookies && cookies['Authorization']) {
        t = cookies['Authorization'];
      } else {
        const rhi: number = req.raw.rawHeaders.findIndex(
          (h) => h === 'Authorization' || h === 'authorization',
        ); console.log('rhi:', rhi);
        if (rhi === -1)
          throw new HttpException(
            {
              cod: 5,
              resp: 'Falta token',
            },
            HttpStatus.UNAUTHORIZED,
          );
        t = req.raw.rawHeaders[rhi + 1].split(' ')[1];
      }

      req.usuario = await this._verifyToken(t);
      //req.raw.logApi.idUsuario = req.usuario.id;

      return true;
    } catch (error) {
      console.error('Error en JWTcanActivate:', error);
      throw cascadeError(error, 'JWTcanActivate');
    }
  }

  private async _verifyToken(token: string) {
    console.log('Verificando token:', token);
    console.log('Base URL:', this._baseUrl);
    console.log('Permisos Base:', this._permisosBase);
    try {
      const resp = await this._http.post<
        ResponseApiAuth,
        RequestApiAuth
      >("https://cl-suve-auth-token.aws-test.paris.cl/api/verify/suve", {
        token,
        permisosId: [92],
      });
      const { status, usuario, idLog } = resp;
       console.log('Response:', { status, usuario, idLog });
       console.log("response", resp);
      if (status !== 200)
        throw new HttpException(
          { cod: 1, ignore: { idLogToken: idLog } },
          HttpStatus.UNAUTHORIZED,
        );
      return usuario;
    } catch (error) {
      console.error('Error en _verifyToken:', error);
      return { ok: false };
    }
  }

  private async _getPermisosBase() {
    let o: number = 0;
    const permisosBase: { s: string; m: string }[] = [
      { s: Permisos.GESTION, m: Permisos.POSTVENTA },
    ];
    const query: string[] = [];
    const params: (string | number)[] = [];
    permisosBase.forEach((p) => {
      query.push(`(servicio = $${++o} AND metodo = $${++o})`);
      params.push(p.s, p.m);
    });
    return <number[]>(
      await this._dbAws.call({
        query: `SELECT id FROM permiso WHERE ${query.join(' OR ')}`,
        params,
      })
    ).rows.map(({ id }) => Number(id));
  }
}
