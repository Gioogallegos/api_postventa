import { HttpException, HttpStatus } from "@nestjs/common";

export const cascadeError = (error: any, location?: string) => {
  return error instanceof HttpException
    ? <HttpException>error
    : new HttpException(
        {
          cod: 6,
          logDetail: {
            message: error.message,
            location,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
};
