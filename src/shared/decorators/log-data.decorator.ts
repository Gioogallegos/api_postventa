import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ResponseLogI } from "../interfaces/logs.interface";

export const LogData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ResponseLogI => {
    const req = ctx.switchToHttp().getRequest();
    return req.raw.logApi;
  }
);
