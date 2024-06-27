import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FunctionRootsModule } from './function-roots/function-roots.module';
import { FunctionsModule } from './functions/functions.module';

@Module({
  imports: [FunctionRootsModule, FunctionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
