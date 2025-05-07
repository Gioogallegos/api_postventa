import {
  CanActivate,
  ExecutionContext,
  mixin,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// service
import { LogsService } from '../services/logs.service';

export enum Permisos {
  POSTVENTA = 'POSTVENTA',
  GESTION = 'GESTION',
}

export const HasPermisoGuard = (
  grupo: string | [string, string][],
  subgrupo: string = '',
) => {
  class HasPermisoGuardMixin implements CanActivate {
    constructor(readonly _logsService: LogsService) {}
    canActivate(context: ExecutionContext): boolean {
      const permisosUsuario = context.switchToHttp().getRequest()
        .usuario.permisos;

      const has =
        typeof grupo === 'string'
          ? searchPermisoFromString(permisosUsuario, grupo, subgrupo)
          : searchPermisoFromArray(permisosUsuario, grupo);

      if (!has)
        throw new HttpException(
          {
            cod: 4,
          },
          HttpStatus.UNAUTHORIZED,
        );

      return true;
    }
  }

  const guard = mixin(HasPermisoGuardMixin);
  return guard;
};

export const searchPermisoFromString = (
  permisosUsuario: [string, string][],
  grupo: string,
  subgrupo: string,
): [string, string] | undefined => {
  return permisosUsuario.find(
    (p: [string, string]) => p[0] === grupo && p[1] === subgrupo,
  );
};

export const searchPermisoFromArray = (
  permisos: [string, string][],
  grupos: [string, string][],
): [string, string] | null => {
  let ok: [string, string] | null = null;
  for (let i = 0; i < grupos.length; i++) {
    const [grupo, subgrupo] = grupos[i];
    const exist = permisos.find(
      (p: [string, string]) => p[0] === grupo && p[1] === subgrupo,
    );
    if (exist) {
      ok = exist;
      break;
    }
  }
  return ok;
};
