import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-execution.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Your Angular app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
