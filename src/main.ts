import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { NextFunction } from '@fastify/middie';

const allowedMethods = ['GET'];
const allowedMethodsObj = allowedMethods.reduce((obj, m) => {
  obj[m] = true;
  return obj;
}, {});

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  if (!process.env.LOCAL)
    app.use((req: FastifyRequest, res: FastifyReply, next: NextFunction) => {
      if (!allowedMethodsObj[req.method])
        throw new HttpException({}, HttpStatus.METHOD_NOT_ALLOWED);
      next();
    });
  app.enableCors({
    origin: [
      'https://suve.giftcard.cl',
      'https://cl-suve.aws-test.paris.cl',
      'https://cl-suve.aws.paris.cl',
      'http://localhost:4200',
    ],
    methods: allowedMethods,
    allowedHeaders: ['*'],
    credentials: false,
    maxAge: 3600,
    preflightContinue: false,
  });
  app.enableShutdownHooks();
  await app.register(fastifyCookie, {});
  const port = process.env['PORT'] || 80;
  await app.listen(port, '0.0.0.0');
  console.log(`APP RUNNING ON PORT: ${await app.getUrl()} :c`);
}
bootstrap();
