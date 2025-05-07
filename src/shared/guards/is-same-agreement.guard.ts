import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Injectable()
export class IsSameAgreementGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const {
      body: { origen, destino },
    } = context.switchToHttp().getRequest();
    if (`${origen}`.slice(0, 8) !== `${destino}`.slice(0, 8))
      throw new HttpException(
        {
          cod: 5,
          resp: "Origen y Destino pertenecen a diferentes Convenio",
        },
        HttpStatus.BAD_REQUEST
      );
    return true;
  }
}
