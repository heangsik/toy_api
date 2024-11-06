import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { transport } from 'winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { PrismaService } from './prisma/prisma.service';
import { AllExceptionFilterFilter } from './util/all-exception-filter.filter';
import { LoggingInterceptor } from './util/logging.interceptor';

const ProjectName = process.env.APP_NAME ?? 'NotSetting AppName';

// API 문서 설정
const config = new DocumentBuilder()
  .setTitle('Toy Project Api')
  .setDescription('간단한 토이프로젝트 API 입니다.')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

// 콘솔 로거 설정
const consoleLogger = new winston.transports.Console({
  level: 'silly',
  format: winston.format.combine(
    winston.format.timestamp(),
    nestWinstonModuleUtilities.format.nestLike(ProjectName, {
      colors: true,
      prettyPrint: true,
      processId: true,
      appName: true,
    }),
  ),
});

// 파일 로거 설정
const fileLogger = new winstonDaily({
  json: true,
  level: 'silly',
  dirname: 'logs',
  datePattern: 'YYYY.MM.DD',
  filename: 'dailylog-%DATE%.log',
  maxSize: '0.1m', // 0.1MB
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    winston.format.printf(({ timestamp, level, message }) => {
      const formattedTimestamp = new Date(timestamp).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      return `${ProjectName} ${formattedTimestamp}    ${level.toUpperCase()} ${message}`;
    }),
  ),
});
const validatorPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  // exceptionFactory: (errors) => {
  //   const messages = errors.map((error) => {
  //     return {
  //       property: error.property,
  //       value: error.value,
  //       constraints: error.constraints,
  //     };
  //   });
  //   Logger.error('validation error', JSON.stringify(messages));
  //   return new BadRequestException({
  //     messages: 'Validation Error',
  //     errors: messages,
  //   });
  // },
  // disableErrorMessages: true,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [consoleLogger, fileLogger],
    }),
  });

  app.useGlobalPipes(validatorPipe);
  app.useGlobalFilters(new AllExceptionFilterFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // cors 설정
  app.enableCors({
    origin: ['http://localhost:5173','http://localhost:9988'],
    methods: 'GET, POST, PUT, DELETE, PATCH',
    credentials: true,
  });

  // shutdown hook 설정
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // api 문서
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // 서버 구동
  await app.listen(process.env.PORT ?? 3000);

  // 서버 구동 포트 확인
  const port = app.getHttpServer().address().port;

  // 시작 로그
  Logger.log(
    `Starting ${ProjectName} Application Startting~~~[${port}]`,
    'Bootstrap',
  );
}
bootstrap();
