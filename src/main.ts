import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; //3amalnaha lama 3amalna import lel validation part (f createuserdto 3amalna install npm install class-validator class-transformer)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());//same doen when we did el validation 
  await app.listen(process.env.PORT ?? 4006);
}
bootstrap();
