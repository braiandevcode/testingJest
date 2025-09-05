import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //EJECUTAR METODO ESTATICO Y PASAR MODULO APP
  await app.listen(process.env.PORT ?? 3000); //==> ESCUCHAND EN PUERTO 3000
}
bootstrap();
