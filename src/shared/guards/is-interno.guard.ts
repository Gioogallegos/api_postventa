import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class IsInternoGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { usuario } = context.switchToHttp().getRequest();
    if (usuario.esCliente)
      throw new HttpException(
        {
          cod: 4,
        },
        HttpStatus.UNAUTHORIZED,
      );
    return true;
  }
}
