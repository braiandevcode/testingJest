// app.module.ts
import { Module } from '@nestjs/common'; // DECORADOR PRINCIPAL PARA DEFINIR MODULOS EN NESTJS
import { TypeOrmModule } from '@nestjs/typeorm'; // MODULO DE TYPEORM PARA CONECTAR BASE DE DATOS
import { ConfigModule, ConfigService } from '@nestjs/config'; // MODULO PARA VARIABLES DE ENTORNO Y SERVICIO DE CONFIG
import { NotebooksModule } from './notebooks/notebooks.module'; // MI MODULO DE NOTEBOOKS
import { AppController } from './app.controller'; // CONTROLADOR PRINCIPAL
import { AppService } from './app.service'; // SERVICIO PRINCIPAL

@Module({
  imports: [
    // CONFIGURACION DE MODULO PARA VARIABLE DE ENTORNOS
    ConfigModule.forRoot({
      // CARGA VARIABLES DE ENTORNO DESDE ARCHIVO .ENV
      isGlobal: true, // DISPONIBLE EN TODA LA APP SIN VOLVER A IMPORTAR
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`, // ARCHIVO .ENV SEGUN EL ENTORNO
    }),
    // CONECTAR BASE DE DATOS
    TypeOrmModule.forRootAsync({
      // CONFIGURA TYPEORM DE FORMA ASÍNCRONA (PERMITE USAR CONFIGSERVICE)
      imports: [ConfigModule], // IMPORTA CONFIGMODULE PARA PODER USAR VARIABLES DE ENTORNO
      inject: [ConfigService], // INYECTA CONFIGSERVICE DENTRO DEL useFactory
      useFactory: (config: ConfigService) => ({
        // FUNCIÓN QUE DEVUELVE LA CONFIG DE LA DB
        type: 'mysql', // TIPO DE BASE DE DATOS
        host: config.get<string>('DB_HOST'), // HOST DE LA DB
        port: config.get<number>('DB_PORT'), // PUERTO DE LA DB
        username: config.get<string>('DB_USERNAME'), // USUARIO DE LA DB
        password: config.get<string>('DB_PASSWORD'), // PASSWORD DE LA DB
        database: config.get<string>('DB_NAME'), // NOMBRE DE LA BASE DE DATOS
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // ENTIDADES QUE VA A LEER
        synchronize: true, // AUTO SINCRONIZA SCHEMA (NO USAR EN PRODUCCIÓN)
      }),
    }),
    NotebooksModule, // REGISTRA MODULO NOTEBOOKS
  ],
  controllers: [AppController], // REGISTRA CONTROLADOR PRINCIPAL
  providers: [AppService], // REGISTRA SERVICIO PRINCIPAL
})
export class AppModule {} // EXPORTA EL MÓDULO PRINCIPAL DE LA APP
