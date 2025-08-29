import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotebooksModule } from './notebooks/notebooks.module';

@Module({
  imports: [NotebooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
