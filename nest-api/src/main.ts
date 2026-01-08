// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS גמיש לפיתוח: עובד גם ל-Next (localhost) וגם למובייל (IP/Emulators)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // הפעלת ולידציה גלובלית (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // מוחק שדות שלא מוגדרים ב-DTO
      forbidNonWhitelisted: true, // מחזיר 400 אם שלחו שדה לא חוקי
      transform: true, // מאפשר class-transformer
    }),
  );

  const port = process.env.PORT ?? 4000;

  // חשוב כדי שהמובייל (Expo) יוכל לגשת דרך ה-IP של המחשב
  await app.listen(port, '0.0.0.0');

  console.log(
    `Nest is running on port ${port} and accessible to all devices on the network`,
  );
}

bootstrap();