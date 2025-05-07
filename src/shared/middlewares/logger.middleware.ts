import { NestMiddleware, mixin, Req, Res } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";

export function LoggerMiddleware(operation: string) {
  class LoggerMiddlewareMixin implements NestMiddleware {
    use(
      @Req() req: FastifyRequest,
      @Res() res: FastifyReply,
      next: () => void
    ) {
      req["logApi"] = {
        completed: false,
        operation,
        idUsuario: 0,
        resp: {
          codResp: "",
          resp: "",
        },
        request: {
          ip: req.headers["x-forwarded-for"] || req.ip,
        },
        response: {},
      };
      next();
    }
  }
  const middleware = mixin(LoggerMiddlewareMixin);
  return middleware;
}
