import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UsuarioI } from "../interfaces/usuario.interface";

export const UsuarioToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UsuarioI => {
    const { usuario } = ctx.switchToHttp().getRequest();
    return usuario;
  }
);
