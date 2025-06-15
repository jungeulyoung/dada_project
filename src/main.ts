import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');

   const config = new DocumentBuilder()
    .setTitle('Mini Thinking API')
    .setDescription('Mini Thinking  API 문서입니다.')
    .setVersion('1.0')
    .addTag('mini-thinking')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
